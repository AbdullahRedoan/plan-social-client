"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  Loader2,
  MapPin,
  Pencil,
  Plus,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { EventFields } from "@/components/event-fields";
import { Button } from "@/components/ui/button";
import { ApiError, eventsApi, type EventInput } from "@/lib/api";
import { getTokenFromClient } from "@/lib/auth-client";
import {
  splitWallClock,
  toEventInput,
  validateEventForm,
  type EventFormErrors,
  type EventFormValues,
} from "@/lib/event-form";
import {
  categoryStyles,
  formatEventDate,
  formatEventTime,
  type CommunityEvent,
} from "@/lib/events";
import { cn } from "@/lib/utils";

function toFormValues(event: CommunityEvent): EventFormValues {
  const { date, time } = splitWallClock(event.date);

  return {
    title: event.title,
    description: event.description,
    category: event.category,
    image: event.image,
    location: event.location,
    date,
    time,
  };
}

function toStoredInput(event: CommunityEvent): EventInput {
  return {
    title: event.title,
    description: event.description,
    category: event.category,
    image: event.image,
    location: event.location,
    date: event.date,
  };
}

function diffInput(
  original: EventInput,
  next: EventInput,
): Partial<EventInput> {
  const changes: Record<string, string> = {};

  (Object.keys(next) as (keyof EventInput)[]).forEach((key) => {
    if (next[key] !== original[key]) {
      changes[key] = next[key];
    }
  });

  return changes as Partial<EventInput>;
}

function Modal({
  title,
  description,
  onClose,
  children,
}: {
  title: string;
  description?: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      role="presentation"
      onClick={onClose}
      className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-foreground/50 p-4 backdrop-blur-sm"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
        className="my-8 w-full max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-2xl sm:p-8"
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-black tracking-tight">{title}</h2>
            {description ? (
              <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="grid size-9 shrink-0 place-items-center rounded-lg border border-border text-muted-foreground transition hover:text-foreground"
          >
            <X size={16} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

type DeleteTarget = { id: string; title: string } | null;

export function ManageEventsList({
  initialEvents,
}: {
  initialEvents: CommunityEvent[];
}) {
  const [events, setEvents] = useState(initialEvents);
  const [editing, setEditing] = useState<CommunityEvent | null>(null);
  const [values, setValues] = useState<EventFormValues | null>(null);
  const [errors, setErrors] = useState<EventFormErrors>({});
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget>(null);
  const [deleting, setDeleting] = useState(false);

  function openEdit(event: CommunityEvent) {
    setEditing(event);
    setValues(toFormValues(event));
    setErrors({});
  }

  function closeEdit() {
    if (saving) {
      return;
    }

    setEditing(null);
    setValues(null);
    setErrors({});
  }

  function handleChange(field: keyof EventFormValues, value: string) {
    setValues((current) => (current ? { ...current, [field]: value } : current));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!editing || !values) {
      return;
    }

    const original = toStoredInput(editing);
    const next = toEventInput(values);
    const changes = diffInput(original, next);

    if (Object.keys(changes).length === 0) {
      toast.info("No changes to save.");
      closeEdit();
      return;
    }

    const nextErrors = validateEventForm(values);

    // Only reject a past date when the organizer actually changed it; legacy
    // events that already happened should still allow title or copy edits.
    if (!("date" in changes)) {
      delete nextErrors.date;
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      toast.error("Please fix the highlighted fields.");
      return;
    }

    setSaving(true);

    try {
      const token = await getTokenFromClient();
      const updated = await eventsApi.update(token, editing.id, changes);
      setEvents((current) =>
        current.map((item) => (item.id === updated.id ? updated : item)),
      );
      toast.success("Event updated.");
      setEditing(null);
      setValues(null);
      setErrors({});
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.fieldErrors) {
          setErrors(error.fieldErrors as EventFormErrors);
        }
        toast.error(error.message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Could not update this event. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) {
      return;
    }

    setDeleting(true);

    try {
      const token = await getTokenFromClient();
      await eventsApi.remove(token, deleteTarget.id);
      setEvents((current) =>
        current.filter((item) => item.id !== deleteTarget.id),
      );
      toast.success(`“${deleteTarget.title}” was deleted.`);
      setDeleteTarget(null);
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Could not delete this event. Please try again.");
      }
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      {events.length === 0 ? (
        <div className="soft-card mt-10 rounded-xl bg-card p-12 text-center">
          <p className="text-lg font-black">You have not created an event yet.</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Host the first one and give your neighbors something good to show up
            for.
          </p>
          <Button
            render={<Link href="/create-event" />}
            className="mt-6 h-11 px-5 font-bold"
          >
            <Plus size={16} /> Create an event
          </Button>
        </div>
      ) : (
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <article
              key={event.id}
              className="soft-card flex flex-col rounded-xl bg-card p-6"
            >
              <div className="flex items-start justify-between gap-3">
                <span
                  className={cn(
                    "rounded-md px-2.5 py-1 text-[11px] font-black uppercase tracking-wider",
                    categoryStyles[event.category],
                  )}
                >
                  {event.category}
                </span>
                <span className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-bold text-muted-foreground">
                  Published
                </span>
              </div>

              <h2 className="mt-4 line-clamp-2 text-lg font-bold leading-snug">
                {event.title}
              </h2>

              <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarDays size={15} className="shrink-0 text-primary" />
                {formatEventDate(event.date)} · {formatEventTime(event.date)}
              </p>
              <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin size={15} className="shrink-0 text-primary" />
                <span className="line-clamp-1">{event.location}</span>
              </p>
              <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                <Users size={15} className="shrink-0 text-primary" />
                {event.participants.length} joining
              </p>

              <div className="mt-auto flex items-center justify-between gap-2 border-t border-border pt-4">
                <Link
                  href={`/events/${event.id}`}
                  className="text-sm font-bold text-primary hover:underline"
                >
                  View
                </Link>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => openEdit(event)}
                    className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-bold text-muted-foreground transition hover:bg-secondary hover:text-foreground"
                  >
                    <Pencil size={14} /> Edit
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setDeleteTarget({ id: event.id, title: event.title })
                    }
                    className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-bold text-destructive transition hover:bg-destructive/10"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {editing && values ? (
        <Modal
          title="Edit event"
          description="Update the details, then save your changes."
          onClose={closeEdit}
        >
          <form className="grid gap-5" onSubmit={handleSave} noValidate>
            <EventFields
              values={values}
              errors={errors}
              onChange={handleChange}
              idPrefix="edit-event"
              disabled={saving}
            />

            <div className="flex flex-wrap justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={closeEdit}
                disabled={saving}
                className="h-11 px-5 font-bold"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="h-11 px-5 font-bold"
              >
                {saving ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Saving…
                  </>
                ) : (
                  "Save changes"
                )}
              </Button>
            </div>
          </form>
        </Modal>
      ) : null}

      {deleteTarget ? (
        <Modal
          title="Delete this event?"
          description="This cannot be undone. Participants will lose access to the event."
          onClose={() => (deleting ? null : setDeleteTarget(null))}
        >
          <p className="rounded-lg bg-secondary p-4 text-sm font-bold">
            {deleteTarget.title}
          </p>
          <div className="mt-6 flex flex-wrap justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteTarget(null)}
              disabled={deleting}
              className="h-11 px-5 font-bold"
            >
              Keep event
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
              className="h-11 px-5 font-bold"
            >
              {deleting ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Deleting…
                </>
              ) : (
                <>
                  <Trash2 size={16} /> Delete event
                </>
              )}
            </Button>
          </div>
        </Modal>
      ) : null}
    </>
  );
}
