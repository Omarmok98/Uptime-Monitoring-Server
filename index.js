require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const MonitoringWorkersManager = require("./modules/url-monitoring/monitoring-worker-manager");
require("./config/mongoDb");

const app = express();
app.use(bodyParser.json());

require("./routes/index")(app);

const manager = MonitoringWorkersManager.getInstance();
manager.initWorkers();
const port = 5000;
app.listen(port, () => {
  console.log(`Uptime Monitoring Server is running on PORT: ${port}`);
});
