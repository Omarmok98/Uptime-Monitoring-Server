const { sendAlert } = require("../../config/mail");
class EmailAlert {
  constructor({ email }) {
    this.email = email;
  }
  async sendNotification(url) {
    console.log("SENDING EMAIL ALERT");
    sendAlert(this.email, url.name);
  }
}

module.exports = EmailAlert;
