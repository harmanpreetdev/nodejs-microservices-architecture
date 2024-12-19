import amqp from "amqplib";
import { sendEmail } from "../services/email.service";
import { config } from "../config/config";

const MAX_RETRIES = 5;
const RETRY_DELAY = 3000;

export const connectRabbitMQ = async () => {
  let retries = 0;

  while (retries < MAX_RETRIES) {
    try {
      console.log("Config Rabbitmq Url:", config.rabbitmq.url);
      const connection = await amqp.connect(config.rabbitmq.url);
      const channel = await connection.createChannel();
      await channel.assertQueue(config.rabbitmq.queue, { durable: true });

      console.log(`Waiting for messages in ${config.rabbitmq.queue}`);

      channel.consume(config.rabbitmq.queue, async (msg) => {
        if (msg) {
          const emailData = JSON.parse(msg.content.toString());

          const {
            to,
            subject,
            text,
            html,
            templateName,
            templateData,
            attachments,
          } = emailData;

          try {
            await sendEmail(
              to,
              subject,
              text,
              html,
              templateName,
              templateData,
              attachments
            );
            channel.ack(msg);
          } catch (error) {
            console.error("Error processing email message:", error);
            channel.nack(msg, false, true);
          }
        }
      });

      return;
    } catch (error) {
      retries++;
      console.error(
        `Error connecting to RabbitMQ (Attempt ${retries} of ${MAX_RETRIES}):`,
        error
      );

      if (retries >= MAX_RETRIES) {
        console.error("Maximum retry attempts reached. Exiting...");
        throw new Error(
          "Failed to connect to RabbitMQ after multiple attempts."
        );
      }

      console.log(`Retrying in ${RETRY_DELAY / 1000} seconds...`);
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
    }
  }
};
