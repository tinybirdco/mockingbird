import type { DestinationType } from "./types";
import type {
  TinybirdConfig,
  AblyConfig,
  AWSSNSConfig,
  Schema,
} from "@tinybirdco/mockingbird/client";

export function createWorker(
  destination: DestinationType,
  config: TinybirdConfig | AblyConfig | AWSSNSConfig,
  schema: Schema,
  onMessage?: (message: MessageEvent<number | { error: string }>) => void,
  onError?: (e: ErrorEvent) => void
) {
  if (typeof window === "undefined" || !window.Worker) return null;
  console.log(schema);
  const worker = new Worker(new URL("./worker.ts", import.meta.url), {
    type: "module",
  });

  if (onMessage) {
    worker.onmessage = (event) => {
      if (typeof event.data === "object" && "error" in event.data) {
        console.error("Worker error:", event.data.error);
        if (onError)
          onError(
            new ErrorEvent("error", { error: new Error(event.data.error) })
          );
      } else {
        onMessage(event);
      }
    };
  }
  if (onError) worker.onerror = onError;

  worker.postMessage({
    init: schema,
    destination,
    config,
  });

  return worker;
}

export function startWorker(worker: Worker) {
  console.log("starting worker");
  worker.postMessage({ start: true });
}

export function stopWorker(worker: Worker) {
  console.log("stopping worker");
  worker.terminate();
}
