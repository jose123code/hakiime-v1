import { RabbitMqSingletonConnectionFactory } from '../factory';
import { container } from '../inversify.config';
import { INTERFACE_TYPE } from '../utils';

export const start = async (callback: (arg0: any, arg1: any) => void, queueName: any, type: string) => {
  const hkmMQSingleton = container.get<RabbitMqSingletonConnectionFactory>(
    INTERFACE_TYPE.RabbitMqSingletonConnectionFactory,
  );

  const connection = await hkmMQSingleton.create();
  // Create a channel
  const channel = await connection.createChannel();
  // Makes the queue available to the client
  await channel.assertQueue(queueName, {
    durable: true,
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
