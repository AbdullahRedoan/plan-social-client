"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="mt-8 flex flex-col items-start gap-3">
        <span className="grid size-11 place-items-center rounded-full bg-primary/10 text-primary">
          <Check size={20} />
        </span>
        <p className="text-lg font-black">You&apos;re signed in.</p>
        <p className="text-sm text-muted-foreground">
          Authentication is not connected yet — this is a UI preview.
        </p>
        <Button
          render={<Link href="/events" />}
          className="mt-2 h-11 px-5 font-bold"
        >
          Browse events <ArrowRight size={16} />
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
          <span className="font-black">G</span> Continue with Google
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
          <label className="text-sm font-bold" htmlFor="login-email">
            Email address
          </label>
          <Input
            id="login-email"
            type="email"
            required
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
              type={showPassword ? "text" : "password"}
              required
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
            <input type="checkbox" className="size-4 accent-primary" />
            Remember me
          </label>
          <button type="button" className="font-bold text-primary hover:underline">
            Forgot password?
          </button>
        </div>

        <Button type="submit" className="h-11 w-full font-bold">
          Log in <ArrowRight size={16} />
        </Button>
      </form>
    </>
  );
}
