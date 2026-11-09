"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { Avatar } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { isHttpUrl } from "@/lib/event-form";

type ProfileUser = {
  name: string;
  email: string;
  image?: string | null;
};

export function ProfileForm({ user }: { user: ProfileUser }) {
  const router = useRouter();
  const [name, setName] = useState(user.name);
  const [image, setImage] = useState(user.image ?? "");
  const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; image?: string }>({});

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedName = name.trim();
    const trimmedImage = image.trim();
    const nextErrors: { name?: string; image?: string } = {};

    if (trimmedName.length < 2) {
      nextErrors.name = "Name must be at least 2 characters.";
    } else if (trimmedName.length > 80) {
      nextErrors.name = "Name must be 80 characters or fewer.";
    }

    if (trimmedImage && !isHttpUrl(trimmedImage)) {
      nextErrors.image = "Photo URL must be a valid http or https link.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      toast.error("Please fix the highlighted fields.");
      return;
    }

    if (trimmedName === user.name && trimmedImage === (user.image ?? "")) {
      toast.info("No changes to save.");
      return;
    }

    setPending(true);

    try {
      const { error } = await authClient.updateUser({
        name: trimmedName,
        image: trimmedImage || null,
      });

      if (error) {
        toast.error(error.message ?? "Could not update your profile.");
        return;
      }

      toast.success("Profile updated.");
      router.refresh();
    } catch {
      toast.error("Could not update your profile right now.");
    } finally {
      setPending(false);
    }
  }

  const preview = trimmedImageOrEmpty(image);
  const initials =
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "P";

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <div className="flex items-center gap-4">
          {preview ? (
            <Avatar name={name || "PlanSocial member"} image={preview} size="lg" />
          ) : (
            <span className="grid size-12 place-items-center rounded-full bg-primary text-base font-black text-primary-foreground">
              {initials}
            </span>
          )}
          <div>
            <CardTitle className="text-lg font-black">Your profile</CardTitle>
            <CardDescription>
              This is how neighbors see you on events you host or join.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form className="grid gap-5" onSubmit={handleSubmit} noValidate>
          <div className="grid gap-2">
            <Label htmlFor="profile-name">Display name</Label>
            <Input
              id="profile-name"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                setErrors((current) => ({ ...current, name: undefined }));
              }}
              disabled={pending}
              aria-invalid={Boolean(errors.name)}
              className="h-11"
              placeholder="Your name"
            />
            {errors.name ? (
              <p className="text-xs font-bold text-destructive">{errors.name}</p>
            ) : null}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="profile-email">Email address</Label>
            <Input
              id="profile-email"
              value={user.email}
              readOnly
              disabled
              className="h-11"
            />
            <p className="text-xs font-medium text-muted-foreground">
              Email changes require a new account. Ask support if you need help.
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="profile-image">Photo URL</Label>
            <Input
              id="profile-image"
              type="url"
              value={image}
              onChange={(event) => {
                setImage(event.target.value);
                setErrors((current) => ({ ...current, image: undefined }));
              }}
              disabled={pending}
              aria-invalid={Boolean(errors.image)}
              className="h-11"
              placeholder="https://example.com/you.jpg"
            />
            {errors.image ? (
              <p className="text-xs font-bold text-destructive">{errors.image}</p>
            ) : (
              <p className="text-xs font-medium text-muted-foreground">
                Leave blank to show your initials instead.
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="submit"
              disabled={pending}
              className="h-11 px-5 font-bold"
            >
              {pending ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Saving…
                </>
              ) : (
                <>
                  <Save size={16} /> Save profile
                </>
              )}
            </Button>
            <Link
              href="/manage-events"
              className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft size={15} /> Back to your events
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function trimmedImageOrEmpty(value: string) {
  const trimmed = value.trim();
  return isHttpUrl(trimmed) ? trimmed : "";
}
