require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const MonitoringWorkersManager = require("./modules/url-monitoring/monitoring-worker-manager");
require("./config/mongoDb");

const app = express();
app.use(bodyParser.json());
const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Uptime monitoring server",
      version: "1.0.0",
      description:
        "Monitor URLs, and get detailed uptime reports about their availability, average response time, and total uptime/downtime.",
      contact: {
        name: "Omar Mokhtar",
        email: "omarmok98@gmail.com",
      },
    },
    servers: [
      {
        url: "http://localhost:5000",
      },
    ],
  },
  apis: [
    "./routes/index.js",
    "./modules/urls/url-route.js",
    "./modules/users/user-route.js",
  ],
};

const specs = swaggerJsdoc(options);
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, { explorer: true })
);

require("./routes/index")(app);

const manager = MonitoringWorkersManager.getInstance();
manager.initWorkers();
const port = 5000;
app.listen(port, () => {
  console.log(`Uptime Monitoring Server is running on PORT: ${port}`);
});
