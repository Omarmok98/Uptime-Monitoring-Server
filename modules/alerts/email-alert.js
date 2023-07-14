const { sendAlert } = require("../../config/mail");
class EmailAlert {
  constructor({ email }) {
    this.email = email;
  }
  async sendNotification(urlName) {
    console.log("SENDING EMAIL ALERT");
    sendAlert(this.email, urlName);
  }
}

module.exports = EmailAlert;
