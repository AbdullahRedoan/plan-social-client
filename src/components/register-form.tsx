"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Check, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { isHttpUrl } from "@/lib/event-form";

const passwordPattern = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

function safeNext(value: string | null) {
  return value && value.startsWith("/") ? value : "/events";
}

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = safeNext(searchParams.get("next"));
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pending, setPending] = useState(false);
  const [socialPending, setSocialPending] = useState<"google" | "github" | null>(
    null,
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const photoURL = String(formData.get("photoURL") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");
    const accepted = formData.get("terms") === "on";

    if (name.length < 2) {
      toast.error("Enter your full name.");
      return;
    }

    if (!email) {
      toast.error("Enter your email address.");
      return;
    }

    if (!isHttpUrl(photoURL)) {
      toast.error("Photo URL must be a valid http or https link.");
      return;
    }

    if (!passwordPattern.test(password)) {
      toast.error(
        "Password must be at least 8 characters and include one uppercase letter and one number.",
      );
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (!accepted) {
      toast.error("Please accept the community guidelines to continue.");
      return;
    }

    setPending(true);

    try {
      const { error } = await authClient.signUp.email({
        name,
        email,
        password,
        image: photoURL,
      });

      if (error) {
        toast.error(error.message ?? "Could not create your account.");
        return;
      }

      toast.success("Account created. Welcome to PlanSocial!");
      router.push(next);
      router.refresh();
    } catch {
      toast.error("Could not create your account right now.");
    } finally {
      setPending(false);
    }
  }

  async function handleSocial(provider: "google" | "github") {
    setSocialPending(provider);

    try {
      const { error } = await authClient.signIn.social({
        provider,
        callbackURL: next,
      });

      if (error) {
        toast.error(error.message ?? `Could not continue with ${provider}.`);
      }
    } catch {
      toast.error(`Could not continue with ${provider}.`);
    } finally {
      setSocialPending(null);
    }
  }

  return (
    <>
      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => handleSocial("google")}
          disabled={socialPending !== null || pending}
          className="h-11 justify-center gap-2 font-bold"
        >
          {socialPending === "google" ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <span className="font-black">G</span>
          )}
          Google
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => handleSocial("github")}
          disabled={socialPending !== null || pending}
          className="h-11 justify-center gap-2 font-bold"
        >
          {socialPending === "github" ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <span className="font-black">GH</span>
          )}
          GitHub
        </Button>
      </div>

      <div className="my-7 flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        or
        <span className="h-px flex-1 bg-border" />
      </div>

      <form className="grid gap-5" onSubmit={handleSubmit} noValidate>
        <div className="grid gap-2">
          <label className="text-sm font-bold" htmlFor="register-name">
            Your name
          </label>
          <Input
            id="register-name"
            name="name"
            required
            autoComplete="name"
            placeholder="Alex Morgan"
            className="h-11"
          />
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-bold" htmlFor="register-email">
            Email address
          </label>
          <Input
            id="register-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            className="h-11"
          />
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-bold" htmlFor="register-photo">
            Photo URL
          </label>
          <Input
            id="register-photo"
            name="photoURL"
            type="url"
            required
            placeholder="https://example.com/your-photo.jpg"
            className="h-11"
          />
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-bold" htmlFor="register-password">
            Password
          </label>
          <span className="relative">
            <Input
              id="register-password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              minLength={8}
              autoComplete="new-password"
              placeholder="Create a password"
              className="h-11 pr-11"
            />
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((visible) => !visible)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </span>
        </div>

        <div className="grid gap-1 rounded-lg bg-muted p-3 text-xs font-semibold text-muted-foreground">
          <p className="font-black text-foreground">Password must include:</p>
          <span>
            <Check className="mr-1 inline size-3" />
            8 or more characters
          </span>
          <span>
            <Check className="mr-1 inline size-3" />
            One uppercase letter and one number
          </span>
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-bold" htmlFor="register-confirm">
            Confirm password
          </label>
          <span className="relative">
            <Input
              id="register-confirm"
              name="confirmPassword"
              type={showConfirm ? "text" : "password"}
              required
              minLength={8}
              autoComplete="new-password"
              placeholder="Repeat your password"
              className="h-11 pr-11"
            />
            <button
              type="button"
              aria-label={showConfirm ? "Hide password" : "Show password"}
              onClick={() => setShowConfirm((visible) => !visible)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </span>
        </div>

        <label className="flex items-start gap-2 text-sm font-semibold text-muted-foreground">
          <input
            type="checkbox"
            name="terms"
            required
            className="mt-1 size-4 accent-primary"
          />
          <span>
            I agree to the{" "}
            <Link href="/register" className="font-bold text-primary hover:underline">
              community guidelines
            </Link>{" "}
            and to treating every neighbor with respect.
          </span>
        </label>

        <Button
          type="submit"
          disabled={pending}
          className="h-11 w-full font-bold"
        >
          {pending ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Creating account…
            </>
          ) : (
            <>
              Create account <ArrowRight size={16} />
            </>
          )}
        </Button>
      </form>
    </>
  );
}
