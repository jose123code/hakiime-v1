const { ConsoleLogger } = require("cdm-logger");
const { RabbitMqSingletonConnectionFactory } = require("../connection");


const logger = ConsoleLogger.create("test", { level: "trace" });
const config = require("../../config/config.json").rabbitMQ;

const start = async (callback, queueName, type) => {
  var hkmMQSingleton = new RabbitMqSingletonConnectionFactory(logger, config);
  const connection = await hkmMQSingleton.create();
  // Create a channel
  const channel = await connection.createChannel();
  // Makes the queue available to the client
  await channel.assertQueue(queueName, {
    durable: true
  });
  // Send some messages to the queue
  callback(channel, queueName);

  if (type === 'sender') {
    setTimeout(function () {
      connection.close();
      process.exit(0);
    }, 500); 
  }
};

module.exports = {
  start,
};
