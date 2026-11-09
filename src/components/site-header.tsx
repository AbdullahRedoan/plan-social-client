"use client";

import {
  Suspense,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  CalendarPlus,
  CalendarRange,
  ChevronDown,
  HeartHandshake,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Sun,
  UserRound,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const publicLinks = [{ href: "/events", label: "Upcoming events" }];

const accountLinks = [
  { href: "/create-event", label: "Create event", icon: CalendarPlus },
  { href: "/manage-events", label: "Manage events", icon: LayoutDashboard },
  { href: "/joined-events", label: "Joined events", icon: CalendarRange },
  { href: "/profile", label: "Profile", icon: UserRound },
];

function isActive(pathname: string | null, href: string) {
  return pathname === href || Boolean(pathname?.startsWith(`${href}/`));
}

function initials(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "P"
  );
}

function Avatar({
  name,
  image,
  size = "md",
}: {
  name: string;
  image?: string | null;
  size?: "md" | "lg";
}) {
  const className =
    size === "lg"
      ? "size-12 text-base"
      : "size-9 text-xs";

  if (image) {
    return (
      // User-provided URLs can point at any host, so a plain img is deliberate.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={image}
        alt={name}
        title={name}
        className={cn(
          "shrink-0 rounded-full border border-border object-cover",
          className,
        )}
      />
    );
  }

  return (
    <span
      title={name}
      className={cn(
        "grid shrink-0 place-items-center rounded-full bg-primary font-black text-primary-foreground",
        className,
      )}
    >
      {initials(name)}
    </span>
  );
}

