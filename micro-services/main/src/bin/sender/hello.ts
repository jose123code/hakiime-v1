import "reflect-metadata";
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(__dirname, '../../../.env') });

import { start as startCoreService } from "../../services";

// Function to send some messages before consuming the queue
const sendMessages = (channel: { sendToQueue: (arg0: any, arg1: Buffer) => void; }, queueName: any) => {
    var msg = 'hello world';
    channel.sendToQueue(queueName, Buffer.from(msg));
    console.log(" [x] Sent %s", msg);
};

startCoreService(sendMessages, 'helloTest', 'sender');
