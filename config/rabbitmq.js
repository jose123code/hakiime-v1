const amqp = require('amqplib');

let connection = null;
let channel = null;

const connectRabbitMQ = async () => {
  try {
    const rabbitUri = process.env.RABBITMQ_URI || 'amqp://localhost:5672';
    connection = await amqp.connect(rabbitUri);
    channel = await connection.createChannel();

    console.log('RabbitMQ Connected successfully, running on port 15672');

    connection.on('error', (err) => {
      console.error('RabbitMQ Connection Error:', err);
    });

    return { connection, channel };
  } catch (error) {
    console.error('Failed to connect to RabbitMQ:', error.message);
    process.exit(1);
  }
};

const getChannel = () => {
  if (!channel) {
    throw new Error('RabbitMQ channel not initialized. Call connectRabbitMQ first.');
  }
  return channel;
};

const publishToQueue = async (queueName, data) => {
  if (!channel) {
    throw new Error("RabbitMQ channel is not initialized");
  }
  await channel.assertQueue(queueName, { durable: true });

  // Convert objects/arrays to JSON strings
  const payload = typeof data === "object" ? JSON.stringify(data) : String(data);

  channel.sendToQueue(queueName, Buffer.from(payload), { persistent: true });
  console.log(`Published message to queue [${queueName}]`);
};

module.exports = {
  connectRabbitMQ,
  getChannel,
  publishToQueue,
};