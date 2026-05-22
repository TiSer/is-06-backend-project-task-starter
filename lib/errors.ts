export const unauthorized = (): Response =>
  Response.json({ error: "Unauthorized" }, { status: 401 });

export const forbidden = (): Response =>
  Response.json({ error: "Forbidden" }, { status: 403 });

export const notFound = (resource = "Resource"): Response =>
  Response.json({ error: `${resource} not found` }, { status: 404 });

export const badRequest = (detail: unknown): Response =>
  Response.json({ error: "BadRequest", detail }, { status: 400 });

export const serverError = (): Response =>
  Response.json({ error: "InternalServerError" }, { status: 500 });

export function isResponse(value: unknown): value is Response {
  return value instanceof Response;
}
