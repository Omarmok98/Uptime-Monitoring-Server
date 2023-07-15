const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserController = require("../../modules/users/user-controller");
const UserService = require("../../modules/users/user-service");

jest.mock("bcrypt");
jest.mock("jsonwebtoken");
jest.mock("../../config/mail");
jest.mock("../../modules/users/user-service");

describe("UserController", () => {
  describe("login", () => {
    it("should return an authenticated user with a token if the passwords match", async () => {
      const req = {
        body: {
          password: "password123",
        },
        dbUser: {
          email: "test@example.com",
          password: "$2a$10$somesecurehashedpassword",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      bcrypt.compare.mockResolvedValueOnce(true);
      jwt.sign.mockReturnValueOnce("testToken");

      await UserController.login(req, res);

      expect(bcrypt.compare).toHaveBeenCalledWith(
        req.body.password,
        req.dbUser.password
      );
      expect(jwt.sign).toHaveBeenCalledWith(
        {
          email: req.dbUser.email,
        },
        process.env.JWT_KEY,
        {
          expiresIn: 86400,
        }
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "User authentication successful",
        token: "testToken",
      });
    });

    it("should return an unauthorized error if the passwords don't match", async () => {
      const req = {
        body: {
          password: "wrongpassword",
        },
        dbUser: {
          email: "test@example.com",
          password: "$2a$10$somesecurehashedpassword",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      bcrypt.compare.mockResolvedValueOnce(false);

      await UserController.login(req, res);

      expect(bcrypt.compare).toHaveBeenCalledWith(
        req.body.password,
        req.dbUser.password
      );
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: "User authentication failed",
      });
    });
  });

  describe("signup", () => {
    it("should create a new user and send a signup confirmation email", async () => {
      const req = {
        body: {
          email: "test@example.com",
          password: "password123",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const mockedCreateUser = jest.spyOn(UserService, "createUser");
      const mockedSendSignupConfirmation = jest.spyOn(
        require("../../config/mail"),
        "sendSignupConfirmation"
      );
      mockedCreateUser.mockResolvedValueOnce(true);

      bcrypt.hash.mockResolvedValue("mockedHashedPassword");
      await UserController.signup(req, res);

      expect(mockedCreateUser).toHaveBeenCalledWith({
        email: req.body.email,
        hashedPassword: "mockedHashedPassword",
        verificationCode: expect.any(Number),
      });
      expect(mockedSendSignupConfirmation).toHaveBeenCalledWith(
        req.body.email,
        expect.any(Number)
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "User created succesfuly, Verification code is sent",
      });
    });

    it("should return an internal server error if user creation fails", async () => {
      const req = {
        body: {
          email: "test@example.com",
          password: "password123",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const mockedCreateUser = jest.spyOn(UserService, "createUser");
      mockedCreateUser.mockResolvedValueOnce(false);

      await UserController.signup(req, res);

      bcrypt.hash.mockResolvedValue("mockedHashedPassword");

      expect(mockedCreateUser).toHaveBeenCalledWith({
        email: req.body.email,
        hashedPassword: "mockedHashedPassword",
        verificationCode: expect.any(Number),
      });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "User could not be created. please try again",
      });
    });
  });

  describe("verifyEmail", () => {
    it("should return a success message if user verification is successful", async () => {
      const req = {
        body: {
          email: "test@example.com",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const mockedVerifyUser = jest.spyOn(UserService, "verifyUser");
      mockedVerifyUser.mockResolvedValueOnce(true);

      await UserController.verifyEmail(req, res);

      expect(mockedVerifyUser).toHaveBeenCalledWith(req.body.email);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Email verified",
      });
    });

    it("should return an internal server error if user verification fails", async () => {
      const req = {
        body: {
          email: "test@example.com",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const mockedVerifyUser = jest.spyOn(UserService, "verifyUser");
      mockedVerifyUser.mockResolvedValueOnce(false);

      await UserController.verifyEmail(req, res);

      expect(mockedVerifyUser).toHaveBeenCalledWith(req.body.email);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Could not verify email",
      });
    });
  });
});
