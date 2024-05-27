import { Kafka, Consumer, EachMessagePayload } from "kafkajs";
import { NotificationRepository } from "../repositories/notification-repository";

const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID || "",
  brokers: [process.env.KAFKA_BROKER || ""],
  ssl: true,
  sasl: {
    mechanism: "plain",
    username: process.env.KAFKA_USERNAME || "",
    password: process.env.KAFKA_PASSWORD || "",
  },
});

const consumer: Consumer = kafka.consumer({ groupId: process.env.KAFKA_GROUP_ID || "" });

async function consumeFromKafkaQueue(notificationRepository: NotificationRepository): Promise<void> {
  try {
    await consumer.connect();
    await consumer.subscribe({
      topic: process.env.KAFKA_TOPIC || "",
      fromBeginning: true,
    });
    console.log("Notification service connected to kafka");

    await consumer.run({
      eachMessage: async ({
        topic,
        partition,
        message,
      }: EachMessagePayload) => {
        if (message.value !== null && message.value !== undefined) {
          const data = JSON.parse(message.value.toString());
          if (data.owner === "wira") {
            console.log({
              partition,
              offset: message.offset,
              value: message.value.toString(),
            });
            notificationRepository.create({
              id: 0,
              message: `Notification Created From Kafka ${message.value.toString()}`,
              date: new Date(),
            })
          }
        }
      },
    });
    console.log("Consumer started successfully!");
  } catch (error: any) {
    console.error("Error consuming message:", error);
  }
}

export { consumeFromKafkaQueue };
