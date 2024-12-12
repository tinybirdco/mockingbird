import { z } from "zod";
import extendedFaker from "../extendedFaker";
import { Row, Schema, validateSchema } from "../types";
import _get from "lodash.get";

// Helper function to safely get nested object properties
const getNestedValue = (obj: any, path: string) => {
  return path.split(".").reduce((current, key) => current?.[key], obj);
};

export const schemaSchema = z.record(
  z.object({
    type: z.string(),
    params: z.any().optional(),
    count: z.number().optional(),
  })
);

export const baseConfigSchema = z.object({
  schema: schemaSchema.refine((schemaSchema) =>
    validateSchema(schemaSchema as Schema)
  ),
  eps: z.number().optional().default(1),
  limit: z.number().optional().default(-1),
  logs: z.boolean().default(false).optional(),
});

export type BaseConfig = z.infer<typeof baseConfigSchema>;

export default abstract class BaseGenerator<C extends BaseConfig> {
  config: C;

  private state: Record<string, unknown> = {};

  abstract sendData(data: Row[]): Promise<void>;

  constructor(config: C) {
    this.config = config;
  }

  log(level: "info" | "error", message: string) {
    if (!this.config.logs) return;

    if (level === "info") {
      console.log(`INFO> ${message}`);
    } else if (level === "error") {
      console.error(console.log(`ERR > ${message}.`));
    }
  }

  generateRow(): Row {
    const generatedRow = Object.entries(this.config.schema).reduce(
      (acc, [key, value]) => {
        const generator = _get(extendedFaker, value.type),
          params = value.params ?? [],
          count = value.count ?? 1;

        const generatedValues = new Array(count)
          .fill(null)
          .map(() => generator(...params, { state: this.state }));

        return {
          ...acc,
          [key]: count === 1 ? generatedValues[0] : generatedValues,
        };
      },
      {} as Record<string, unknown | unknown[]>
    );

    return generatedRow;
  }

  async generate(onMessage?: (data: Row[]) => void) {
    const minDelayPerBatch = 200;
    const maxBatchesPerSecond = 1000 / minDelayPerBatch;

    let batchSize: number, delayPerBatch: number;
    if (this.config.eps < 1000) {
      batchSize = this.config.eps;
      delayPerBatch = 1000;
    } else {
      batchSize = this.config.eps / maxBatchesPerSecond;
      delayPerBatch = minDelayPerBatch;
    }

    const rows: Row[] = [];

    let limit = this.config.limit,
      sentRows = 0;

    while (true) {
      rows.push(this.generateRow());

      if (rows.length >= batchSize) {
        const data = rows.splice(0, batchSize);

        try {
          await this.sendData(data);
          if (onMessage) onMessage(data);
        } catch (e) {
          this.log("error", String(e));
          break;
        }

        sentRows += data.length;

        this.log("info", `${sentRows} rows sent so far...`);

        if (limit != -1 && sentRows >= limit) break;

        await new Promise((r) => setTimeout(r, delayPerBatch));
      }
    }
  }
}
