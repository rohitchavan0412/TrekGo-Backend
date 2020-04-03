const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

module.exports = class Email {
  constructor(user, url) {
    this.email = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = 'Harshal Abnave <Harshal16@protonmail>';
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      return nodemailer.createTransport({
        host: 'smtp-relay.sendinblue.com',
        port: 587,
        auth: {
          user: 'abnaveharshal@gmail.com',
          pass: '7kg5N8W3LHmTaQCF'
        }
      });
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  async send(template, subject) {
    //send the actual email 
    //render the template
    const html = pug.renderFile(`${__dirname}/../views/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject
    })

    //mail option
    const mailOptions = {
      from: this.from,
      to: this.email,
      subject,
      html,
      text: htmlToText.fromString(html)
    };


    await this.newTransport().sendMail(mailOptions);

  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to TrkGo')
  }

  async sendPasswordReset() {
    await this.send('passwordreset', 'Password reset token valid for 10 min')
  }
}
// https://www.w3schools.com/nodejs/nodejs_email.asp
