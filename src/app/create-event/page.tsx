import type { Metadata } from "next";
import { CreateEventForm } from "@/components/create-event-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Create an event",
};

export default function CreateEventPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
        <p className="eyebrow">Get involved</p>
        <h1 className="section-title max-w-2xl">
          Create an <em>event.</em>
        </h1>
        <p className="mt-4 max-w-xl text-base text-muted-foreground">
          Give your neighbors something good to show up for. You can edit the
          details any time before publishing.
        </p>

        <div className="mt-10">
          <CreateEventForm />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
