import type { EventInput } from "./api";
import { eventCategories, type EventCategory } from "./events";

export type EventFormValues = {
  title: string;
  description: string;
  category: EventCategory;
  image: string;
  location: string;
  date: string;
  time: string;
};

export type EventFormErrors = Partial<Record<keyof EventFormValues, string>>;

export function pad(value: number) {
  return String(value).padStart(2, "0");
}

export function nowWallClock(date = new Date()) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function todayInputValue(date = new Date()) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function buildWallClock(date: string, time: string) {
  if (!date || !time) {
    return "";
  }

  return `${date}T${time.slice(0, 5)}`;
}

export function splitWallClock(value: string) {
  const [date = "", time = "10:00"] = value.split("T");

  return { date, time: time.slice(0, 5) };
}

export function isHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function validateEventForm(
  values: EventFormValues,
  { partial = false }: { partial?: boolean } = {},
): EventFormErrors {
  const errors: EventFormErrors = {};
  const check = (field: keyof EventFormValues) => !partial || values[field] !== "";

  const title = values.title.trim();
  if (check("title")) {
    if (title.length < 2) {
      errors.title = "Title must be at least 2 characters.";
    } else if (title.length > 120) {
      errors.title = "Title must be 120 characters or fewer.";
    }
  }

  const description = values.description.trim();
  if (check("description")) {
    if (description.length < 10) {
      errors.description = "Description must be at least 10 characters.";
    } else if (description.length > 2000) {
      errors.description = "Description must be 2000 characters or fewer.";
    }
  }

  if (check("category") && !eventCategories.includes(values.category)) {
    errors.category = "Choose a category.";
  }

  const image = values.image.trim();
  if (check("image") && !isHttpUrl(image)) {
    errors.image = "Image must be a valid http or https URL.";
  }

  const location = values.location.trim();
  if (check("location")) {
    if (location.length < 2) {
      errors.location = "Location must be at least 2 characters.";
    } else if (location.length > 200) {
      errors.location = "Location must be 200 characters or fewer.";
    }
  }

  const dateTime = buildWallClock(values.date, values.time);
  if (check("date") || check("time")) {
    if (!values.date || !values.time) {
      errors.date = "Choose a date and time.";
    } else if (dateTime <= nowWallClock()) {
      errors.date = "Choose a date and time in the future.";
    }
  }

  return errors;
}

export function toEventInput(values: EventFormValues): EventInput {
  return {
    title: values.title.trim(),
    description: values.description.trim(),
    category: values.category,
    image: values.image.trim(),
    location: values.location.trim(),
    date: buildWallClock(values.date, values.time),
  };
}
