const EventEmitter = require("events");

const alertEventEmitter = new EventEmitter();

alertEventEmitter.on("notification", (urlName, alerts) => {
  alerts.sendNotification(urlName);
});

module.exports = alertEventEmitter;
