"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Check, Loader2, LogIn, Users } from "lucide-react";
import { toast } from "sonner";
import { ApiError, eventsApi } from "@/lib/api";
import { getTokenFromClient } from "@/lib/auth-client";

type JoinEventButtonProps = {
  eventId: string;
  isSignedIn: boolean;
  isJoined: boolean;
  isOwner: boolean;
  participantCount: number;
};

export function JoinEventButton({
  eventId,
  isSignedIn,
  isJoined,
  isOwner,
  participantCount,
}: JoinEventButtonProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [pending, setPending] = useState(false);
  const [joined, setJoined] = useState(isJoined);
  const [count, setCount] = useState(participantCount);

  if (!isSignedIn) {
    return (
      <Link
        href={`/login?next=${encodeURIComponent(pathname)}`}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition hover:opacity-90"
      >
        <LogIn size={16} /> Log in to join
      </Link>
    );
  }

  if (isOwner) {
    return (
      <p className="mt-5 rounded-lg bg-secondary px-4 py-3 text-center text-sm font-bold text-muted-foreground">
        You organize this event.
      </p>
    );
  }

  async function handleJoin() {
    setPending(true);

    try {
      const token = await getTokenFromClient();
      const updated = await eventsApi.join(token, eventId);
      setJoined(true);
      setCount(updated.participants.length);
      toast.success("You're in. See you there!");
      router.refresh();
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 409) {
          setJoined(true);
          toast.success("You have already joined this event.");
        } else {
          toast.error(error.message);
        }
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Could not join this event. Please try again.");
      }
    } finally {
      setPending(false);
    }
  }

  if (joined) {
    return (
      <>
        <button
          type="button"
          disabled
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-primary/80 px-5 py-3 text-sm font-bold text-primary-foreground"
        >
          <Check size={16} /> You&apos;re in
        </button>
        <p className="mt-3 flex items-center justify-center gap-1.5 text-xs font-bold text-muted-foreground">
          <Users size={14} /> {count} people joining
        </p>
      </>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={handleJoin}
        disabled={pending}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
      >
        {pending ? (
          <>
            <Loader2 size={16} className="animate-spin" /> Joining…
          </>
        ) : (
          "Join event"
        )}
      </button>
      <p className="mt-3 flex items-center justify-center gap-1.5 text-xs font-bold text-muted-foreground">
        <Users size={14} /> {count} people joining
      </p>
    </>
  );
}
