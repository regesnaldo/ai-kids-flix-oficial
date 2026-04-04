import { headers } from "next/headers";

export interface AuthUser {
  id: number;
  name: string | null;
  email: string | null;
}

export async function getAuthUser(): Promise<AuthUser | null> {
  const requestHeaders = await headers();

  const rawId = requestHeaders.get("x-user-id");
  if (!rawId) {
    return null;
  }

  const parsedId = Number(rawId);
  if (!Number.isInteger(parsedId) || parsedId <= 0) {
    return null;
  }

  return {
    id: parsedId,
    name: requestHeaders.get("x-user-name"),
    email: requestHeaders.get("x-user-email"),
  };
}
