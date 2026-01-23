import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import bcrypt from "bcryptjs";

// Fake User model
const mockUserModel = {
  findOne: jest.fn(),
  create: jest.fn(),
};

// Fake Employer model
const mockEmployerModel = {
  findOne: jest.fn(),
  create: jest.fn(),
};

// Fake email service
const mockSendEmail = jest.fn().mockResolvedValue(true);

// Mock dial modules
jest.unstable_mockModule("../models/User.js", () => ({
  default: mockUserModel,
}));

jest.unstable_mockModule("../models/Employer.js", () => ({
  default: mockEmployerModel,
}));

jest.unstable_mockModule("../utils/emailService.js", () => ({
  sendEmail: mockSendEmail,
}));

// Environment variables
process.env.JWT_SECRET = "test-secret";
process.env.JWT_EXPIRES_IN = "1h";

// Import controller
const { register, login, getProfile, updateProfile } =
  await import("../controllers/authController.js");

describe("Auth Controller", () => {
  let req;
  let res;
  let next;

  // Before each test, reset everything
  beforeEach(() => {
    jest.clearAllMocks();

    req = { body: {}, params: {}, user: null, userType: null };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
  });

  // Registeer
  describe("register()", () => {
    it("create new user", async () => {
      req.body = {
        role: "candidate",
        fullname: "Ahmed Test",
        email: "ahmed@test.com",
        password: "password123",
        phone: "0612345678",
      };

      // Email makaynch f database
      mockUserModel.findOne.mockResolvedValue(null);
      mockUserModel.create.mockResolvedValue({
        id: 1,
        fullname: "Ahmed Test",
        email: "ahmed@test.com",
      });

      await register(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true }),
      );
    });

    it("error input required", async () => {
      req.body = { email: "test@test.com" };
      await register(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ statusCode: 400 }),
      );
    });

    it("error email already exist", async () => {
      req.body = {
        fullname: "Test",
        email: "existing@test.com",
        password: "password123",
      };

      // Email kayn f database
      mockUserModel.findOne.mockResolvedValue({ id: 1 });

      await register(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ statusCode: 409 }),
      );
    });
  });

  // Login

  describe("login()", () => {
    it("login", async () => {
      const hashedPassword = await bcrypt.hash("password123", 10);

      req.body = {
        email: "ahmed@test.com",
        password: "password123",
      };

      mockUserModel.findOne.mockResolvedValue({
        id: 1,
        fullname: "Ahmed",
        email: "ahmed@test.com",
        password: hashedPassword,
      });

      await login(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true }),
      );
    });

    it("error email not found", async () => {
      req.body = {
        email: "notfound@test.com",
        password: "password123",
      };

      mockUserModel.findOne.mockResolvedValue(null);
      mockEmployerModel.findOne.mockResolvedValue(null);

      await login(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ statusCode: 401 }),
      );
    });

    it("Error password wrong", async () => {
      req.body = {
        email: "ahmed@test.com",
        password: "wrongpassword",
      };

      mockUserModel.findOne.mockResolvedValue({
        id: 1,
        email: "ahmed@test.com",
        password: await bcrypt.hash("correctpassword", 10),
      });

      await login(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ statusCode: 401 }),
      );
    });
  });

  // tests get profiles

  describe("getProfile()", () => {
    it("getProfile", async () => {
      req.user = {
        id: 1,
        fullname: "Ahmed",
        email: "ahmed@test.com",
        toJSON: function () {
          return { id: 1, fullname: "Ahmed" };
        },
      };
      req.userType = "user";

      await getProfile(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("Error", async () => {
      req.user = null;

      await getProfile(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  // tests update

  describe("updateProfile()", () => {
    it("Update", async () => {
      req.user = {
        id: 1,
        fullname: "Old Name",
        phone: "0600000000",
        save: jest.fn().mockResolvedValue(true),
        toJSON: function () {
          return { id: 1, fullname: this.fullname };
        },
      };

      req.body = {
        fullname: "New Name",
        phone: "0699999999",
      };

      await updateProfile(req, res, next);

      expect(req.user.fullname).toBe("New Name");
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("Error", async () => {
      req.user = null;
      req.body = { fullname: "Test" };

      await updateProfile(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ statusCode: 404 }),
      );
    });
  });
});
