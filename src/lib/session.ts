import "server-only";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";

export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

export async function requireSession(returnTo?: string) {
  const session = await getSession();

  if (!session?.user) {
    if (returnTo) {
      redirect(`/login?next=${encodeURIComponent(returnTo)}`);
    }

    redirect("/login");
  }

  return session;
}

export async function getTokenFromServer() {
  const result = await auth.api.getToken({
    headers: await headers(),
  });

  return result?.token ?? null;
}
