import { Channel } from "amqplib"
import { start } from "../../core-service";
import 'dotenv/config'; // Add this line to load the .env file


var msg = process.argv.slice(2).join(' ') || "Hello World!......";
// Function to send some messages before consuming the queue
const sendMessages = (channel: Channel, queueName:string) => {
      channel.sendToQueue(queueName, Buffer.from(msg), {
        persistent: true
      })
  }

start(sendMessages,'helloTest','sender')

console.log(" [x] Sent '%s'", msg);

