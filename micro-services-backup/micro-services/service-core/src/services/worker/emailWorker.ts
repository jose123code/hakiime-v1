import { Channel } from "amqplib"
import { start } from "../../core-service";
import { sendEmail } from "../../systemInbuildServices";
import 'dotenv/config'; // Add this line to load the .env file


type info ={
    from: string;
    to: string;
    subject: string;
    template: string;
    variables: Record<string, any>;
}
const mailing = async(emailInfo:info) => {
    try {
        const result = await sendEmail(emailInfo.from, emailInfo.to, emailInfo.subject, emailInfo.template, emailInfo.variables);
        return result.messageId;
      } catch (error) {
        console.log(error);
        
        return false;
      }
}

// Function to send some messages before consuming the queue
const sendEmailer = (channel: Channel, queueName:string) => {
    channel.prefetch(1);
    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queueName);
    channel.consume(queueName, function(msg) {
        var emails = JSON.parse(msg!.content.toString()) as info;
        // console.log(" [x] Received %s", msg!.content.toString());

        mailing(emails).then(res=>{
            if(res){
                console.log(" [x] Done");
                channel.ack(msg!);
            }else{
                console.log(" [x] Failed");
                channel.ack(msg!);

            }
        })
    }, {
        noAck: false
      });
  }

start(sendEmailer,'mailer','worker')

