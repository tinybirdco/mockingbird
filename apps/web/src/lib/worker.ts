import type { TinybirdRowGenerator } from 'tinybird-generator';
import { createRowGenerator, setConfig, sendData } from 'tinybird-generator';

let rowGenerator: TinybirdRowGenerator;
const rows: object[] = [];
const max_batch_size = 1000;
let batch_size: number;
const min_delay_per_batch = 200;
let delay_per_batch: number;
const max_batches_per_second = 1000 / min_delay_per_batch;

onmessage = async function (e) {
	if ('init' in e.data) {
		if ('config' in e.data) {
			// Calculate batch size & time delay between batches to align with configured EPS
			const eps = parseInt(e.data.config.eps);
			if (eps < 1000) {
				// We can just send 1 batch every second with the desires EPS value
				batch_size = eps;
				delay_per_batch = 1000;
			} else {
				// We need to send multiple batches every second
				batch_size = eps / max_batches_per_second;
				delay_per_batch = min_delay_per_batch;
			}
			setConfig({
				endpoint: e.data.config.endpoint,
				datasource: e.data.config.datasource,
				token: e.data.config.token
			});
		} else {
			console.log('No config supplied to worker');
		}
		rowGenerator = createRowGenerator(e.data.init);
	} else {
		// eslint-disable-next-line no-constant-condition
		while (true) {
			rows.push(rowGenerator.generate());
			if (rows.length >= batch_size) {
				send();
				await new Promise((r) => setTimeout(r, delay_per_batch));
			}
		}
	}
};

function send() {
	const data = rows.splice(0, batch_size);
	self.postMessage(batch_size);
	sendData(data);
}
