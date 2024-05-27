import * as amqp from "amqplib";

async function sendToQueue(queue: string, message: any) {
  const rabbitmqHost = process.env.RABBITMQ_HOST || "localhost";
  const rabbitmqUrl = `amqp://${rabbitmqHost}`

  const connection = await amqp.connect(rabbitmqUrl);
  const channel = await connection.createChannel();
  await channel.assertQueue(queue);
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
}

async function consumeFromQueue(queue: string, callback: (message: any) => void) {
  const rabbitmqHost = process.env.RABBITMQ_HOST || "localhost";
  const rabbitmqUrl = `amqp://${rabbitmqHost}`
  
  const connection = await amqp.connect(rabbitmqUrl);
  const channel = await connection.createChannel();
  await channel.assertQueue(queue);
  channel.consume(queue, (msg) => {
    if (msg !== null) {
      callback(JSON.parse(msg.content.toString()));
      channel.ack(msg);
    }
  });
}

export { sendToQueue, consumeFromQueue };

