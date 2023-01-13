import type { TinybirdSchema } from 'tinybird-generator';

export function create_worker(callback?: (message: number) => void) {
	const worker = new Worker(new URL('$lib/worker.ts', import.meta.url), {
		type: 'module'
	});

	if (window.Worker) {
		worker.onmessage = function (e) {
			if (callback) callback(e.data);
		};

		worker.onerror = function (event) {
			console.log(event);
		};
	}

	return worker;
}

export function init_worker(worker: Worker, schema: TinybirdSchema, config: object) {
	const data = {
		init: schema,
		config: config
	};
	worker.postMessage(data);
}

export function start_worker(worker: Worker) {
	const data = {};
	worker.postMessage(data);
}

export function stop_worker(worker: Worker) {
	worker.terminate();
}
