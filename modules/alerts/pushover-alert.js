const Pushover = require("node-pushover");

class PushoverAlert {
  constructor({ token, user }) {
    this.pushoverInstance = new Pushover({
      token,
      user,
    });
  }
  async sendNotification(urlName) {
    console.log("SENDING PUSHOVER ALERT");
    this.pushoverInstance.send(`${urlName} is down`);
  }
}

module.exports = PushoverAlert;
