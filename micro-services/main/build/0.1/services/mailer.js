const nodemailer = require('nodemailer');
const ejs = require('ejs');
const { emailConfig } = require('../config/config.json');
const https = require('https');

const agent = new https.Agent({
  rejectUnauthorized: false, // Bypass hostname verification (Not recommended for production)
});

emailConfig.tls = {
  ...emailConfig.tls,
  agent
}

const emailTimeout = 15000; // 15 seconds timeout for email sending

// Create a transporter with the security options
const transporter = nodemailer.createTransport(emailConfig);

async function sendEmail(from, to, subject, template, variables) {
  const mailOptions = {
    from: from,
    to: to,
    subject: subject,
    html: await renderEmailTemplate(template, variables), // Use the rendered HTML template with variables
  };
 
  try {
    // Wrap the email sending in a promise with a timeout
    const sendMailPromise = new Promise((resolve, reject) => {
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

    console.log(info);
    return info;
  } catch (error) {
    throw error;
  }
}

async function renderEmailTemplate(templateName, variables) {
  // Read and render the email template using ejs with the provided variables
  const template = await ejs.renderFile(__dirname + `/../../templates/${templateName}.ejs`, variables);
  return template;
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = sendEmail;
