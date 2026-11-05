import { Suspense } from "react";
import type { Metadata } from "next";
import { EventDetail } from "@/components/event-detail";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Event details",
};

function EventDetailFallback() {
  return (
    <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-12">
      <div className="h-4 w-32 animate-pulse rounded bg-muted" />
      <div className="mt-7 h-64 animate-pulse rounded-2xl bg-muted sm:h-[420px]" />
      <div className="mt-8 h-10 w-2/3 animate-pulse rounded-lg bg-muted" />
      <div className="mt-4 h-24 animate-pulse rounded-lg bg-muted" />
    </main>
  );
}

export default function EventDetailPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <Suspense fallback={<EventDetailFallback />}>
        <EventDetail />
      </Suspense>
      <SiteFooter />
    </div>
  );
}
