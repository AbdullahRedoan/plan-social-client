"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

function safeNext(value: string | null) {
  return value && value.startsWith("/") ? value : "/events";
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = safeNext(searchParams.get("next"));
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setPending] = useState(false);
  const [socialPending, setSocialPending] = useState<"google" | "github" | null>(
    null,
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const rememberMe = formData.get("rememberMe") === "on";

    if (!email || !password) {
      toast.error("Enter your email and password.");
      return;
    }

    setPending(true);

    try {
      const { error } = await authClient.signIn.email({
        email,
        password,
        rememberMe,
      });

      if (error) {
        toast.error(
          error.message ?? "Could not log in with those credentials.",
        );
        return;
      }

      toast.success("Welcome back!");
      router.push(next);
      router.refresh();
    } catch {
      toast.error("Could not log in right now. Please try again.");
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
          Continue with Google
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
          <label className="text-sm font-bold" htmlFor="login-email">
            Email address
          </label>
          <Input
            id="login-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            className="h-11"
          />
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-bold" htmlFor="login-password">
            Password
          </label>
          <span className="relative">
            <Input
              id="login-password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
              placeholder="Enter your password"
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

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 font-semibold">
            <input
              type="checkbox"
              name="rememberMe"
              defaultChecked
              className="size-4 accent-primary"
            />
            Remember me
          </label>
          <Link
            href="/register"
            className="font-bold text-primary hover:underline"
          >
            Need an account?
          </Link>
        </div>

        <Button
          type="submit"
          disabled={pending}
          className="h-11 w-full font-bold"
        >
          {pending ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Logging in…
            </>
          ) : (
            <>
              Log in <ArrowRight size={16} />
            </>
          )}
        </Button>
      </form>
    </>
  );
}
