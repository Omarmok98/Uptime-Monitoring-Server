const User = require("./user-model");
class UserService {
  static async createUser({ email, hashedPassword, verificationCode }) {
    const user = new User({
      email,
      password: hashedPassword,
      verificationCode,
    });
    const result = await user.save();
    return result;
  }
  static async getUser(email) {
    const user = await User.findOne({ email }).lean();
    return user;
  }
  static async verifyUser(email) {
    const result = await User.updateOne({ email }, { verified: true });
    return result;
  }
}

module.exports = UserService;
