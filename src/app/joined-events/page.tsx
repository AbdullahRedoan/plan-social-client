import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarCheck2 } from "lucide-react";
import { EventCard } from "@/components/event-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { eventsApi } from "@/lib/api";
import type { CommunityEvent } from "@/lib/events";
import { getTokenFromServer, requireSession } from "@/lib/session";

export const instant = false;

export const metadata: Metadata = {
  title: "Joined events",
};

export default async function JoinedEventsPage() {
  await requireSession("/joined-events");
  const token = await getTokenFromServer();

  let joined: CommunityEvent[] = [];
  let loadFailed = false;

  if (token) {
    try {
      joined = await eventsApi.joined(token);
    } catch {
      loadFailed = true;
    }
  } else {
    loadFailed = true;
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
        <p className="eyebrow">Your calendar</p>
        <h1 className="section-title max-w-2xl">
          You&apos;re <em>in.</em>
        </h1>
        <p className="mt-4 max-w-xl text-base text-muted-foreground">
          These are the events you have signed up for, sorted by the day they
          happen. We will send the details and any last-minute updates by email.
        </p>

        {loadFailed ? (
          <div className="soft-card mt-10 rounded-xl bg-card p-10 text-center">
            <p className="text-lg font-black">
              We couldn&apos;t load your joined events.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Your session may have expired. Log in again to see your calendar.
            </p>
            <Link
              href="/login?next=%2Fjoined-events"
              className="mt-5 inline-flex font-bold text-primary underline underline-offset-4"
            >
              Log in again
            </Link>
          </div>
        ) : joined.length === 0 ? (
          <div className="soft-card mt-10 rounded-xl bg-card p-12 text-center">
            <span className="mx-auto grid size-14 place-items-center rounded-full bg-secondary text-primary">
              <CalendarCheck2 size={24} />
            </span>
            <p className="mt-5 text-lg font-black">
              You have not joined an event yet.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Find a cause you care about and show up for it.
            </p>
            <Link
              href="/events"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition hover:opacity-90"
            >
              Browse upcoming events <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <>
            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {joined.map((event) => (
                <EventCard key={event.id} event={event} showAttendees />
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
          </>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
