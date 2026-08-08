import "reflect-metadata";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(__dirname, '../../../.env') });


import { start as startCoreService } from "../../services";


// Function to send some messages before consuming the queue
const sendMessages = (channel: { prefetch: (arg0: number) => void; consume: (arg0: any, arg1: (msg: any) => void, arg2: { noAck: boolean; }) => void; ack: (arg0: any) => void; }, queueName: any) => {
  channel.prefetch(1);
  console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queueName);
  channel.consume(queueName, function (msg: { content: { toString: () => { (): any; new(): any; split: { (arg0: string): { (): any; new(): any; length: number; }; new(): any; }; }; }; }) {
    var secs = msg.content.toString().split('.').length - 1;

    console.log(" [x] Received %s", msg.content.toString());
    setTimeout(function () {
      console.log(" [x] Done");
      channel.ack(msg);
    }, secs * 1000);
  }, {
    noAck: false
  });
};

startCoreService(sendMessages, 'helloTest', 'worker');
