const AlertFactory = require("../../modules/alerts/alert-factory");
const EmailAlert = require("../../modules/alerts/email-alert");
const PushoverAlert = require("../../modules/alerts/pushover-alert");
const WebhookAlert = require("../../modules/alerts/webhook-alert");

describe("AlertFactory", () => {
  test('createAlert should return an instance of EmailAlert when alertType is "email"', () => {
    const alertType = "email";
    const alertConfig = {
      email: "test@example.com",
    };

    const alert = AlertFactory.createAlert(alertType, alertConfig);

    expect(alert).toBeInstanceOf(EmailAlert);
  });

  test('createAlert should return an instance of WebhookAlert when alertType is "webhook"', () => {
    const alertType = "webhook";
    const alertConfig = {
      webhook: "example.com",
    };

    const alert = AlertFactory.createAlert(alertType, alertConfig);

    expect(alert).toBeInstanceOf(WebhookAlert);
  });

  test('createAlert should return an instance of PushoverAlert when alertType is "pushover"', () => {
    const alertType = "pushover";
    const alertConfig = {
      token: "test token",
      user: "user token",
    };

    const alert = AlertFactory.createAlert(alertType, alertConfig);

    expect(alert).toBeInstanceOf(PushoverAlert);
  });

  test("createAlert should throw an error when alertType is invalid", () => {
    const alertType = "invalid";
    const alertConfig = {
      test: "test",
    };

    expect(() => {
      AlertFactory.createAlert(alertType, alertConfig);
    }).toThrowError("Invalid alert type");
  });
});
