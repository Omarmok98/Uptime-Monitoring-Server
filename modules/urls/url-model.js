const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  protocol: {
    type: String,
    enum: ["HTTP", "HTTPS", "TCP"],
    required: true,
  },
  path: String,
  port: Number,
  webhook: String,
  timeout: Number,
  interval: Number,
  threshold: Number,
  username: String,
  password: String,
  httpHeaders: Object,
  statusCode: Number,
  tags: [String],
  ignoreSSL: {
    type: Boolean,
    required: true,
  },
});

const Url = mongoose.model("Url", urlSchema);

module.exports = Url;
