"use client";

import { useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { EventCard } from "@/components/event-card";
import { eventCategories, events } from "@/lib/events";

const PAGE_SIZE = 6;
const ALL_CATEGORIES = "All categories";

export function EventsExplorer() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(ALL_CATEGORIES);
  const [page, setPage] = useState(1);

  const filtered = events.filter((event) => {
    const matchesQuery = `${event.title} ${event.location}`
      .toLowerCase()
      .includes(query.toLowerCase());
    const matchesCategory =
      category === ALL_CATEGORIES || event.category === category;
    return matchesQuery && matchesCategory;
  });

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const visible = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  function resetToFirstPage() {
    setPage(1);
  }

  return (
    <>
      <section
        aria-label="Event filters"
        className="soft-card mb-9 flex flex-col gap-3 rounded-xl bg-card p-3 md:flex-row"
      >
        <div className="flex min-h-12 flex-1 items-center gap-3 rounded-lg bg-secondary px-4">
          <Search size={18} className="text-muted-foreground" />
          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              resetToFirstPage();
            }}
            placeholder="Search events or places..."
            className="w-full bg-transparent text-sm font-semibold outline-none placeholder:text-muted-foreground"
          />
        </div>

        <label className="relative flex min-h-12 min-w-48 items-center">
          <span className="sr-only">Filter by category</span>
          <select
            value={category}
            onChange={(event) => {
              setCategory(event.target.value);
              resetToFirstPage();
            }}
            className="w-full appearance-none rounded-lg border border-border bg-card px-4 pr-10 text-sm font-bold outline-none focus:ring-2 focus:ring-ring"
          >
            <option>{ALL_CATEGORIES}</option>
            {eventCategories.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
          <ChevronDown
            size={16}
            className="pointer-events-none absolute right-3"
          />
        </label>
      </section>

      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-black tracking-[-0.03em]">
          Upcoming events
        </h2>
        <span className="text-sm font-bold text-muted-foreground">
          {filtered.length} matching
        </span>
      </div>

      {visible.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((event) => (
            <EventCard key={event.slug} event={event} showAttendees />
          ))}
        </div>
      ) : (
        <div className="soft-card rounded-xl bg-card p-12 text-center">
          <p className="text-lg font-black">No events match those filters.</p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setCategory(ALL_CATEGORIES);
              resetToFirstPage();
            }}
            className="mt-3 font-bold text-primary underline underline-offset-4"
          >
            Clear filters
          </button>
        </div>
      )}

      {pageCount > 1 && (
        <div
          aria-label="Pagination"
          className="mt-10 flex items-center justify-center gap-2"
        >
          <button
            type="button"
            onClick={() => setPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="rounded-lg border border-border px-4 py-2 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>
          <span className="rounded-lg bg-primary px-4 py-2 text-sm font-black text-primary-foreground">
            {currentPage}
          </span>
          <button
            type="button"
            onClick={() => setPage(Math.min(pageCount, currentPage + 1))}
            disabled={currentPage === pageCount}
            className="rounded-lg border border-border px-4 py-2 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </>
  );
}
