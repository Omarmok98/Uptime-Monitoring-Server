const mongoose = require("mongoose");

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: false,
};
const mongoUsername = process.env.MONGO_USERNAME;
const mongoPassword = process.env.MONGO_PASS;
const mongoHost = process.env.MONGO_HOST;
const mongoPort = process.env.MONGO_PORT;

const mongoConnectionString = `mongodb://${mongoUsername}:${mongoPassword}@${mongoHost}:${mongoPort}/uptime_monitoring_server?authSource=admin`;
mongoose
  .connect(mongoConnectionString, options)
  .then(() => {
    console.log("MongoDB Connection ok!");
  })
  .catch((e) => {
    console.log(e);
    console.log("MongoDB Connection Failed!");
  });
