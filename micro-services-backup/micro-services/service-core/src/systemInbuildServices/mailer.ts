
import nodemailer from 'nodemailer';
import ejs from 'ejs';
import { emailConfig } from '../config';

const emailTimeout = 15000; // 15 seconds timeout for email sending

// Create a transporter with the security options
const transporter = nodemailer.createTransport(emailConfig);

export async function sendEmail(
  from: string,
  to: string,
  subject: string,
  template: string,
  variables: Record<string, any>
) {
  const mailOptions = {
    from: from,
    to: to,
    subject: subject,
    html: await renderEmailTemplate(template, variables), // Use the rendered HTML template with variables
  };

  try {
    // Wrap the email sending in a promise with a timeout
    const sendMailPromise = new Promise<nodemailer.SentMessageInfo>((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          reject(error);
        } else {
          resolve(info);
        }
      });
    });

    // Wait for the email sending with the specified timeout
    const info = await Promise.race([sendMailPromise, delay(emailTimeout)]);

    return info;
  } catch (error) {
    throw error;
  }
}

async function renderEmailTemplate(templateName: string, variables: Record<string, any>) {
  // Read and render the email template using ejs with the provided variables
  const template = await ejs.renderFile(__dirname + `/../templates/${templateName}.ejs`, variables);
  return template;
}

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}