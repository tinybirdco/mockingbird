import { Database, Instance, Spanner, Table } from "@google-cloud/spanner";
import { GoogleAuth } from "google-auth-library";
import { z } from "zod";

import { Row } from "../types";
import BaseGenerator, { baseConfigSchema } from "./BaseGenerator";

const GoogleSpannerConfigSchema = baseConfigSchema.merge(
  z.object({
    projectId: z.string(),
    instanceId: z.string(),
    databaseId: z.string(),
    table: z.string(),
    keyFilename: z.string(),
  })
);

export type GoogleSpannerConfig = z.infer<typeof GoogleSpannerConfigSchema>;

export default class GoogleSpannerGenerator extends BaseGenerator<GoogleSpannerConfig> {
  readonly client: Spanner;
  readonly instance: Instance;
  readonly database: Database;
  readonly table: Table;

  constructor(config: GoogleSpannerConfig) {
    super(GoogleSpannerConfigSchema.parse(config));

    const auth = new GoogleAuth({
      keyFilename: this.config.keyFilename,
    })

    this.client = new Spanner({
      projectId: this.config.projectId,
      auth,
    });

    this.instance = this.client.instance(this.config.instanceId);
    this.database = this.instance.database(this.config.databaseId);
    this.table = this.database.table(this.config.table);
  }

  async sendData(rows: Row[]): Promise<void> {
    try {
      const response = await this.table.insert(rows);
      this.log("info", `Google Spanner Response: ${JSON.stringify(response)}`);
    } catch (err) {
      this.log("error", `Google Spanner Error: ${JSON.stringify(err)}`);
    }
  }
}