function NavItems({
  pathname,
  variant,
  onNavigate,
}: {
  pathname: string | null;
  variant: "desktop" | "mobile";
  onNavigate?: () => void;
}) {
  return (
    <>
      {publicLinks.map((link) => {
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

const subscribeToNothing = () => () => {};

function ThemeButton() {
  const { resolvedTheme, setTheme } = useTheme();
  // Theme is unknown during the static render, so read it only after hydration.
  const mounted = useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false,
  );
  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle dark mode"
      aria-pressed={isDark}
      className="grid size-10 place-items-center rounded-lg border border-border bg-card text-foreground transition hover:-translate-y-0.5"
    >
      {isDark ? <Sun size={17} /> : <Moon size={17} />}
    </button>
  );
}

function MenuLink({
  href,
  label,
  icon: Icon,
  onClick,
}: {
  href: string;
  label: string;
  icon: (props: { size?: number; className?: string }) => ReactNode;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-bold text-foreground transition hover:bg-secondary"
    >
      <Icon size={16} className="text-muted-foreground" />
      {label}
    </Link>
  );
}

function useSignOut(onDone?: () => void) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function signOut() {
    setPending(true);

    try {
      const { error } = await authClient.signOut();

      if (error) {
        toast.error(error.message ?? "Could not log out. Please try again.");
        return;
      }

      toast.success("You have been logged out.");
      onDone?.();
      router.push("/");
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return { signOut, pending };
}

function UserMenu() {
  const { data, isPending } = authClient.useSession();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { signOut, pending } = useSignOut(() => setOpen(false));

  useEffect(() => {
    if (!open) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  if (isPending) {
    return (
      <span
        aria-label="Loading account"
        className="size-9 animate-pulse rounded-full bg-muted"
      />
    );
  }

  if (!data?.user) {
    return (
      <>
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
      </>
    );
  }

  const user = data.user;

  return (
    <div ref={menuRef} className="relative">
      <div className="group relative">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-haspopup="menu"
          aria-expanded={open}
          aria-label={`Account menu for ${user.name}`}
          className="flex items-center gap-1.5 rounded-full border border-border bg-card p-0.5 pr-1.5 transition hover:border-primary"
        >
          <Avatar name={user.name} image={user.image} />
          <ChevronDown
            size={14}
            className={cn(
              "text-muted-foreground transition",
              open && "rotate-180",
            )}
          />
        </button>
        <span className="pointer-events-none absolute right-0 top-full z-50 mt-2 hidden whitespace-nowrap rounded-md bg-foreground px-2.5 py-1 text-xs font-bold text-background group-hover:block">
          {user.name}
        </span>
      </div>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-3 w-64 overflow-hidden rounded-xl border border-border bg-popover p-2 text-popover-foreground shadow-xl"
        >
          <div className="flex items-center gap-3 rounded-lg bg-secondary p-3">
            <Avatar name={user.name} image={user.image} size="lg" />
            <div className="min-w-0">
              <p className="truncate text-sm font-black">{user.name}</p>
              <p className="truncate text-xs text-muted-foreground">
                {user.email}
              </p>
            </div>
          </div>

          <div className="mt-2 flex flex-col">
            {accountLinks.map((link) => (
              <MenuLink
                key={link.href}
                href={link.href}
                label={link.label}
                icon={link.icon}
                onClick={() => setOpen(false)}
              />
            ))}
          </div>

          <div className="mt-2 border-t border-border pt-2">
            <button
              type="button"
              onClick={signOut}
              disabled={pending}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-bold text-destructive transition hover:bg-destructive/10 disabled:opacity-50"
            >
              <LogOut size={16} />
              {pending ? "Logging out…" : "Log out"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function MobileAccount({ onNavigate }: { onNavigate: () => void }) {
  const { data, isPending } = authClient.useSession();
  const { signOut, pending } = useSignOut(onNavigate);
  const pathname = usePathname();

  if (isPending) {
    return <div className="h-10 animate-pulse rounded-lg bg-muted" />;
  }

  if (!data?.user) {
    return (
      <div className="mt-2 flex gap-2 border-t border-border pt-3">
        <Link
          href="/login"
          onClick={onNavigate}
          className="flex-1 rounded-lg border border-border px-3 py-2 text-center text-sm font-bold"
        >
          Log in
        </Link>
        <Link
          href="/register"
          onClick={onNavigate}
          className="flex-1 rounded-lg bg-primary px-3 py-2 text-center text-sm font-bold text-primary-foreground"
        >
          Sign up
        </Link>
      </div>
    );
  }

  const user = data.user;

  return (
    <div className="mt-2 border-t border-border pt-3">
      <div className="mb-2 flex items-center gap-3 px-1">
        <Avatar name={user.name} image={user.image} />
        <div className="min-w-0">
          <p className="truncate text-sm font-black">{user.name}</p>
          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        {accountLinks.map((link) => {
          const active = isActive(pathname, link.href);
          const Icon = link.icon;

          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-bold",
                active ? "bg-secondary text-primary" : "hover:bg-secondary",
              )}
            >
              <Icon size={16} />
              {link.label}
            </Link>
          );
        })}
        <button
          type="button"
          onClick={signOut}
          disabled={pending}
          className="mt-1 flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-bold text-destructive transition hover:bg-destructive/10 disabled:opacity-50"
        >
          <LogOut size={16} />
          {pending ? "Logging out…" : "Log out"}
        </button>
      </div>
    </div>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  // Store the path the menu was opened on so a route change closes it without
  // an effect that resets state.
  const [menuPath, setMenuPath] = useState<string | null>(null);
  const menuOpen = menuPath !== null && menuPath === pathname;

  const closeMenu = () => setMenuPath(null);

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
          <Suspense
            fallback={<span className="size-9 animate-pulse rounded-full bg-muted" />}
          >
            <UserMenu />
          </Suspense>
          <ThemeButton />
          <button
            type="button"
            onClick={() => setMenuPath(menuOpen ? null : pathname)}
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
            <Suspense
              fallback={<div className="h-10 animate-pulse rounded-lg bg-muted" />}
            >
              <MobileAccount onNavigate={closeMenu} />
            </Suspense>
          </div>
        </nav>
      )}
    </header>
  );
}

export { Avatar };
