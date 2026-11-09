"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { EventFields } from "@/components/event-fields";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ApiError, eventsApi } from "@/lib/api";
import { getTokenFromClient } from "@/lib/auth-client";
import {
  toEventInput,
  todayInputValue,
  validateEventForm,
  type EventFormErrors,
  type EventFormValues,
} from "@/lib/event-form";

const emptyValues: EventFormValues = {
  title: "",
  description: "",
  category: "Donation",
  image: "",
  location: "",
  date: todayInputValue(),
  time: "10:00",
};

export function CreateEventForm() {
  const router = useRouter();
  const [values, setValues] = useState<EventFormValues>(emptyValues);
  const [errors, setErrors] = useState<EventFormErrors>({});
  const [pending, setPending] = useState(false);

  function handleChange(field: keyof EventFormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateEventForm(values);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      toast.error("Please fix the highlighted fields.");
      return;
    }

    setPending(true);

    try {
      const token = await getTokenFromClient();
      const created = await eventsApi.create(token, toEventInput(values));
      toast.success(`“${created.title}” is live.`);
      router.push("/events");
      router.refresh();
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.fieldErrors) {
          setErrors(error.fieldErrors as EventFormErrors);
        }
        toast.error(error.message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Could not publish your event. Please try again.");
      }
    } finally {
      setPending(false);
    }
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
        <form className="grid gap-5" onSubmit={handleSubmit} noValidate>
          <EventFields
            values={values}
            errors={errors}
            onChange={handleChange}
            idPrefix="create-event"
            disabled={pending}
          />

          <Button
            type="submit"
            disabled={pending}
            className="h-11 w-fit px-5 font-bold"
          >
            {pending ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Publishing…
              </>
            ) : (
              <>
                <Plus size={16} /> Publish event
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
