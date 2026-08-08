import client, { Channel, Connection } from "amqplib"
import { ConsoleLogger } from "cdm-logger";
import { HKMRabbitMqConnectionConfig, RabbitMqSingletonConnectionFactory } from "./core-service/connection";



  const logger = ConsoleLogger.create("test", { level: "trace" });
  const config: HKMRabbitMqConnectionConfig = { hostname:'154.56.46.104', password:'bi@+%pa1-rabbitmq',username:"admin2"};
  const queueName = "myQueue";

  // Function to send some messages before consuming the queue
 const sendMessages = (channel: Channel) => {
    for (let i = 0; i < 10; i++) {
      channel.sendToQueue(queueName, Buffer.from(`message ${i}`))
    }
  }

  const start = async () => {
    var hkmMQSingleton = new RabbitMqSingletonConnectionFactory(logger, config);
    const connection: Connection = await hkmMQSingleton.create();
    // Create a channel
    const channel: Channel = await connection.createChannel()
    // Makes the queue available to the client
    await channel.assertQueue(queueName)
    // Send some messages to the queue
    sendMessages(channel)
  }

  start()