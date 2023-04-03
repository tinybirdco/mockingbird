import dataTypes from "./schemaTypes";
import { BaseConfig, RowGenerator, Schema, SchemaKey } from "./types";

export default abstract class BaseGenerator<C extends BaseConfig> {
  abstract readonly config: C;

  readonly rowGenerator: RowGenerator;

  constructor(config: C) {
    this.rowGenerator = this.createRowGenerator(config.schema);
  }

  abstract sendData(data: Record<string, unknown>[]): Promise<void>;

  createRowGenerator(schema: Schema): RowGenerator {
    const generatorSchema = Object.entries(schema).reduce(
      (acc, [key, value]) => ({
        ...acc,
        [key]: {
          generator: dataTypes[value.type as SchemaKey].generator,
          params: value.params ?? {},
        },
      }),
      {}
    );

    return {
      generate() {
        return Object.entries(generatorSchema).reduce((acc, [key, value]) => {
          const v = value as { generator: Function; params: unknown[] };

          return {
            ...acc,
            [key]: v.generator(v.params),
          };
        }, {});
      },
    };
  }

  async generate(onMessage?: (data: Record<string, unknown>[]) => void) {
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
      rows.push(this.rowGenerator.generate());
      if (rows.length >= batchSize) {
        const data = rows.splice(0, batchSize);

        try {
          await this.sendData(data);
          if (onMessage) onMessage(data);
        } catch (ex) {
          console.log(`ERR > ${ex}.`);
          break;
        }

        sentRows += data.length;
        console.log(`INFO> ${sentRows} rows sent so far...`);

        if (limit != -1 && sentRows >= limit) break;

        await new Promise((r) => setTimeout(r, delayPerBatch));
      }
    }
  }
}
