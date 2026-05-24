import { z } from "zod";

const trackIdSlug = z
  .string()
  .min(1)
  .max(64)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: "trackId must be a lowercase slug (e.g. dniprokart)",
  });

const sessionDateIso = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: "sessionDate must be ISO date YYYY-MM-DD",
  })
  .refine((value) => !Number.isNaN(Date.parse(`${value}T00:00:00.000Z`)), {
    message: "sessionDate is not a valid calendar date",
  });

const averageLapDisplay = z.string().min(1).max(16);

const lapCountNonNegative = z.number().int().min(0);

export const createTrackSessionSchema = z.object({
  trackId: trackIdSlug,
  title: z.string().min(1).max(200),
  lapCount: lapCountNonNegative,
  averageLap: averageLapDisplay,
  sessionDate: sessionDateIso,
  published: z.boolean().optional().default(false),
});

export const updateTrackSessionSchema = createTrackSessionSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });

export const listTrackSessionsQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
  publishedOnly: z
    .preprocess((value) => {
      if (value === undefined || value === null || value === "") {
        return undefined;
      }
      if (value === "true" || value === true) return true;
      if (value === "false" || value === false) return false;
      return value;
    }, z.boolean().optional())
    .optional(),
});

export const trackSessionIdSchema = z
  .string()
  .min(1)
  .max(64)
  .regex(/^[A-Za-z0-9_-]+$/, {
    message: "id must be a valid identifier",
  });

export type CreateTrackSessionInput = z.infer<typeof createTrackSessionSchema>;
export type UpdateTrackSessionInput = z.infer<typeof updateTrackSessionSchema>;
export type ListTrackSessionsQuery = z.infer<typeof listTrackSessionsQuerySchema>;
