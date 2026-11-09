import type { CommunityEvent, EventCategory } from "./events";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export type EventInput = {
  title: string;
  description: string;
  category: EventCategory;
  image: string;
  location: string;
  date: string;
};

export class ApiError extends Error {
  status: number;
  fieldErrors?: Record<string, string>;

  constructor(
    message: string,
    status: number,
    fieldErrors?: Record<string, string>,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  token?: string | null;
};

async function apiRequest<T>(
  path: string,
  { method = "GET", body, token }: RequestOptions = {},
): Promise<T> {
  const headers: Record<string, string> = { Accept: "application/json" };

  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response: Response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      cache: "no-store",
    });
  } catch {
    throw new ApiError(
      "Could not reach the PlanSocial API. Please try again in a moment.",
      0,
    );
  }

  if (!response.ok) {
    let message = "Something went wrong. Please try again.";
    let fieldErrors: Record<string, string> | undefined;

    try {
      const data = (await response.json()) as {
        message?: unknown;
        errors?: unknown;
      };

      if (typeof data.message === "string") {
        message = data.message;
      }

      if (data.errors && typeof data.errors === "object") {
        fieldErrors = data.errors as Record<string, string>;
      }
    } catch {
      // Keep the generic message when the response has no JSON body.
    }

    throw new ApiError(message, response.status, fieldErrors);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export const eventsApi = {
  list(limit?: number) {
    const query = limit ? `?limit=${limit}` : "";
    return apiRequest<CommunityEvent[]>(`/events${query}`);
  },

  get(id: string) {
    return apiRequest<CommunityEvent>(`/events/${encodeURIComponent(id)}`);
  },

  mine(token: string) {
    return apiRequest<CommunityEvent[]>("/events/mine", { token });
  },

  joined(token: string) {
    return apiRequest<CommunityEvent[]>("/events/joined", { token });
  },

  create(token: string, input: EventInput) {
    return apiRequest<CommunityEvent>("/events", {
      method: "POST",
      body: input,
      token,
    });
  },

  update(token: string, id: string, input: Partial<EventInput>) {
    return apiRequest<CommunityEvent>(`/events/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: input,
      token,
    });
  },

  remove(token: string, id: string) {
    return apiRequest<void>(`/events/${encodeURIComponent(id)}`, {
      method: "DELETE",
      token,
    });
  },

  join(token: string, id: string) {
    return apiRequest<CommunityEvent>(
      `/events/${encodeURIComponent(id)}/join`,
      { method: "POST", token },
    );
  },
};
