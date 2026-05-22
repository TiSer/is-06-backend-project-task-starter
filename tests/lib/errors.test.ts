import { describe, expect, it } from "vitest";
import {
  badRequest,
  forbidden,
  isResponse,
  notFound,
  unauthorized,
} from "@/lib/errors";

describe("error helpers", () => {
  it("unauthorized returns 401 JSON", async () => {
    const res = unauthorized();
    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({ error: "Unauthorized" });
  });

  it("forbidden returns 403 JSON", async () => {
    const res = forbidden();
    expect(res.status).toBe(403);
  });

  it("notFound returns 404 with resource label", async () => {
    const res = notFound("Post");
    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.error).toContain("Post");
  });

  it("badRequest carries detail", async () => {
    const res = badRequest({ field: "title", reason: "required" });
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body).toEqual({
      error: "BadRequest",
      detail: { field: "title", reason: "required" },
    });
  });

  it("isResponse type-guards Response instances", () => {
    expect(isResponse(new Response("x"))).toBe(true);
    expect(isResponse({ status: 200 })).toBe(false);
  });
});
