import { TinybirdConfig, configSchema } from "./types";

export const config: TinybirdConfig = {} as never;

export function initializeGenerator(
  cfg: Record<string, unknown>,
  validateOnly = false
) {
  const result = configSchema.safeParse(cfg);

  if (!result.success) {
    console.error(result.error);
    return false;
  }

  if (validateOnly) return true;

  Object.assign(config, cfg);

  return true;
}
