import { Kafka, Producer, Consumer, EachMessagePayload } from "kafkajs";

const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID || "",
  brokers: [process.env.KAFKA_BROKER || ""],
  ssl: true,
  sasl: {
    mechanism: "plain",
    username: process.env.KAFKA_USERNAME || "",
    password: process.env.KAFKA_PASSWORD || ""
  }
});

const producer: Producer = kafka.producer();
const consumer: Consumer = kafka.consumer({ groupId: process.env.KAFKA_GROUP_ID || "" });

async function sendToKafkaQueue(key: string, value: any): Promise<void> {
  try {
    await producer.connect();
    console.log("Order service connected to kafka")
    await producer.send({
      topic: process.env.KAFKA_TOPIC || "",
      messages: [{ value: Buffer.from(
				JSON.stringify({
					owner: "wira",
          key: key,
					value: value
				})
			) }],
    });
    console.log("Message sent successfully!");
  } catch (error: any) {
    console.error("Error producing message:", error);
  }
}

async function consumeFromKafkaQueue(): Promise<void> {
  try {
    await consumer.connect();
    await consumer.subscribe({ topic: process.env.KAFKA_TOPIC || "", fromBeginning: true });
    console.log("connected to kafka");

    await consumer.run({
      eachMessage: async ({ topic, partition, message }: EachMessagePayload) => {
        if (message.value !== null && message.value !== undefined) {
          console.log({
            partition,
            offset: message.offset,
            value: message.value.toString(),
          });
        }
      },
    });
    console.log("Consumer started successfully!");
  } catch (error: any) {
    console.error("Error consuming message:", error);
  }
}

export { sendToKafkaQueue, consumeFromKafkaQueue }
