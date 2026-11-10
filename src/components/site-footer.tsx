import Link from "next/link";
import { Camera, Mail } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";

const CONTACT_EMAIL = "abdullahredoanarb@gmail.com";
const GMAIL_COMPOSE_URL = `https://mail.google.com/mail/?view=cm&fs=1&to=${CONTACT_EMAIL}`;

const columns = [
  {
    heading: "Explore",
    links: [
      { href: "/events", label: "Upcoming events" },
      { href: "/#impact", label: "Our impact" },
      { href: "/#gallery", label: "Community stories" },
    ],
  },
  {
    heading: "Get involved",
    links: [
      { href: "/create-event", label: "Host an event" },
      { href: "/joined-events", label: "Your calendar" },
      { href: "/manage-events", label: "Organizer dashboard" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-10 bg-[#283936] px-5 py-12 text-[#eaf1e7] lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <Link
            href="/"
            className="flex items-center gap-2.5 text-lg font-black tracking-tight"
          >
            <BrandMark />
            PlanSocial
          </Link>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-[#bfd0c8]">
            A community-powered platform for making local change feel possible —
            and personal.
          </p>
          <p className="mt-8 text-xs text-[#91aaa0]">
            © 2026 PlanSocial. Made for better places.
          </p>
        </div>

        {columns.map((column) => (
          <div key={column.heading}>
            <p className="footer-heading">{column.heading}</p>
            <div className="flex flex-col gap-3 text-sm text-[#bfd0c8]">
              {column.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="transition hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ))}

        <div>
          <p className="footer-heading">Say hello</p>
          <p className="break-words text-sm text-[#bfd0c8]">{CONTACT_EMAIL}</p>
          <div className="mt-4 flex gap-2">
            <a
              href="#"
              aria-label="PlanSocial on Instagram"
              className="grid size-9 place-items-center rounded-lg border border-[#526962] transition hover:bg-[#40574f]"
            >
              <Camera size={16} />
            </a>
            <a
              href={GMAIL_COMPOSE_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Compose an email to ${CONTACT_EMAIL}`}
              className="grid size-9 place-items-center rounded-lg border border-[#526962] transition hover:bg-[#40574f]"
            >
              <Mail size={16} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
