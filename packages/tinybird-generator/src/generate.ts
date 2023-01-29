import { config } from "./config";
import createRowGenerator from "./createRowGenerator";
import { sendData } from "./tinybirdAPI";

export default async function generate(
  onMessage?: (data: Record<string, unknown>[]) => void
) {
  if (!config) return;

  const minDelayPerBatch = 200;
  const maxBatchesPerSecond = 1000 / minDelayPerBatch;

  let batchSize: number, delayPerBatch: number;
  if (config.eps < 1000) {
    batchSize = config.eps;
    delayPerBatch = 1000;
  } else {
    batchSize = config.eps / maxBatchesPerSecond;
    delayPerBatch = minDelayPerBatch;
  }

  const rowGenerator = createRowGenerator(config.schema),
    rows = [];

  let limit = config.limit,
    sentRows = 0;

  while (true) {
    rows.push(rowGenerator.generate());
    if (rows.length >= batchSize) {
      const data = rows.splice(0, batchSize);

      try {
        await sendData(data);
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
