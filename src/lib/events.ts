export type EventCategory = "Donation" | "Plantation" | "Cleanup" | "Food Drive";

export type CommunityEvent = {
  slug: string;
  title: string;
  category: EventCategory;
  date: string;
  time: string;
  location: string;
  attendees: number;
  organizer: string;
  image: string;
  description: string;
};

export const eventCategories: EventCategory[] = [
  "Donation",
  "Plantation",
  "Cleanup",
  "Food Drive",
];

export const categoryStyles: Record<EventCategory, string> = {
  Donation: "bg-[#e9d6ca] text-[#8e402b]",
  Plantation: "bg-[#d9e4d2] text-[#3f5b35]",
  Cleanup: "bg-[#d7e4e4] text-[#2f5b5b]",
  "Food Drive": "bg-[#eee0bd] text-[#6b5322]",
};

export const events: CommunityEvent[] = [
  {
    slug: "winter-clothes-distribution",
    title: "Winter clothes distribution",
    category: "Donation",
    date: "Sat, Dec 14",
    time: "10:00 AM",
    location: "Community Center, Mirpur 10",
    attendees: 28,
    organizer: "Ayesha Rahman",
    image:
      "https://images.unsplash.com/photo-1548126032-079a0fb0099d?auto=format&fit=crop&w=1200&q=80",
    description:
      "Help us sort, pack, and distribute warm winter clothes to neighbors who need them. Every pair of hands makes this drive more welcoming, organized, and impactful.",
  },
  {
    slug: "riverside-park-cleanup",
    title: "Riverside park cleanup",
    category: "Cleanup",
    date: "Sun, Dec 15",
    time: "9:00 AM",
    location: "Riverside Park, North Gate",
    attendees: 41,
    organizer: "Tanvir Islam",
    image:
      "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=1200&q=80",
    description:
      "Spend a morning by the water picking up litter, clearing trails, and leaving the park better than we found it. Gloves and bags are provided.",
  },
  {
    slug: "oak-tree-planting-day",
    title: "Oak tree planting day",
    category: "Plantation",
    date: "Sat, Dec 21",
    time: "8:30 AM",
    location: "Greenway Nursery",
    attendees: 19,
    organizer: "Nusrat Jahan",
    image:
      "https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=1200&q=80",
    description:
      "Plant native saplings that will shade this neighborhood for decades. We will teach you everything you need to know about planting and early care.",
  },
  {
    slug: "food-bank-sorting-shift",
    title: "Food bank sorting shift",
    category: "Food Drive",
    date: "Tue, Dec 24",
    time: "2:00 PM",
    location: "Northside Food Bank",
    attendees: 16,
    organizer: "Rafiq Hasan",
    image:
      "https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?auto=format&fit=crop&w=1200&q=80",
    description:
      "Sort donated groceries, check expiry dates, and pack family boxes for the week ahead. A quiet, steady afternoon that makes a real difference.",
  },
  {
    slug: "beach-cleanup-crew",
    title: "Beach cleanup crew",
    category: "Cleanup",
    date: "Sat, Jan 04",
    time: "9:30 AM",
    location: "Harbor Beach, Pier 3",
    attendees: 34,
    organizer: "Maya Chowdhury",
    image:
      "https://images.unsplash.com/photo-1618477462146-050d2767eac4?auto=format&fit=crop&w=1200&q=80",
    description:
      "Join a friendly crew for a morning of shoreline cleanup. We will weigh what we collect so the community can see the impact of a few hours together.",
  },
  {
    slug: "community-orchard-project",
    title: "Community orchard project",
    category: "Plantation",
    date: "Sun, Jan 05",
    time: "10:00 AM",
    location: "East Meadow Orchard",
    attendees: 23,
    organizer: "Imran Siddique",
    image:
      "https://images.unsplash.com/photo-1599685315640-5d7bb9c89f1c?auto=format&fit=crop&w=1200&q=80",
    description:
      "Help expand the neighborhood orchard with fruit trees that everyone can share. Tools, snacks, and planting guidance are provided.",
  },
];

export const galleryImages = [
  "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1594708767771-a7502209ff51?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1599059813005-11265ba4b4ce?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&w=900&q=80",
];

export function getEvent(slug: string) {
  return events.find((event) => event.slug === slug);
}
