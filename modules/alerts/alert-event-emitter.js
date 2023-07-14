const EventEmitter = require("events");

const alertEventEmitter = new EventEmitter();

alertEventEmitter.on("notification", (urlName, alerts) => {
  console.log(urlName);
  for (const alert of alerts) {
    alert.sendNotification(urlName);
  }
});

module.exports = alertEventEmitter;
