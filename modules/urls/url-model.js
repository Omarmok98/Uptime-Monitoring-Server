const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  status: {
    type: Boolean,
    default: null,
  },
  requestCount: {
    type: Number,
    default: 0,
  },
  outages: {
    type: Number,
    default: 0,
  },
  downtime: {
    type: Number,
    default: 0,
  },
  uptime: {
    type: Number,
    default: 0,
  },
  totalResponseTime: {
    type: Number,
    default: 0,
  },
  history: {
    type: [Date],
    default: [],
  },
});

const alertSchema = new mongoose.Schema({
  type: String,
  config: Object,
});

const urlSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  user: {
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
  report: reportSchema,
  alerts: [alertSchema],
});

const Url = mongoose.model("Url", urlSchema);

module.exports = Url;
