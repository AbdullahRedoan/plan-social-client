"use client";

import { Suspense, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HeartHandshake, Menu, Moon, Sun, X } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/events", label: "Upcoming events" },
  { href: "/create-event", label: "Create event" },
  { href: "/manage-events", label: "Manage events" },
  { href: "/joined-events", label: "Joined events" },
];

type NavItemsProps = {
  pathname: string | null;
  variant: "desktop" | "mobile";
  onNavigate?: () => void;
};

function isActive(pathname: string | null, href: string) {
  return pathname === href || Boolean(pathname?.startsWith(`${href}/`));
}

function NavItems({ pathname, variant, onNavigate }: NavItemsProps) {
  return (
    <>
      {links.map((link) => {
        const active = isActive(pathname, link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              variant === "desktop"
                ? "transition hover:text-foreground"
                : "rounded-lg px-3 py-2 text-sm font-bold",
              active
                ? variant === "desktop"
                  ? "text-primary underline decoration-2 underline-offset-4"
                  : "bg-secondary text-primary"
                : "text-muted-foreground",
              variant === "mobile" && !active && "hover:bg-secondary",
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </>
  );
}

function DesktopNav() {
  const pathname = usePathname();
  return <NavItems pathname={pathname} variant="desktop" />;
}

function MobileNav({ onNavigate }: { onNavigate: () => void }) {
  const pathname = usePathname();
  return <NavItems pathname={pathname} variant="mobile" onNavigate={onNavigate} />;
}

function subscribeToTheme(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}

function useIsDark() {
  return useSyncExternalStore(
    subscribeToTheme,
    () => document.documentElement.classList.contains("dark"),
    () => false,
  );
}

export function SiteHeader() {
  const dark = useIsDark();
  const [menuOpen, setMenuOpen] = useState(false);

  function toggleTheme() {
    document.documentElement.classList.toggle("dark", !dark);
  }

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-5 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2.5 text-lg font-black tracking-tight"
        >
          <span className="grid size-9 rotate-[-4deg] place-items-center rounded-lg bg-primary text-primary-foreground shadow-[3px_3px_0_var(--foreground)]">
            <HeartHandshake size={18} />
          </span>
          Plan<span className="text-primary">Social</span>
        </Link>

        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-5 text-sm font-semibold md:flex"
        >
          <Suspense fallback={<NavItems pathname={null} variant="desktop" />}>
            <DesktopNav />
          </Suspense>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="hidden rounded-lg px-3 py-2 text-sm font-bold transition hover:bg-secondary sm:block"
          >
            Log in
          </Link>
          <Link
            href="/register"
            className="hidden rounded-lg bg-primary px-3 py-2 text-sm font-bold text-primary-foreground shadow-[3px_3px_0_var(--foreground)] transition hover:opacity-90 sm:block"
          >
            Sign up
          </Link>
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            aria-pressed={dark}
            className="grid size-10 place-items-center rounded-lg border border-border bg-card text-foreground transition hover:-translate-y-0.5"
          >
            {dark ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            className="grid size-10 place-items-center rounded-lg border border-border md:hidden"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav
          aria-label="Mobile navigation"
          className="border-t border-border px-5 py-4 md:hidden"
        >
          <div className="flex flex-col gap-1">
            <Suspense
              fallback={
                <NavItems
                  pathname={null}
                  variant="mobile"
                  onNavigate={closeMenu}
                />
              }
            >
              <MobileNav onNavigate={closeMenu} />
            </Suspense>
            <div className="mt-2 flex gap-2 border-t border-border pt-3">
              <Link
                href="/login"
                onClick={closeMenu}
                className="flex-1 rounded-lg border border-border px-3 py-2 text-center text-sm font-bold"
              >
                Log in
              </Link>
              <Link
                href="/register"
                onClick={closeMenu}
                className="flex-1 rounded-lg bg-primary px-3 py-2 text-center text-sm font-bold text-primary-foreground"
              >
                Sign up
              </Link>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
