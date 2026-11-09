import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/login-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Log in",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="mx-auto flex max-w-7xl items-center justify-center px-5 py-10 lg:px-8 lg:py-16">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-2xl border border-border bg-card shadow-[8px_8px_0_var(--primary)] lg:grid-cols-[.9fr_1.1fr]">
          <aside className="hidden flex-col justify-between bg-primary p-10 text-primary-foreground lg:flex">
            <div>
              <p className="eyebrow !text-primary-foreground/70">Welcome back</p>
              <h1 className="mt-5 text-5xl font-black leading-[.94] tracking-[-.06em]">
                Good things happen when we show up.
              </h1>
            </div>
            <p className="max-w-xs text-sm font-semibold leading-6 text-primary-foreground/75">
              Find your people, join meaningful work, and keep building a kinder
              neighborhood together.
            </p>
          </aside>

          <div className="p-6 sm:p-10">
            <p className="eyebrow">Sign in</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight">
              Welcome back.
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Log in to see what your community is planning.
            </p>

            <Suspense
              fallback={
                <div className="mt-8 grid gap-3">
                  <div className="h-11 animate-pulse rounded-lg bg-muted" />
                  <div className="h-11 animate-pulse rounded-lg bg-muted" />
                  <div className="h-11 animate-pulse rounded-lg bg-muted" />
                </div>
              }
            >
              <LoginForm />
            </Suspense>

            <p className="mt-7 text-center text-sm text-muted-foreground">
              New to PlanSocial?{" "}
              <Link
                href="/register"
                className="font-black text-primary hover:underline"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
