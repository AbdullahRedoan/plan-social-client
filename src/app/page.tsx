/* eslint-disable @next/next/no-img-element */
import { Suspense } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Compass,
  Globe2,
  Leaf,
  ShieldCheck,
  Sparkles,
  TreePine,
  Users,
} from "lucide-react";
import { HomeEventsSkeleton } from "@/components/event-skeletons";
import { HomeEvents } from "@/components/home-events";
import { NewsletterForm } from "@/components/newsletter-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { eventsApi } from "@/lib/api";
import { galleryImages, type CommunityEvent } from "@/lib/events";

const reasons = [
  {
    icon: Compass,
    title: "Find your cause",
    body: "Browse local drives by date, location, and the work that makes you feel alive.",
    tone: "light",
  },
  {
    icon: Leaf,
    title: "Make an impact",
    body: "Every hour counts. Track your contribution and see what your community achieves together.",
    tone: "dark",
  },
  {
    icon: ShieldCheck,
    title: "Show up safely",
    body: "Clear event details, trusted organizers, and a community that has your back.",
    tone: "light",
  },
] as const;

async function RecentEvents() {
  let events: CommunityEvent[] = [];

  try {
    events = await eventsApi.list(6);
  } catch {
    events = [];
  }

  return <HomeEvents events={events} />;
}

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main>
        <section className="mx-auto grid max-w-7xl gap-4 px-5 pb-16 pt-10 lg:grid-cols-[1.3fr_.7fr] lg:px-8 lg:pt-16">
          <div className="soft-card relative overflow-hidden rounded-2xl bg-[#e9d6ca] p-7 text-[#292321] sm:p-10 lg:min-h-[420px] lg:p-14">
            <div className="relative z-10 max-w-xl">
              <span className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#cda997] bg-[#f5e9e3]/70 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#8e402b]">
                <Sparkles size={14} /> Build a better neighborhood
              </span>
              <h1 className="max-w-2xl text-5xl font-black leading-[.98] tracking-[-.05em] sm:text-7xl">
                Do good.
                <br />
                <span className="text-primary">Together.</span>
              </h1>
              <p className="mt-6 max-w-md text-base leading-relaxed text-[#5f514b]">
                Discover meaningful ways to show up for your community.
                PlanSocial makes local action simple, social, and impactful.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/events"
                  className="flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition hover:opacity-90"
                >
                  Explore events <ArrowRight size={16} />
                </Link>
                <Link
                  href="/create-event"
                  className="rounded-lg border border-[#b99482] px-5 py-3 text-sm font-bold text-[#6e3827] transition hover:bg-[#f5e9e3]"
                >
                  Host an event
                </Link>
              </div>
            </div>
            <div className="absolute -bottom-12 -right-12 size-60 rounded-full border-[28px] border-[#d1ad9b]/70" />
            <div className="absolute -right-5 top-12 size-24 rounded-full bg-[#cf674b]/70" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <div className="soft-card rounded-2xl bg-[#283936] p-7 text-[#eaf1e7] lg:p-9">
              <div className="flex items-start justify-between">
                <Globe2 className="text-[#eab19c]" />
                <span className="rounded-full bg-[#435b54] px-2.5 py-1 text-[11px] font-bold">
                  2024 impact
                </span>
              </div>
              <p className="mt-12 text-6xl font-black tracking-tight">
                12.8k<span className="text-3xl text-[#eab19c]">+</span>
              </p>
              <p className="mt-2 text-sm text-[#bfd0c8]">
                hours volunteered by our community
              </p>
              <div className="mt-6 h-px bg-[#435b54]" />
              <p className="mt-4 text-sm text-[#bfd0c8]">
                Small actions, added up, become something worth celebrating.
              </p>
            </div>

            <div className="soft-card rounded-2xl bg-card p-7 lg:p-9">
              <Users className="text-primary" />
              <p className="mt-8 text-5xl font-black tracking-tight">3,200</p>
              <p className="mt-2 text-sm text-muted-foreground">
                neighbors showing up every month
              </p>
            </div>
          </div>
        </section>

        <section id="impact" className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
          <div className="mb-8 flex items-end justify-between gap-6">
            <div>
              <p className="eyebrow">Why PlanSocial</p>
              <h2 className="section-title">
                Small actions,
                <br />
                <em>real change.</em>
              </h2>
            </div>
            <p className="hidden max-w-xs text-sm leading-relaxed text-muted-foreground sm:block">
              A simpler way to find your people, lend your hands, and leave
              every place a little better.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {reasons.map((reason) => {
              const Icon = reason.icon;
              const isDark = reason.tone === "dark";
              return (
                <div
                  key={reason.title}
                  className={
                    isDark
                      ? "soft-card rounded-xl bg-[#283936] p-6 text-[#eaf1e7]"
                      : "soft-card rounded-xl p-6"
                  }
                >
                  <span
                    className={
                      isDark
                        ? "icon-tile bg-[#eab19c] text-[#283936]"
                        : "icon-tile"
                    }
                  >
                    <Icon />
                  </span>
                  <h3 className="mt-8 text-xl font-bold">{reason.title}</h3>
                  <p
                    className={
                      isDark
                        ? "mt-2 text-sm leading-relaxed text-[#bfd0c8]"
                        : "mt-2 text-sm leading-relaxed text-muted-foreground"
                    }
                  >
                    {reason.body}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        <section id="events" className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
          <Suspense fallback={<HomeEventsSkeleton />}>
            <RecentEvents />
          </Suspense>
        </section>

        <section id="gallery" className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="eyebrow">From the field</p>
              <h2 className="section-title">
                Good things are <em>growing.</em>
              </h2>
            </div>
            <span className="hidden items-center gap-2 text-sm text-muted-foreground sm:flex">
              <TreePine size={16} className="text-primary" /> A look at our
              community
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <img
              src={galleryImages[0]}
              alt="Volunteers planting trees"
              className="h-64 w-full rounded-xl object-cover sm:row-span-2 sm:h-full"
            />
            <img
              src={galleryImages[1]}
              alt="Community food distribution"
              className="h-44 w-full rounded-xl object-cover sm:col-span-2"
            />
            <img
              src={galleryImages[2]}
              alt="Children at a community event"
              className="h-44 w-full rounded-xl object-cover"
            />
            <img
              src={galleryImages[3]}
              alt="Volunteers cleaning a neighborhood"
              className="h-44 w-full rounded-xl object-cover"
            />
            <img
              src={galleryImages[4]}
              alt="Volunteers smiling together"
              className="h-44 w-full rounded-xl object-cover sm:col-span-2"
            />
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
          <div className="soft-card flex flex-col items-start justify-between gap-6 rounded-2xl bg-[#e9d6ca] p-7 text-[#292321] sm:flex-row sm:items-center sm:p-10">
            <div>
              <p className="eyebrow text-[#8e402b]">Stay in the loop</p>
              <h2 className="mt-2 text-3xl font-black tracking-tight">
                Good news, delivered.
              </h2>
              <p className="mt-2 text-sm text-[#6e5b52]">
                Monthly stories, new events, zero noise.
              </p>
            </div>
            <NewsletterForm />
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
