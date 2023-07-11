const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  verified: {
    type: Boolean,
    default: false,
    required: true,
  },
  verificationCode: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
