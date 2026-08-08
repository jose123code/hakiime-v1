import client, { Channel, Connection } from "amqplib"
import { ConsoleLogger } from "cdm-logger";
import { HKMRabbitMqConnectionConfig, RabbitMqSingletonConnectionFactory } from "../connection";
import { CallbackFunction, WorkerOrSender } from "..";



  const logger = ConsoleLogger.create("test", { level: "trace" });
  const config: HKMRabbitMqConnectionConfig = { hostname:'154.56.46.104',password:'bi@+%pa1-rabbitmq',username:"admin2"};


  export const start = async (callback:CallbackFunction,queueName:string, type:WorkerOrSender) => {
    var hkmMQSingleton = new RabbitMqSingletonConnectionFactory(logger, config);
    const connection: Connection = await hkmMQSingleton.create();
    // Create a channel
    const channel: Channel = await connection.createChannel()
    // Makes the queue available to the client
    await channel.assertQueue(queueName,{
      durable: true
    })
    // Send some messages to the queue
    callback(channel,queueName)

    if(type == 'sender'){
      setTimeout(function() {
        connection.close();
        process.exit(0)
      }, 500);
    }
  }
