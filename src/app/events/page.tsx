import type { Metadata } from "next";
import { EventsExplorer } from "@/components/events-explorer";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { events } from "@/lib/events";

export const metadata: Metadata = {
  title: "Upcoming events",
};

export default function EventsPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="eyebrow">Find your next good thing</p>
            <h1 className="section-title max-w-2xl">
              Make time for <em>meaningful</em> work.
            </h1>
            <p className="mt-4 max-w-xl text-base text-muted-foreground">
              Browse local events, meet people who care, and leave your corner
              of the world a little better.
            </p>
          </div>
          <div className="soft-card w-fit rounded-xl bg-card px-4 py-3 text-sm font-bold">
            <span className="text-primary">{events.length}</span> events open to
            join
          </div>
        </div>

        <EventsExplorer />
      </main>

      <SiteFooter />
    </div>
  );
}
