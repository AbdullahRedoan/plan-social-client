import { HeartHandshake } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * The PlanSocial brand mark: a slightly tilted, hard-shadowed tile with the
 * heart-handshake glyph. Shared by the header and the footer, and mirrored by
 * `public/icon.svg` so the favicon matches the site.
 */
export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "grid size-9 rotate-[-4deg] place-items-center rounded-lg bg-primary text-primary-foreground shadow-[3px_3px_0_var(--foreground)]",
        className,
      )}
    >
      <HeartHandshake size={18} />
    </span>
  );
}
