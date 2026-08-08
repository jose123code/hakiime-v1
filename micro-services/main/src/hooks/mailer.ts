import nodemailer, { Transporter, SendMailOptions } from 'nodemailer';
import ejs from 'ejs';
import { Agent } from 'https';
import path from 'path';
import { container } from '../inversify.config';
import { ConfigurationManager } from '../app/config';
import { INTERFACE_TYPE, isNotNull, isSet, isString, unSet } from '../utils';
import { ApplicationConfig, EmailConfig } from '../interfaces';
import { Email, EmailTransporter } from '../interfaces/hooks/email';

const config = container.get<ConfigurationManager>(
    INTERFACE_TYPE.ConfigurationManager,
  ).getConfig() as ApplicationConfig;

const emailConfig: EmailConfig = config.emailConfig;

const agent = new Agent({
  rejectUnauthorized: false, // Bypass hostname verification (Not recommended for production)
});

emailConfig.tls = {
  ...emailConfig.tls,
  agent,
};

const emailTimeout = 15000; // 15 seconds timeout for email sending

const defaultHeaders = {
  "Content-Type": "text/plain; charset=UTF-8",
  // reply_to: "no-reply@example.com"
};

// Create a transporter with the security options
const transporter: Transporter = nodemailer.createTransport(emailConfig);

async function sendEmail(emailOptions:Email): Promise<any> {
  // Validate required fields
  if (!emailOptions.from) throw new Error('Missing "from" field');
  if (!emailOptions.subject) throw new Error('Missing "subject" field');
  if (!emailOptions.to) throw new Error('Missing "to" field');

  // Set default values for optional fields if they are not provided
  emailOptions.variables = emailOptions.variables ?? [];
  emailOptions.headers = emailOptions.headers ?? defaultHeaders;
  var transporterUser:EmailTransporter|null = emailOptions.transporter ?? null;
  var html:boolean = emailOptions.html ?? false;

  // Define the email options
  const mailOptions: SendMailOptions = {
    from: emailOptions.from,
    to: emailOptions.to,
    subject: emailOptions.subject
  };
  // Set HTML content if content type is HTML, otherwise set plain text body
  if (html) {
    if (!emailOptions.template) throw new Error('Missing "template" field');
    
    mailOptions.html = await renderEmailTemplate(emailOptions.template, emailOptions.variables);
  } else {
    if (!emailOptions.body) throw new Error('Missing "body" field');

    mailOptions.text = emailOptions.body;
  }

  var headers = emailOptions.headers;
  if (isString(emailOptions.replyTo)){
    mailOptions.replyTo = emailOptions.replyTo;
  }

  if (isSet(emailOptions,'cc')){
    mailOptions.cc = emailOptions.cc;
  }

  if (isSet(emailOptions,'bcc')){
    mailOptions.bcc = emailOptions.bcc;
  }
  // mailOptions.headers = headers;
 

  try {
    // Wrap the email sending in a promise with a timeout
    const sendMailPromise = new Promise((resolve, reject) => {
      var transporterModif = transporter;
      if(isNotNull(transporterUser)){
        const modifiedConfig = {
          ...emailConfig,
          host: transporterUser.host,
          port: transporterUser.port,
          auth: {
            user: transporterUser.user,
            pass: transporterUser.pass,
          },
        };
        transporterModif = nodemailer.createTransport(modifiedConfig);
      }

      transporterModif.sendMail(mailOptions, (error, info) => {
        if (error) {
          reject(error);
        } else {
          resolve(info);
        }
      });
    });

    // Wait for the email sending with the specified timeout
    const info = await Promise.race([sendMailPromise, delay(emailTimeout)]);

    // console.log(info);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

async function renderEmailTemplate(templateName: string, variables: object): Promise<string> {
  // Read and render the email template using ejs with the provided variables
  const templatePath = path.join(__dirname, `/../../templates/${templateName}.ejs`);
  try {
    const template = await ejs.renderFile(templatePath, variables);
    return template;
  } catch (error) {
    console.error('Error rendering email template:', error);
    throw error;
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default sendEmail;
