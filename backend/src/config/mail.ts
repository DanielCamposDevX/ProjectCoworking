import { createTransport } from 'nodemailer';

export const transporter = createTransport({
   host: 'smtp.gmail.com',
   port: 465,
   secure: true,
   auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
   },
});
