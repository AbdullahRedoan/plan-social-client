import type { Metadata } from "next";
import { ProfileForm } from "@/components/profile-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { requireSession } from "@/lib/session";

export const instant = false;

export const metadata: Metadata = {
  title: "Your profile",
};

export default async function ProfilePage() {
  const session = await requireSession("/profile");

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
        <p className="eyebrow">Account</p>
        <h1 className="section-title max-w-2xl">
          Your <em>profile.</em>
        </h1>
        <p className="mt-4 max-w-xl text-base text-muted-foreground">
          Keep your name and photo up to date so organizers know who is joining.
        </p>

        <div className="mt-10">
          <ProfileForm
            user={{
              name: session.user.name,
              email: session.user.email,
              image: session.user.image ?? null,
            }}
          />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
