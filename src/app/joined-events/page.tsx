import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, CheckCircle2, MapPin } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { events } from "@/lib/events";

export const metadata: Metadata = {
  title: "Joined events",
};

export default function JoinedEventsPage() {
  const joined = events.slice(0, 2);

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
        <p className="eyebrow">Your calendar</p>
        <h1 className="section-title max-w-2xl">
          You&apos;re <em>in.</em>
        </h1>
        <p className="mt-4 max-w-xl text-base text-muted-foreground">
          These are the events you have signed up for. We will send the details
          and any last-minute updates by email.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {joined.map((event) => (
            <article
              key={event.slug}
              className="soft-card flex items-start gap-4 rounded-xl bg-card p-6"
            >
              <CheckCircle2 className="mt-1 shrink-0 text-primary" size={22} />
              <div>
                <h2 className="text-lg font-bold">{event.title}</h2>
                <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarDays size={15} />
                  {event.date} · {event.time}
                </p>
                <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin size={15} />
                  {event.location}
                </p>
                <Link
                  href={`/events/${event.slug}`}
                  className="mt-4 inline-flex text-sm font-bold text-primary"
                >
                  View event details
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10">
          <Link
            href="/events"
            className="text-sm font-bold text-primary underline underline-offset-4"
          >
            Find another event to join
          </Link>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
