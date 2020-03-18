const nodemailer = require('nodemailer');

// https://www.w3schools.com/nodejs/nodejs_email.asp

const sendEmail = async option => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  const mailOptions = {
    from: 'Harshal Abnave <Harshal16@protonmail>',
    to: option.email,
    subject: option.subject,
    text: option.message
  };

  // this fun returns a promise
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
