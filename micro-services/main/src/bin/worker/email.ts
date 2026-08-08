import "reflect-metadata";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(__dirname, '../../../.env') });


import { start as startCoreService } from "../../services";
import sendEmail from "../../hooks/mailer";
import { Email } from "../../interfaces/hooks/email";

const mailing = async (emailInfo:  Email) => {
    try {
      const result = await sendEmail(emailInfo);
      return result.messageId;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  
// Function to send some messages before consuming the queue
const sendMessages = (channel: { prefetch: (arg0: number) => void; consume: (arg0: any, arg1: (msg: any) => void, arg2: { noAck: boolean; }) => void; ack: (arg0: any) => void; }, queueName: any) => {
  channel.prefetch(1);
  console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queueName);
  channel.consume(queueName, function (msg) {
    var email:Email = JSON.parse(msg.content.toString());
    console.log(" [x] Working....");

    mailing(email).then((res) => {
        if (res) {          
          console.log(" [x] Done");
          channel.ack(msg);
        } else {
          console.log(" [x] Failed"); 
          channel.ack(msg); 
        }
      }); 
  }, {
    noAck: false
  });
};

startCoreService(sendMessages, 'mailer', 'worker');
