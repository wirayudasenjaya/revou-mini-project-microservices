import * as amqp from "amqplib";

const rabbitmqHost = process.env.RABBITMQ_HOST || "localhost";
const rabbitmqUrl = `amqp://${rabbitmqHost}`;

async function sendToQueue(queue: string, message: any) {
  const connection = await amqp.connect(rabbitmqUrl);
  const channel = await connection.createChannel();
  await channel.assertQueue(queue);
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
}

async function consumeFromQueue(
  queue: string,
  callback: (message: any) => void
) {
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

async function getQuantity<T>(requestId: string, queue: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const callback = (msg: any) => {
      if (msg.requestId === requestId) {
        resolve(msg.quantity);
        channel.cancel(consumerTag);
      }
    };

    let connection: amqp.Connection;
    let channel: amqp.Channel;
    let consumerTag: string;

    amqp
      .connect(rabbitmqUrl)
      .then((conn) => {
        connection = conn;
        return conn.createChannel();
      })
      .then((ch) => {
        channel = ch;
        return channel.assertQueue(queue);
      })
      .then(() => {
        return channel.consume(queue, (msg) => {
          if (msg !== null) {
            callback(JSON.parse(msg.content.toString()));
            channel.ack(msg);
          }
        });
      })
      .then((result) => {
        consumerTag = result.consumerTag;
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export { sendToQueue, consumeFromQueue, getQuantity };
