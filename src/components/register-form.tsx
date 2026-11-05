"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="mt-8 flex flex-col items-start gap-3">
        <span className="grid size-11 place-items-center rounded-full bg-primary/10 text-primary">
          <Check size={20} />
        </span>
        <p className="text-lg font-black">Account created.</p>
        <p className="text-sm text-muted-foreground">
          Registration is not connected yet — this is a UI preview.
        </p>
        <Button
          render={<Link href="/events" />}
          className="mt-2 h-11 px-5 font-bold"
        >
          Explore events <ArrowRight size={16} />
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <Button
          type="button"
          variant="outline"
          className="h-11 justify-center gap-2"
        >
          <span className="font-black">G</span> Google
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-11 justify-center gap-2"
        >
          <span className="font-black">GH</span> GitHub
        </Button>
      </div>

      <div className="my-7 flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        or
        <span className="h-px flex-1 bg-border" />
      </div>

      <form
        className="grid gap-5"
        onSubmit={(event) => {
          event.preventDefault();
          setSubmitted(true);
        }}
      >
        <div className="grid gap-2">
          <label className="text-sm font-bold" htmlFor="register-name">
            Your name
          </label>
          <Input
            id="register-name"
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
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
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
          <input type="checkbox" required className="mt-1 size-4 accent-primary" />
          <span>
            I agree to the{" "}
            <a href="#" className="font-bold text-primary hover:underline">
              community guidelines
            </a>{" "}
            and the{" "}
            <a href="#" className="font-bold text-primary hover:underline">
              privacy policy
            </a>
            .
          </span>
        </label>

        <Button type="submit" className="h-11 w-full font-bold">
          Create account <ArrowRight size={16} />
        </Button>
      </form>
    </>
  );
}
