/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  MapPin,
  Users,
} from "lucide-react";
import { JoinEventButton } from "@/components/join-event-button";
import { ShareEventButton } from "@/components/share-event-button";
import {
  categoryStyles,
  formatEventDate,
  formatEventTime,
  type CommunityEvent,
} from "@/lib/events";
import { cn } from "@/lib/utils";

type EventDetailProps = {
  event: CommunityEvent;
  isSignedIn: boolean;
  isJoined: boolean;
  isOwner: boolean;
};

export function EventDetail({
  event,
  isSignedIn,
  isJoined,
  isOwner,
}: EventDetailProps) {
  return (
    <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-12">
      <Link
        href="/events"
        className="mb-7 inline-flex items-center gap-2 text-sm font-black text-muted-foreground transition hover:text-primary"
      >
        <ArrowLeft size={16} /> Back to events
      </Link>

      <section className="soft-card overflow-hidden rounded-2xl bg-card">
        <div className="relative h-64 overflow-hidden bg-secondary sm:h-[420px]">
          <img
            src={event.image}
            alt={event.title}
            className="size-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
          <span
            className={cn(
              "absolute bottom-5 left-5 rounded-md px-3 py-1.5 text-xs font-black uppercase tracking-[.14em]",
              categoryStyles[event.category],
            )}
          >
            {event.category}
          </span>
          <ShareEventButton title={event.title} />
        </div>

        <div className="grid gap-10 p-6 sm:p-10 lg:grid-cols-[1fr_300px]">
          <div>
            <p className="eyebrow">Community event</p>
            <h1 className="section-title mt-3 max-w-3xl">{event.title}</h1>
            <p className="mt-5 max-w-2xl whitespace-pre-line text-base leading-8 text-muted-foreground">
              {event.description}
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-border bg-secondary p-4">
                <CalendarDays className="mb-3 text-primary" size={20} />
                <p className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                  Date
                </p>
                <p className="mt-1 text-sm font-black">
                  {formatEventDate(event.date)}
                </p>
              </div>
              <div className="rounded-xl border border-border bg-secondary p-4">
                <Clock3 className="mb-3 text-primary" size={20} />
                <p className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                  Time
                </p>
                <p className="mt-1 text-sm font-black">
                  {formatEventTime(event.date)}
                </p>
              </div>
              <div className="rounded-xl border border-border bg-secondary p-4">
                <MapPin className="mb-3 text-primary" size={20} />
                <p className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                  Location
                </p>
                <p className="mt-1 text-sm font-black">{event.location}</p>
              </div>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-xl border border-border bg-card p-5">
              <p className="flex items-center gap-2 text-sm font-black">
                <Users size={16} className="text-primary" />
                {event.participants.length} people joining
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Organized by {event.creatorName}
              </p>
              <JoinEventButton
                eventId={event.id}
                isSignedIn={isSignedIn}
                isJoined={isJoined}
                isOwner={isOwner}
                participantCount={event.participants.length}
              />
            </div>

            <div className="soft-card rounded-xl bg-card p-5 text-sm text-muted-foreground">
              Bring a friend, wear comfortable clothes, and arrive ten minutes
              early. Everything else is provided.
            </div>

            <div className="rounded-xl border border-border bg-secondary p-5 text-sm">
              <p className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                Contact organizer
              </p>
              <a
                href={`mailto:${event.creatorEmail}`}
                className="mt-1 block break-all font-bold text-primary hover:underline"
              >
                {event.creatorEmail}
              </a>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
