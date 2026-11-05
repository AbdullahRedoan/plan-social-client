"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { EventCard } from "@/components/event-card";
import { events } from "@/lib/events";

export function HomeEvents() {
  const [query, setQuery] = useState("");

  const filtered = events.filter((event) =>
    `${event.title} ${event.location}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );

  return (
    <>
      <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Next up</p>
          <h2 className="section-title">
            Events near <em>you.</em>
          </h2>
        </div>
        <div className="relative w-full sm:w-64">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={16}
          />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search events"
            className="h-10 w-full rounded-lg border border-border bg-card pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((event) => (
            <EventCard key={event.slug} event={event} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border p-10 text-center text-muted-foreground">
          No events found.
        </div>
      )}

      <div className="mt-8 flex justify-center">
        <Link
          href="/events"
          className="flex items-center gap-2 rounded-lg border border-border px-5 py-3 text-sm font-bold transition hover:border-primary hover:text-primary"
        >
          View all events <ArrowRight size={16} />
        </Link>
      </div>
    </>
  );
}
