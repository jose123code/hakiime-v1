import 'reflect-metadata';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(__dirname, '../../../.env') });

import { start as startCoreService } from '../../services';
import { Email } from '../../interfaces/hooks/email';

// Function to send some messages before consuming the queue
const sendMessages = (
  channel: { sendToQueue: (arg0: any, arg1: Buffer) => void },
  queueName: any,
) => {
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
  const msg: Email = {
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

startCoreService(sendMessages, 'mailer', 'sender');
