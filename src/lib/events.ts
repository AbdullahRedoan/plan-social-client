export type EventCategory = "Donation" | "Plantation" | "Cleanup" | "Food Drive";

export type EventParticipant = {
  userId: string;
  name: string;
  email: string;
  image: string | null;
  joinedAt: string;
};

export type CommunityEvent = {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  image: string;
  location: string;
  date: string;
  creatorId: string;
  creatorName: string;
  creatorEmail: string;
  creatorImage: string | null;
  participants: EventParticipant[];
  createdAt: string;
};

export const eventCategories: EventCategory[] = [
  "Donation",
  "Plantation",
  "Cleanup",
  "Food Drive",
];

export const categoryStyles: Record<EventCategory, string> = {
  Donation: "bg-[#e9d6ca] text-[#8e402b] dark:bg-[#4a2f27] dark:text-[#f0c3b0]",
  Plantation:
    "bg-[#d9e4d2] text-[#3f5b35] dark:bg-[#2f3f2b] dark:text-[#c7dfbd]",
  Cleanup: "bg-[#d7e4e4] text-[#2f5b5b] dark:bg-[#263c3c] dark:text-[#bfe0e0]",
  "Food Drive":
    "bg-[#eee0bd] text-[#6b5322] dark:bg-[#443a1f] dark:text-[#efdca6]",
};

export const galleryImages = [
  "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1594708767771-a7502209ff51?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1599059813005-11265ba4b4ce?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&w=900&q=80",
];

/**
 * Dates are stored as wall-clock strings (`YYYY-MM-DDTHH:mm`), so we read the
 * parts directly instead of converting through a timezone.
 */
export function splitEventDate(value: string) {
  const [datePart = "", timePart = ""] = value.split("T");

  return {
    date: datePart,
    time: timePart.slice(0, 5),
  };
}

export function formatEventDate(value: string) {
  const { date } = splitEventDate(value);
  const [year, month, day] = date.split("-").map(Number);

  if (!year || !month || !day) {
    return "Date to be announced";
  }

  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(year, month - 1, day));
}

export function formatEventTime(value: string) {
  const { time } = splitEventDate(value);
  const [hours, minutes] = time.split(":").map(Number);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return "";
  }

  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 === 0 ? 12 : hours % 12;

  return `${displayHours}:${String(minutes).padStart(2, "0")} ${period}`;
}

export function formatEventDateTime(value: string) {
  return `${formatEventDate(value)} · ${formatEventTime(value)}`;
}

export function isJoined(event: CommunityEvent, userId?: string | null) {
  if (!userId) {
    return false;
  }

  return event.participants.some((participant) => participant.userId === userId);
}
