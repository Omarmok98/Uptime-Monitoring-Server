const nodemailer = require("nodemailer");

const host = process.env.MAIL_HOST;
const port = process.env.MAIL_PORT;
const auth = {
  user: process.env.MAIL_USERNAME,
  pass: process.env.MAIL_PASSWORD,
};

const transporter = nodemailer.createTransport({
  host,
  port,
  auth,
});

function sendSignupConfirmation(recipientEmail, verificationCode) {
  return transporter.sendMail({
    from: process.env.MAIL_USERNAME,
    to: [recipientEmail],
    subject: "Uptime Monitoring Mail Registration",
    html: `<h1>Email Confirmation</h1>
    <h2>Hello</h2>
    <p>Please confirm your email by using the follow verification code <b>${verificationCode}</b></p>
    </div>`,
  });
}

module.exports = {
  sendSignupConfirmation,
};
