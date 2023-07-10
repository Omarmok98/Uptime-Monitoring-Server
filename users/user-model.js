const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  verified: {
    type: Boolean,
    default: false,
  },
  verificationCode: String,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
