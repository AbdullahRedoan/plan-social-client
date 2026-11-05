/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { ArrowRight, CalendarDays, MapPin, Users } from "lucide-react";
import { categoryStyles, type CommunityEvent } from "@/lib/events";
import { cn } from "@/lib/utils";

type EventCardProps = {
  event: CommunityEvent;
  showAttendees?: boolean;
};

export function EventCard({ event, showAttendees = false }: EventCardProps) {
  return (
    <article className="soft-card group flex h-full flex-col overflow-hidden rounded-xl bg-card transition hover:-translate-y-1 hover:shadow-[6px_6px_0_var(--foreground)]">
      <Link
        href={`/events/${event.slug}`}
        className="relative block h-44 overflow-hidden"
      >
        {/* Remote Unsplash placeholders; swap for next/image when data is real. */}
        <img
          src={event.image}
          alt={event.title}
          className="size-full object-cover transition duration-500 group-hover:scale-105"
        />
        <span
          className={cn(
            "absolute left-3 top-3 rounded-md px-2.5 py-1 text-[11px] font-black uppercase tracking-wider",
            categoryStyles[event.category],
          )}
        >
          {event.category}
        </span>
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <p className="flex items-center gap-2 text-xs font-semibold text-primary">
          <CalendarDays size={14} />
          {event.date} · {event.time}
        </p>
        <h3 className="text-lg font-bold leading-snug">{event.title}</h3>
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin size={15} />
          {event.location}
        </p>

        <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
          {showAttendees ? (
            <span className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
              <Users size={15} />
              {event.attendees} joining
            </span>
          ) : (
            <span className="text-xs font-bold text-muted-foreground">
              {event.organizer}
            </span>
          )}
          <Link
            href={`/events/${event.slug}`}
            className="flex items-center gap-1 text-sm font-bold text-primary transition hover:gap-2"
          >
            View event <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </article>
  );
}
