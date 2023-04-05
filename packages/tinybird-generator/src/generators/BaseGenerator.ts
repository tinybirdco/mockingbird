import { BaseConfig, RowGenerator, Schema } from "../types";

export default abstract class BaseGenerator<C extends BaseConfig, M> {
  abstract readonly config: C;

  abstract readonly rowGenerator: RowGenerator<M>;

  abstract sendData(data: M[]): Promise<void>;

  abstract createRowGenerator(): RowGenerator<M>;

  async generate(onMessage?: (data: M[]) => void) {
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
