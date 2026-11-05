"use client";

import { useState } from "react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  if (subscribed) {
    return (
      <p className="max-w-md text-sm font-bold text-[#6e3827]">
        You&apos;re on the list. Good news is on its way.
      </p>
    );
  }

  return (
    <form
      className="flex w-full max-w-md gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        setSubscribed(true);
      }}
    >
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <input
        id="newsletter-email"
        type="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Your email address"
        className="min-w-0 flex-1 rounded-lg border border-[#cda997] bg-[#f5e9e3] px-4 py-3 text-sm outline-none"
      />
      <button
        type="submit"
        className="rounded-lg bg-primary px-5 py-3 text-sm font-bold text-primary-foreground"
      >
        Subscribe
      </button>
    </form>
  );
}
