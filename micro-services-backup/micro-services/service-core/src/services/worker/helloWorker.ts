import { Channel } from "amqplib"
import { start } from "../../core-service";
import 'dotenv/config'; // Add this line to load the .env file


// Function to send some messages before consuming the queue
const sendMessages = (channel: Channel, queueName:string) => {
    channel.prefetch(1);
    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queueName);
    channel.consume(queueName, function(msg) {
        var secs = msg!.content.toString().split('.').length - 1;

        console.log(" [x] Received %s", msg!.content.toString());
        setTimeout(function() {
          console.log(" [x] Done");
          channel.ack(msg!);
        }, secs * 1000);
    }, {
        noAck: false
      });
  }

start(sendMessages,'helloTest','worker')

