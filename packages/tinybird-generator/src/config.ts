import { z } from "zod";
import presetSchemas from "./presetSchemas";
import validateSchema from "./validateSchema";

const configSchema = z.object({
  schema: z
    .object({})
    .optional()
    .default(presetSchemas["Web Analytics Starter Kit"])
    .refine(validateSchema),
  endpoint: z.string(),
  datasource: z.string(),
  token: z.string(),
  eps: z.number().optional().default(1),
  limit: z.number().optional().default(-1),
});

type TinybirdConfig = z.infer<typeof configSchema>;

export const config: TinybirdConfig = {} as never;

export function initializeGenerator(
  cfg: Record<string, unknown>,
  validateOnly = false
) {
  const { success } = configSchema.safeParse(cfg);

  if (!success) return false;
  if (validateOnly) return true;

  Object.assign(config, cfg);

  return true;
}
