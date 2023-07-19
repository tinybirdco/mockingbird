import _get from "lodash.get";

import extendedFaker from "../extendedFaker";
import { BaseConfig, Row } from "../types";

export default abstract class BaseGenerator<C extends BaseConfig> {
  abstract readonly config: C;

  private state: Record<string, unknown> = {};

  abstract sendData(data: Row[]): Promise<void>;

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

    const rows = [];

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
