import { z } from "zod";

/**
 * @description The schema object for JSON Schema generation
 */
export const schema = z.object({
  type: z.string(),
  count: z.number().optional(),
  params: z.record(z.unknown()).optional(),
});

export type Schema = z.infer<typeof schema>;
