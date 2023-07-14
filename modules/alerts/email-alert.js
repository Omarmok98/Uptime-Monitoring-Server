const { sendAlert } = require("../../config/mail");
class EmailAlert {
  constructor({ email }) {
    this.email = email;
  }
  async sendNotification(url) {
    sendAlert(this.email, url.name);
  }
}

module.exports = EmailAlert;
