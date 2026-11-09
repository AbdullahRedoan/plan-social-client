import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { RegisterForm } from "@/components/register-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Create an account",
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="mx-auto flex max-w-7xl items-center justify-center px-5 py-10 lg:px-8 lg:py-16">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-2xl border border-border bg-card shadow-[8px_8px_0_var(--primary)] lg:grid-cols-[1.1fr_.9fr]">
          <div className="p-6 sm:p-10">
            <p className="eyebrow">Join the movement</p>
            <h1 className="mt-3 text-3xl font-black tracking-tight">
              Create your account.
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Start finding and organizing good things near you.
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
              <RegisterForm />
            </Suspense>

            <p className="mt-7 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-black text-primary hover:underline"
              >
                Log in
              </Link>
            </p>
          </div>

          <aside className="hidden flex-col justify-between bg-primary p-10 text-primary-foreground lg:flex">
            <div>
              <p className="eyebrow !text-primary-foreground/70">PlanSocial</p>
              <h2 className="mt-5 text-5xl font-black leading-[.94] tracking-[-.06em]">
                Make time for what matters.
              </h2>
            </div>
            <p className="max-w-xs text-sm font-semibold leading-6 text-primary-foreground/75">
              A softer, simpler way to make a difference with the people around
              you.
            </p>
          </aside>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
