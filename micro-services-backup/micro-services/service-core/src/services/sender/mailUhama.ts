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

const variables = {
  "clientFirstName": "John",
  "clientLastName": "Doe",
  "clientEmail": "hakimushamavu@gmail.com",
  "clientPhone": "123-456-7890",
  "numTravelers": "2",
  "destination": "Safari Adventure",
  "howHeard": "Word of Mouth",
  "companyAddress": "123 Safari St, Savanna City",
  "companyPhone": "555-123-4567",
  "companyEmail": "info@uhamatravel.com"
}
;

var mailTo:info ={
  from:"baraka@kbtn.org",
  to: "hakimushamavu@gmail.com",
  subject: "Test services",
  template:"clientInquiry",
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

