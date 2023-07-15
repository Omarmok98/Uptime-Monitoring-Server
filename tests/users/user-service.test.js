const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const User = require("../../modules/users/user-model");
const UserService = require("../../modules/users/user-service");

describe("UserService", () => {
  let mongoServer;
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = await mongoServer.getUri();
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  describe("createUser", () => {
    it("should create a new user", async () => {
      const mockedUser = {
        email: "test@example.com",
        hashedPassword: "hashedPassword",
        verificationCode: "123456",
      };

      const result = await UserService.createUser(mockedUser);

      expect(result).toHaveProperty("_id");
      expect(result).toHaveProperty("email", "test@example.com");
      expect(result).toHaveProperty("password", "hashedPassword");
      expect(result).toHaveProperty("verificationCode", "123456");
    });
  });

  describe("getUser", () => {
    it("should get a user by email", async () => {
      const mockedUser = {
        email: "test@example.com",
        password: "hashedPassword",
        verificationCode: "123456",
      };
      await User.create(mockedUser);

      const result = await UserService.getUser("test@example.com");

      expect(result).toHaveProperty("_id");
      expect(result).toHaveProperty("email", "test@example.com");
      expect(result).toHaveProperty("password", "hashedPassword");
      expect(result).toHaveProperty("verificationCode", "123456");
    });
  });

  describe("verifyUser", () => {
    it("should verify a user by email", async () => {
      const mockedUser = {
        email: "test@example.com",
        password: "hashedPassword",
        verificationCode: "123456",
        verified: false,
      };
      const createdUser = await User.create(mockedUser);

      const result = await UserService.verifyUser("test@example.com");

      expect(result).toHaveProperty("modifiedCount", 1);

      const updatedUser = await User.findById(createdUser._id);
      expect(updatedUser).toHaveProperty("verified", true);
    });
  });
});
