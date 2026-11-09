"use client";

import { useState } from "react";
import { Check, Share2 } from "lucide-react";
import { toast } from "sonner";

export function ShareEventButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  async function shareEvent() {
    const url = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }

      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Event link copied to your clipboard.");
      window.setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }

      toast.error("Could not share this event. Copy the URL from your browser.");
    }
  }

  return (
    <button
      type="button"
      onClick={shareEvent}
      aria-label="Share event"
      className="absolute right-5 top-5 grid size-11 place-items-center rounded-lg bg-card text-foreground shadow-lg transition hover:-translate-y-0.5"
    >
      {copied ? <Check size={17} /> : <Share2 size={17} />}
    </button>
  );
}
