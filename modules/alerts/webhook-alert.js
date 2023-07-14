const { default: axios } = require("axios");

class WebhookAlert {
  constructor({ webhook }) {
    this.webhook = webhook;
  }
  async sendNotification(urlName) {
    console.log(this.webhook);
    console.log("SENDING WEBHOOK ALERT");
    await axios.get(this.webhook);
  }
}

module.exports = WebhookAlert;
