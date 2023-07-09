require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
require("./config/mongoDb");

const app = express();
app.use(bodyParser.json());

require("./routes/index")(app);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Uptime Monitoring Server is running on PORT: ${port}`);
});
