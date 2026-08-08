import { Channel } from "amqplib"
import { start } from "../../core-service";
import 'dotenv/config'; // Add this line to load the .env file


type info ={
  from: string;
  to: string;
  subject: string;
  template: string;
  variables: Record<string, any>;
}

const recipientName = 'John Doe'; // Example of a dynamic value
const randomNumber = Math.floor(Math.random() * 100); // Example of a dynamic value

const variables = { recipientName, randomNumber };

var mailTo:info ={
  from:"baraka@kbtn.org",
  to: "hakimushamavu@gmail.com",
  subject: "Test services",
  template:"test",
  variables:variables

}

// Function to send some messages before consuming the queue
const sendMessages = (channel: Channel, queueName:string) => {
      channel.sendToQueue(queueName, Buffer.from(JSON.stringify(mailTo)), {
        persistent: true
      })
  }

start(sendMessages,'mailer','sender')

console.log(" [x] Sent '%s'", JSON.stringify(mailTo));

