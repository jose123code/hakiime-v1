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
    // var msg = {
    //     from:'baraka@kbtn.org',
    //     to:'hakimushamavu@gmail.com',
    //     subject:'test',
    //     template:'test',
    //     variables:{
    //         recipientName:'Hakimu shamavu',
    //         randomNumber:717171
    //     },
    //     transporter:{
    //         host:'kbtn.org',
    //         port:587,
    //         user:'baraka@kbtn.org',
    //         pass:'Q2Tf4te5Fycgb7ENOQ'
    //     }
    // };
    const msg = {
        from: '"Info" <info@kbtn.org>',
        subject: '[HKMVote] Joining Confirmation',
        html: true,
        template: 'test',
        variables: {
            recipientName: 'Hakimu shamavu',
            randomNumber: 717171,
        },
        to: 'hakimushamavu@gmail.com',
        replyTo: '"hkmvote" <info@kbtn.org>',
        headers: {
        //   "Content-Type": "text/plain; charset=UTF-8",
        },
        transporter: {
            host: 'kbtn.org',
            port: 587,
            user: 'baraka@kbtn.org',
            pass: 'Q2Tf4te5Fycgb7ENOQ',
        },
    };
    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(msg)));
    console.log(' [x] Sent %s', msg);
};
(0, services_1.start)(sendMessages, 'mailer', 'sender');
