import { auth } from "./auth";
import { forbidden, unauthorized } from "./errors";

export type Role = "user" | "admin";

export async function getSession(req: Request) {
  return auth.api.getSession({ headers: req.headers });
}

/**
 * Returns the session or throws a 401 `Response`.
 * Use inside a route handler wrapped with try/catch on `isResponse(e)`.
 */
export async function requireSession(req: Request) {
  const session = await getSession(req);
  if (!session) throw unauthorized();
  return session;
}

/**
 * Returns the session or throws a 401/403 `Response`.
 */
export async function requireRole(req: Request, role: Role) {
  const session = await requireSession(req);
  const userRole = (session.user as { role?: string }).role ?? "user";
  if (userRole !== role) throw forbidden();
  return session;
}

export function isOwner(
  session: Awaited<ReturnType<typeof requireSession>>,
  ownerId: string,
): boolean {
  return session.user.id === ownerId;
}
