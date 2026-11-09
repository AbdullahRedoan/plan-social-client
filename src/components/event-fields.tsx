/* eslint-disable @next/next/no-img-element */
"use client";

import { ImagePlus } from "lucide-react";
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
import {
  isHttpUrl,
  todayInputValue,
  type EventFormErrors,
  type EventFormValues,
} from "@/lib/event-form";
import { eventCategories, type EventCategory } from "@/lib/events";
import { cn } from "@/lib/utils";

type EventFieldsProps = {
  values: EventFormValues;
  errors: EventFormErrors;
  onChange: (field: keyof EventFormValues, value: string) => void;
  idPrefix?: string;
  disabled?: boolean;
};

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="text-xs font-bold text-destructive">{message}</p>;
}

export function EventFields({
  values,
  errors,
  onChange,
  idPrefix = "event",
  disabled = false,
}: EventFieldsProps) {
  const imagePreview = isHttpUrl(values.image.trim()) ? values.image.trim() : "";

  return (
    <div className="grid gap-5">
      <div className="grid gap-2">
        <Label htmlFor={`${idPrefix}-title`}>Event title</Label>
        <Input
          id={`${idPrefix}-title`}
          value={values.title}
          onChange={(event) => onChange("title", event.target.value)}
          disabled={disabled}
          aria-invalid={Boolean(errors.title)}
          placeholder="e.g. Neighborhood cleanup"
          className="h-11"
        />
        <FieldError message={errors.title} />
      </div>

      <div className="grid gap-2">
        <Label htmlFor={`${idPrefix}-category`}>Category</Label>
        <Select
          value={values.category}
          onValueChange={(value) => onChange("category", value as EventCategory)}
          disabled={disabled}
        >
          <SelectTrigger
            id={`${idPrefix}-category`}
            aria-invalid={Boolean(errors.category)}
            className="h-11 w-full"
          >
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
        <FieldError message={errors.category} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor={`${idPrefix}-date`}>Date</Label>
          <Input
            id={`${idPrefix}-date`}
            type="date"
            value={values.date}
            min={todayInputValue()}
            onChange={(event) => onChange("date", event.target.value)}
            disabled={disabled}
            aria-invalid={Boolean(errors.date)}
            className="h-11"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor={`${idPrefix}-time`}>Start time</Label>
          <Input
            id={`${idPrefix}-time`}
            type="time"
            value={values.time}
            onChange={(event) => onChange("time", event.target.value)}
            disabled={disabled}
            aria-invalid={Boolean(errors.date)}
            className="h-11"
          />
        </div>
        {errors.date ? (
          <div className="sm:col-span-2">
            <FieldError message={errors.date} />
          </div>
        ) : null}
      </div>

      <div className="grid gap-2">
        <Label htmlFor={`${idPrefix}-location`}>Location</Label>
        <Input
          id={`${idPrefix}-location`}
          value={values.location}
          onChange={(event) => onChange("location", event.target.value)}
          disabled={disabled}
          aria-invalid={Boolean(errors.location)}
          placeholder="Where will it happen?"
          className="h-11"
        />
        <FieldError message={errors.location} />
      </div>

      <div className="grid gap-2">
        <Label htmlFor={`${idPrefix}-description`}>Description</Label>
        <Textarea
          id={`${idPrefix}-description`}
          value={values.description}
          onChange={(event) => onChange("description", event.target.value)}
          disabled={disabled}
          aria-invalid={Boolean(errors.description)}
          placeholder="Tell people what to expect"
          className="min-h-32"
        />
        <FieldError message={errors.description} />
      </div>

      <div className="grid gap-2">
        <Label htmlFor={`${idPrefix}-image`}>Thumbnail image URL</Label>
        <Input
          id={`${idPrefix}-image`}
          type="url"
          value={values.image}
          onChange={(event) => onChange("image", event.target.value)}
          disabled={disabled}
          aria-invalid={Boolean(errors.image)}
          placeholder="https://images.example.com/event.jpg"
          className="h-11"
        />
        <FieldError message={errors.image} />
      </div>

      <div
        className={cn(
          "overflow-hidden rounded-lg border border-border bg-secondary",
          imagePreview ? "block" : "hidden",
        )}
      >
        {imagePreview ? (
          <img
            src={imagePreview}
            alt="Event thumbnail preview"
            className="h-44 w-full object-cover"
          />
        ) : null}
      </div>

      {!imagePreview ? (
        <div className="soft-card flex items-center gap-3 rounded-lg bg-secondary p-4 text-sm text-muted-foreground">
          <ImagePlus size={18} className="shrink-0 text-primary" />
          Paste a public image URL and a preview will appear here.
        </div>
      ) : null}
    </div>
  );
}
