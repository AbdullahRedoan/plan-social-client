import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { ManageEventsList } from "@/components/manage-events-list";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { eventsApi } from "@/lib/api";
import type { CommunityEvent } from "@/lib/events";
import { getTokenFromServer, requireSession } from "@/lib/session";

export const instant = false;

export const metadata: Metadata = {
  title: "Manage events",
};

export default async function ManageEventsPage() {
  await requireSession("/manage-events");
  const token = await getTokenFromServer();

  let events: CommunityEvent[] = [];
  let loadFailed = false;

  if (token) {
    try {
      events = await eventsApi.mine(token);
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
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="eyebrow">Organizer dashboard</p>
            <h1 className="section-title max-w-2xl">
              Your <em>events.</em>
            </h1>
            <p className="mt-4 max-w-xl text-base text-muted-foreground">
              Everything you have published, in one place. Edit the details or
              remove an event whenever plans change.
            </p>
          </div>
          <Link
            href="/create-event"
            className="flex w-fit items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-[3px_3px_0_var(--foreground)] transition hover:opacity-90"
          >
            <Plus size={16} /> Create event
          </Link>
        </div>

        {loadFailed ? (
          <div className="soft-card mt-10 rounded-xl bg-card p-10 text-center">
            <p className="text-lg font-black">We couldn&apos;t load your events.</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Your session may have expired. Log in again to manage your events.
            </p>
            <Link
              href="/login?next=%2Fmanage-events"
              className="mt-5 inline-flex font-bold text-primary underline underline-offset-4"
            >
              Log in again
            </Link>
          </div>
        ) : (
          <ManageEventsList initialEvents={events} />
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
