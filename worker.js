const amqp = require("amqplib");

async function startWorker() {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL || "amqp://localhost");
    const channel = await connection.createChannel();
    const queue = "user_events";

    await channel.assertQueue(queue, { durable: true });
    console.log(`👷 Worker started! Waiting for messages in [${queue}]...`);

    channel.consume(queue, (msg) => {
      if (msg !== null) {
        try {
          const contentStr = msg.content.toString();
          const data = JSON.parse(contentStr);

          console.log("📥 Received Event:", data);

          // Acknowledge processed message
          channel.ack(msg);
        } catch (err) {
          console.error("❌ Failed to parse message payload:", msg.content.toString());
          // Reject invalid messages without requeuing them
          channel.nack(msg, false, false);
        }
      }
    });
  } catch (error) {
    console.error("❌ Worker connection error:", error);
  }
}

startWorker();