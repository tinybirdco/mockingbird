import type { TinybirdConfig } from 'tinybird-generator';

export function create_worker(
	config: TinybirdConfig,
	onMessage?: (message: MessageEvent<number>) => void,
	onError?: (e: ErrorEvent) => void
) {
	if (!window.Worker) return undefined;

	const worker = new Worker(new URL('$lib/worker.ts', import.meta.url), { type: 'module' });

	if (onMessage) worker.onmessage = onMessage;
	if (onError) worker.onerror = onError;

	worker.postMessage({
		init: config.schema,
		config: config
	});

	return worker;
}

export function start_worker(worker: Worker) {
	worker.postMessage({});
}

export function stop_worker(worker: Worker) {
	worker.terminate();
}
