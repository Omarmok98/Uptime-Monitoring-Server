const { default: axios } = require("axios");

class WebhookAlert {
  constructor(webhook) {
    this.webhook = webhook;
  }
  async sendNotification() {
    await axios.get(this.webhook);
  }
}

module.exports = WebhookAlert;
