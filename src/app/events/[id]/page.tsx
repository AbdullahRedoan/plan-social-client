import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, CalendarX2 } from "lucide-react";
import { EventDetail } from "@/components/event-detail";
import { EventDetailSkeleton } from "@/components/event-skeletons";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ApiError, eventsApi } from "@/lib/api";
import { isJoined as hasJoined, type CommunityEvent } from "@/lib/events";
import { getSession } from "@/lib/session";

export const instant = false;

export const metadata: Metadata = {
  title: "Event details",
};

type LoadResult =
  | { status: "ok"; event: CommunityEvent }
  | { status: "missing" }
  | { status: "error" };

async function loadEvent(id: string): Promise<LoadResult> {
  try {
    return { status: "ok", event: await eventsApi.get(id) };
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return { status: "missing" };
    }

    return { status: "error" };
  }
}

function EventUnavailable({ missing }: { missing: boolean }) {
  return (
    <main className="mx-auto max-w-3xl px-5 py-20 text-center">
      <span className="mx-auto grid size-14 place-items-center rounded-full bg-secondary text-primary">
        <CalendarX2 size={24} />
      </span>
      <p className="eyebrow mt-6">{missing ? "Not found" : "Try again"}</p>
      <h1 className="section-title">
        {missing ? "We couldn't find that event." : "We couldn't load this event."}
      </h1>
      <p className="mx-auto mt-4 max-w-md text-base text-muted-foreground">
        {missing
          ? "It may have been removed by its organizer, or the link is incorrect."
          : "The PlanSocial API did not respond. Refresh the page in a moment."}
      </p>
      <Link
        href="/events"
        className="mt-8 inline-flex items-center gap-2 font-bold text-primary"
      >
        <ArrowLeft size={16} /> Back to events
      </Link>
    </main>
  );
}

async function EventDetailContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [result, session] = await Promise.all([loadEvent(id), getSession()]);

  if (result.status !== "ok") {
    return <EventUnavailable missing={result.status === "missing"} />;
  }

  const event = result.event;
  const user = session?.user;

  return (
    <EventDetail
      event={event}
      isSignedIn={Boolean(user)}
      isJoined={hasJoined(event, user?.id)}
      isOwner={Boolean(user && user.id === event.creatorId)}
    />
  );
}

export default function EventDetailPage(props: PageProps<"/events/[id]">) {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <Suspense fallback={<EventDetailSkeleton />}>
        <EventDetailContent params={props.params} />
      </Suspense>
      <SiteFooter />
    </div>
  );
}
