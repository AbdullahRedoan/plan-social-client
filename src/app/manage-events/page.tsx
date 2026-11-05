import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, MapPin, Pencil, Users } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { categoryStyles, events } from "@/lib/events";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Manage events",
};

export default function ManageEventsPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="eyebrow">Organizer dashboard</p>
            <h1 className="section-title max-w-2xl">
              Your <em>events.</em>
            </h1>
            <p className="mt-4 max-w-xl text-base text-muted-foreground">
              Everything you have published, in one place. Editing and deletion
              will be wired up with the API.
            </p>
          </div>
          <Link
            href="/create-event"
            className="w-fit rounded-lg bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-[3px_3px_0_var(--foreground)] transition hover:opacity-90"
          >
            Create event
          </Link>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <article
              key={event.slug}
              className="soft-card flex flex-col rounded-xl bg-card p-6"
            >
              <div className="flex items-start justify-between gap-3">
                <span
                  className={cn(
                    "rounded-md px-2.5 py-1 text-[11px] font-black uppercase tracking-wider",
                    categoryStyles[event.category],
                  )}
                >
                  {event.category}
                </span>
                <span className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-bold text-muted-foreground">
                  Published
                </span>
              </div>

              <h2 className="mt-4 text-lg font-bold leading-snug">
                {event.title}
              </h2>

              <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarDays size={15} className="text-primary" />
                {event.date} · {event.time}
              </p>
              <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin size={15} className="text-primary" />
                {event.location}
              </p>
              <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                <Users size={15} className="text-primary" />
                {event.attendees} joining
              </p>

              <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                <Link
                  href={`/events/${event.slug}`}
                  className="text-sm font-bold text-primary"
                >
                  View event
                </Link>
                <button
                  type="button"
                  className="flex items-center gap-1.5 text-sm font-bold text-muted-foreground transition hover:text-foreground"
                >
                  <Pencil size={14} /> Edit
                </button>
              </div>
            </article>
          ))}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
