"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, ImagePlus, Plus } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { eventCategories, type EventCategory } from "@/lib/events";

export function CreateEventForm() {
  const [category, setCategory] = useState<EventCategory>("Donation");
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <Card className="max-w-2xl">
        <CardContent className="flex flex-col items-start gap-4 py-10">
          <span className="grid size-12 place-items-center rounded-full bg-primary/10 text-primary">
            <Check size={22} />
          </span>
          <div>
            <h2 className="text-xl font-black tracking-tight">
              Your event is ready to review.
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              This is a UI preview — once the API is connected, the event will
              be saved and published from here.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              render={<Link href="/manage-events" />}
              className="h-11 px-5 font-bold"
            >
              Go to manage events <ArrowRight size={16} />
            </Button>
            <Button
              variant="outline"
              onClick={() => setSubmitted(false)}
              className="h-11 px-5 font-bold"
            >
              Create another
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle className="text-lg font-black">Event details</CardTitle>
        <CardDescription>
          Tell people what you are planning and why it matters.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="grid gap-5"
          onSubmit={(event) => {
            event.preventDefault();
            setSubmitted(true);
          }}
        >
          <div className="grid gap-2">
            <Label htmlFor="event-title">Event title</Label>
            <Input
              id="event-title"
              required
              placeholder="e.g. Neighborhood cleanup"
              className="h-11"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="event-category">Category</Label>
            <Select
              value={category}
              onValueChange={(value) => setCategory(value as EventCategory)}
            >
              <SelectTrigger id="event-category" className="h-11 w-full">
                <SelectValue placeholder="Choose a category" />
              </SelectTrigger>
              <SelectContent>
                {eventCategories.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="event-date">Date</Label>
              <Input id="event-date" type="date" required className="h-11" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="event-time">Start time</Label>
              <Input id="event-time" type="time" required className="h-11" />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="event-location">Location</Label>
            <Input
              id="event-location"
              required
              placeholder="Where will it happen?"
              className="h-11"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="event-description">Description</Label>
            <Textarea
              id="event-description"
              required
              placeholder="Tell people what to expect"
              className="min-h-32"
            />
          </div>

          <div className="soft-card flex items-center gap-3 rounded-lg bg-secondary p-4 text-sm text-muted-foreground">
            <ImagePlus size={18} className="shrink-0 text-primary" />
            Image uploads arrive with the API. For now, published events use a
            placeholder photo.
          </div>

          <Button type="submit" className="h-11 w-fit px-5 font-bold">
            <Plus size={16} /> Publish event
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
