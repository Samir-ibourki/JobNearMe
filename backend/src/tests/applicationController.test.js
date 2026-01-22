/**
 * Application Controller Tests - Simplified
 */

import { jest, describe, it, expect, beforeAll, beforeEach } from "@jest/globals";

let mockApplication, mockJob, applyToJob, getMyApplications, getJobApplications, updateApplicationStatus;

beforeAll(async () => {
  mockApplication = {
    create: jest.fn(),
    findOne: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
  };

  mockJob = {
    findByPk: jest.fn(),
  };

  jest.unstable_mockModule("../models/index.js", () => ({
    Application: mockApplication,
    Job: mockJob,
    User: {},
  }));

  jest.unstable_mockModule("../models/Employer.js", () => ({
    default: {},
  }));

  jest.unstable_mockModule("../middlewares/errorHandler.js", () => ({
    AppError: class extends Error {
      constructor(msg, code) { super(msg); this.statusCode = code; }
    },
    asyncHandler: (fn) => fn,
  }));

  const controller = await import("../controllers/applicationController.js");
  applyToJob = controller.applyToJob;
  getMyApplications = controller.getMyApplications;
  getJobApplications = controller.getJobApplications;
  updateApplicationStatus = controller.updateApplicationStatus;
});

const mockRequest = (body = {}, params = {}, user = null, userType = null) => ({
  body, params, user, userType,
});

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("Application Controller", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("applyToJob()", () => {
    it("should apply successfully", async () => {
      const req = mockRequest({ jobId: 1, coverLetter: "Hi" }, {}, { id: 1 }, "user");
      const res = mockResponse();

      mockJob.findByPk.mockResolvedValue({ id: 1 });
      mockApplication.findOne.mockResolvedValue(null);
      mockApplication.create.mockResolvedValue({ id: 1, status: "pending" });

      await applyToJob(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
    });

    it("should throw if not candidate", async () => {
      const req = mockRequest({ jobId: 1 }, {}, { id: 1 }, "employer");
      const res = mockResponse();

      await expect(applyToJob(req, res)).rejects.toThrow();
    });

    it("should throw if already applied", async () => {
      const req = mockRequest({ jobId: 1 }, {}, { id: 1 }, "user");
      const res = mockResponse();

      mockJob.findByPk.mockResolvedValue({ id: 1 });
      mockApplication.findOne.mockResolvedValue({ id: 1 });

      await expect(applyToJob(req, res)).rejects.toThrow();
    });
  });

  describe("getMyApplications()", () => {
    it("should return applications", async () => {
      mockApplication.findAll.mockResolvedValue([{ id: 1 }, { id: 2 }]);
      const req = mockRequest({}, {}, { id: 1 }, "user");
      const res = mockResponse();

      await getMyApplications(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true, count: 2 })
      );
    });
  });

  describe("getJobApplications()", () => {
    it("should return job applications for employer", async () => {
      mockJob.findByPk.mockResolvedValue({ id: 1, employerId: 1 });
      mockApplication.findAll.mockResolvedValue([{ id: 1 }]);
      const req = mockRequest({}, { jobId: 1 }, { id: 1 }, "employer");
      const res = mockResponse();

      await getJobApplications(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true })
      );
    });

    it("should throw if not employer", async () => {
      const req = mockRequest({}, { jobId: 1 }, { id: 1 }, "user");
      const res = mockResponse();

      await expect(getJobApplications(req, res)).rejects.toThrow();
    });

    it("should throw if not job owner", async () => {
      mockJob.findByPk.mockResolvedValue({ id: 1, employerId: 2 });
      const req = mockRequest({}, { jobId: 1 }, { id: 1 }, "employer");
      const res = mockResponse();

      await expect(getJobApplications(req, res)).rejects.toThrow();
    });
  });

  describe("updateApplicationStatus()", () => {
    it("should update status", async () => {
      mockApplication.findByPk.mockResolvedValue({
        id: 1, status: "pending", job: { employerId: 1 },
        save: jest.fn(),
      });
      const req = mockRequest({ status: "accepted" }, { applicationId: 1 }, { id: 1 }, "employer");
      const res = mockResponse();

      await updateApplicationStatus(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true })
      );
    });

    it("should throw for invalid status", async () => {
      const req = mockRequest({ status: "invalid" }, { applicationId: 1 }, { id: 1 }, "employer");
      const res = mockResponse();

      await expect(updateApplicationStatus(req, res)).rejects.toThrow();
    });

    it("should throw if not employer", async () => {
      const req = mockRequest({ status: "accepted" }, { applicationId: 1 }, { id: 1 }, "user");
      const res = mockResponse();

      await expect(updateApplicationStatus(req, res)).rejects.toThrow();
    });
  });
});
