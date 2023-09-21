import { Row } from "../types";
import BaseGenerator, { BaseConfig, baseConfigSchema } from "./BaseGenerator";

export default class LogGenerator extends BaseGenerator<BaseConfig> {
  constructor(config: BaseConfig) {
    super(baseConfigSchema.parse(config));
  }

  async sendData(rows: Row[]): Promise<void> {
    console.log(rows);
  }
}
