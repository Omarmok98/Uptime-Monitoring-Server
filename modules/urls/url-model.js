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
  timeout: {
    type: Number,
    default: 5, // Default timeout value in seconds
  },
  interval: {
    type: Number,
    default: 10, // Default interval value in minutes
  },
  threshold: {
    type: Number,
    default: 1, // Default threshold value
  },
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
