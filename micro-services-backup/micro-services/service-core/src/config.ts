import https from 'https';

const agent = new https.Agent({
    rejectUnauthorized: false, // Bypass hostname verification (Not recommended for production)
  });

export const emailConfig = {
    host: process.env.EMAIL_HOST || 'kbtn.org',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER || 'no-reply@kbtn.org',
      pass: process.env.EMAIL_PASS || 'ioGpWNvZaCxgepBQ5Z',
    },
    tls: {
        rejectUnauthorized: false, // Reject unauthorized TLS connections
        agent,
      },
  };

