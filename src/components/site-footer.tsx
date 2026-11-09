import Link from "next/link";
import { Camera, HeartHandshake, Mail } from "lucide-react";

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
            <span className="grid size-9 place-items-center rounded-lg bg-[#eab19c] text-[#283936]">
              <HeartHandshake size={18} />
            </span>
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
          <p className="text-sm text-[#bfd0c8]">hello@plansocial.co</p>
          <div className="mt-4 flex gap-2">
            <a
              href="#"
              aria-label="PlanSocial on Instagram"
              className="grid size-9 place-items-center rounded-lg border border-[#526962] transition hover:bg-[#40574f]"
            >
              <Camera size={16} />
            </a>
            <a
              href="mailto:hello@plansocial.co"
              aria-label="Email PlanSocial"
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
