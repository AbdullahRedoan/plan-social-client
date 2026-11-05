/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  Clock3,
  MapPin,
  Share2,
  Users,
} from "lucide-react";
import { getEvent } from "@/lib/events";

export function EventDetail() {
  const { id } = useParams<{ id: string }>();
  const event = getEvent(id);
  const [joined, setJoined] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!event) {
    return (
      <main className="mx-auto max-w-3xl px-5 py-20 text-center">
        <p className="eyebrow">Not found</p>
        <h1 className="section-title">We couldn&apos;t find that event.</h1>
        <Link
          href="/events"
          className="mt-8 inline-flex items-center gap-2 font-bold text-primary"
        >
          <ArrowLeft size={16} /> Back to events
        </Link>
      </main>
    );
  }

  async function shareEvent() {
    try {
      if (navigator.share) {
        await navigator.share({
          title: event!.title,
          url: window.location.href,
        });
        return;
      }
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // The share sheet was dismissed; nothing to do.
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-12">
      <Link
        href="/events"
        className="mb-7 inline-flex items-center gap-2 text-sm font-black text-muted-foreground transition hover:text-primary"
      >
        <ArrowLeft size={16} /> Back to events
      </Link>

      <section className="soft-card overflow-hidden rounded-2xl bg-card">
        <div className="relative h-64 overflow-hidden bg-[#e9d6ca] sm:h-[420px]">
          <img
            src={event.image}
            alt={event.title}
            className="size-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
          <span className="absolute bottom-5 left-5 rounded-md bg-card px-3 py-1.5 text-xs font-black uppercase tracking-[.14em]">
            {event.category}
          </span>
          <button
            type="button"
            onClick={shareEvent}
            aria-label="Share event"
            className="absolute right-5 top-5 grid size-11 place-items-center rounded-lg bg-card text-foreground shadow-lg transition hover:-translate-y-0.5"
          >
            {copied ? <Check size={17} /> : <Share2 size={17} />}
          </button>
        </div>

        <div className="grid gap-10 p-6 sm:p-10 lg:grid-cols-[1fr_300px]">
          <div>
            <p className="eyebrow">Community event</p>
            <h1 className="section-title mt-3 max-w-3xl">{event.title}</h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground">
              {event.description}
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-border bg-secondary p-4">
                <CalendarDays className="mb-3 text-primary" size={20} />
                <p className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                  Date
                </p>
                <p className="mt-1 text-sm font-black">{event.date}</p>
              </div>
              <div className="rounded-xl border border-border bg-secondary p-4">
                <Clock3 className="mb-3 text-primary" size={20} />
                <p className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                  Time
                </p>
                <p className="mt-1 text-sm font-black">{event.time}</p>
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
                {event.attendees} people joining
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Organized by {event.organizer}
              </p>
              <button
                type="button"
                onClick={() => setJoined(true)}
                disabled={joined}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition hover:opacity-90 disabled:cursor-default disabled:opacity-80"
              >
                {joined ? (
                  <>
                    <Check size={16} /> You&apos;re in
                  </>
                ) : (
                  "Join event"
                )}
              </button>
            </div>

            <div className="soft-card rounded-xl bg-card p-5 text-sm text-muted-foreground">
              Bring a friend, wear comfortable clothes, and arrive ten minutes
              early. Everything else is provided.
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
