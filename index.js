require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const errorHandler = require("./middlewares/errorHandler");
require("./config/mongoDb");

const app = express();
app.use(bodyParser.json());
app.use(errorHandler);

require("./routes/index")(app);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Uptime Monitoring Server is running on PORT: ${port}`);
});
