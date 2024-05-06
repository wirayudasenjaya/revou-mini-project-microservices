import * as amqp from "amqplib";

async function sendToQueue(queue: string, message: any) {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();
  await channel.assertQueue(queue);
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
}

export { sendToQueue };

