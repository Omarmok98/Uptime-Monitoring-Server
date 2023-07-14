const EmailAlert = require("./email-alert");
const WebhookAlert = require("./webhook-alert");

class AlertFactory {
  static createAlert(alertType, alertConfig) {
    switch (alertType) {
      case "email":
        return new EmailAlert(alertConfig);
      case "webhook":
        return new WebhookAlert(alertConfig);
      default:
        throw new Error("Invalid alert type");
    }
  }
}

module.exports = AlertFactory;
