export function EventCardSkeleton() {
  return (
    <div className="soft-card flex h-full flex-col overflow-hidden rounded-xl bg-card">
      <div className="h-44 animate-pulse bg-muted" />
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="h-3 w-32 animate-pulse rounded bg-muted" />
        <div className="h-5 w-4/5 animate-pulse rounded bg-muted" />
        <div className="h-4 w-3/5 animate-pulse rounded bg-muted" />
        <div className="mt-4 h-9 animate-pulse rounded border-t border-border bg-muted/60" />
      </div>
    </div>
  );
}

export function EventsGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <EventCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function HomeEventsSkeleton() {
  return (
    <div>
      <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="h-3 w-16 animate-pulse rounded bg-muted" />
          <div className="mt-3 h-10 w-64 animate-pulse rounded bg-muted" />
        </div>
        <div className="h-10 w-full animate-pulse rounded-lg bg-muted sm:w-64" />
      </div>
      <EventsGridSkeleton />
    </div>
  );
}

export function EventDetailSkeleton() {
  return (
    <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-12">
      <div className="h-4 w-32 animate-pulse rounded bg-muted" />
      <div className="mt-7 h-64 animate-pulse rounded-2xl bg-muted sm:h-[420px]" />
      <div className="mt-8 h-10 w-2/3 animate-pulse rounded-lg bg-muted" />
      <div className="mt-4 h-24 animate-pulse rounded-lg bg-muted" />
    </main>
  );
}

export function ListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="soft-card rounded-xl bg-card p-6"
        >
          <div className="h-4 w-24 animate-pulse rounded bg-muted" />
          <div className="mt-4 h-6 w-4/5 animate-pulse rounded bg-muted" />
          <div className="mt-4 h-4 w-3/5 animate-pulse rounded bg-muted" />
          <div className="mt-2 h-4 w-2/5 animate-pulse rounded bg-muted" />
          <div className="mt-6 h-9 animate-pulse rounded border-t border-border bg-muted/60" />
        </div>
      ))}
    </div>
  );
}
