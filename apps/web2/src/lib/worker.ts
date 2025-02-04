import { MockingbirdGenerator } from "@tinybirdco/mockingbird/client";
import type { DestinationType } from "./types";

import {
  TinybirdGenerator,
  AblyGenerator,
  AWSSNSGenerator,
} from "@tinybirdco/mockingbird/client";

let generator: MockingbirdGenerator;

const nameToGenerator = {
  Tinybird: TinybirdGenerator,
  Ably: AblyGenerator,
  AWSSNS: AWSSNSGenerator,
} as const;

onmessage = async function (e) {
  try {
    if ("init" in e.data) {
      const destination = e.data.destination as DestinationType;
      if ("config" in e.data) {
        generator = new nameToGenerator[destination]({
          ...e.data.config,
          schema: e.data.init,
        });
      } else {
        throw new Error("No config supplied to worker");
      }
    } else if (generator) {
      await generator.generate((data) => {
        try {
          self.postMessage(data.length);
        } catch (error) {
          self.postMessage({ error: `Error posting message: ${error}` });
        }
      });
    }
  } catch (error) {
    self.postMessage({ error: `Worker error: ${error}` });
  }
};
