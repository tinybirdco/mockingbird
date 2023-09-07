import amqp from "amqplib";
import { z } from "zod";
import { Row } from "../types";
import BaseGenerator, { baseConfigSchema } from "./BaseGenerator";

const rabbitmqConfigSchema = baseConfigSchema.merge(
  z.object({
    endpoint: z.string(),
    queue: z.string(),
    assertQueueOptions: z
      .object({
        exclusive: z.boolean().optional(),
        durable: z.boolean().optional(),
        autoDelete: z.boolean().optional(),
        arguments: z.any().optional(),
        messageTtl: z.number().optional(),
        expires: z.number().optional(),
        deadLetterExchange: z.string().optional(),
        deadLetterRoutingKey: z.string().optional(),
        maxLength: z.number().optional(),
        maxPriority: z.number().optional(),
      })
      .optional(),
    publishOptions: z
      .object({
        expiration: z.string().or(z.number()).optional(),
        userId: z.string().optional(),
        CC: z.string().or(z.array(z.string())).optional(),
        mandatory: z.boolean().optional(),
        persistent: z.boolean().optional(),
        deliveryMode: z.boolean().or(z.number()).optional(),
        BCC: z.string().or(z.array(z.string())).optional(),
        contentType: z.string().optional(),
        contentEncoding: z.string().optional(),
        headers: z.any().optional(),
        priority: z.number().optional(),
        correlationId: z.string().optional(),
        replyTo: z.string().optional(),
        messageId: z.string().optional(),
        timestamp: z.number().optional(),
        type: z.string().optional(),
        appId: z.string().optional(),
      })
      .optional(),
  })
);

export type RabbitMQConfig = z.infer<typeof rabbitmqConfigSchema>;

export default class RabbitMQGenerator extends BaseGenerator<RabbitMQConfig> {
  connection: amqp.Connection | undefined;

  constructor(config: RabbitMQConfig) {
    super(rabbitmqConfigSchema.parse(config));
  }

  async sendData(rows: Row[]): Promise<void> {
    try {
      if (!this.connection) {
        this.connection = await amqp.connect(this.config.endpoint);
      }

      const channel = await this.connection.createChannel();

      await channel.assertQueue(
        this.config.queue,
        this.config.assertQueueOptions
      );

      const sent = channel.sendToQueue(
        this.config.queue,
        Buffer.from(JSON.stringify(rows)),
        this.config.publishOptions
      );

      this.log("info", `RabbitMQ Response: ${JSON.stringify(sent)}`);

      await channel.close();
    } catch (err) {
      this.log("error", `RabbitMQ Error: ${JSON.stringify(err)}`);

      if (this.connection) {
        await this.connection.close();
        this.connection = undefined;
      }
    }
  }
}
