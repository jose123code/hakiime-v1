"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../../../.env') });
const services_1 = require("../../services");
// Function to send some messages before consuming the queue
const sendMessages = (channel, queueName) => {
    channel.prefetch(1);
    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queueName);
    channel.consume(queueName, function (msg) {
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
(0, services_1.start)(sendMessages, 'helloTest', 'worker');
