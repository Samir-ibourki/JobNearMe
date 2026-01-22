/**
 * Job Controller Tests - Simplified
 */

import { jest, describe, it, expect, beforeAll, beforeEach } from "@jest/globals";

let mockJob, mockApplication, getAllJobs, getJobById, createJob, deleteJob, getEmployerJobs;

beforeAll(async () => {
  // Mock Job
  mockJob = {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    count: jest.fn(),
  };

  // Mock Application  
  mockApplication = {
    count: jest.fn(),
    findAll: jest.fn(),
  };

  jest.unstable_mockModule("../models/index.js", () => ({
    Job: mockJob,
    Application: mockApplication,
  }));

  jest.unstable_mockModule("../models/Employer.js", () => ({
    default: {},
  }));

  jest.unstable_mockModule("../services/geocodingService.js", () => ({
    geocodeAddress: jest.fn(() => ({ latitude: 33.5, longitude: -7.6 })),
  }));

  jest.unstable_mockModule("../utils/haversine.js", () => ({
    default: jest.fn(() => 5),
  }));

  jest.unstable_mockModule("../middlewares/errorHandler.js", () => ({
    AppError: class extends Error {
      constructor(msg, code) { super(msg); this.statusCode = code; }
    },
    asyncHandler: (fn) => fn,
  }));

  const controller = await import("../controllers/jobController.js");
  getAllJobs = controller.getAllJobs;
  getJobById = controller.getJobById;
  createJob = controller.createJob;
  deleteJob = controller.deleteJob;
  getEmployerJobs = controller.getEmployerJobs;
});

const mockRequest = (body = {}, params = {}, query = {}, user = null, userType = null) => ({
  body, params, query, user, userType,
});

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("Job Controller", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("getAllJobs()", () => {
    it("should return all jobs", async () => {
      mockJob.findAll.mockResolvedValue([{ id: 1 }, { id: 2 }]);
      const req = mockRequest();
      const res = mockResponse();

      await getAllJobs(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true, count: 2 })
      );
    });
  });

  describe("getJobById()", () => {
    it("should return job", async () => {
      mockJob.findByPk.mockResolvedValue({ id: 1, title: "Job" });
      const req = mockRequest({}, { id: 1 });
      const res = mockResponse();

      await getJobById(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true })
      );
    });

    it("should throw if not found", async () => {
      mockJob.findByPk.mockResolvedValue(null);
      const req = mockRequest({}, { id: 999 });
      const res = mockResponse();

      await expect(getJobById(req, res)).rejects.toThrow();
    });
  });

  describe("createJob()", () => {
    it("should create job for employer", async () => {
      const req = mockRequest(
        { title: "Job", description: "Desc", city: "Casa", latitude: 33, longitude: -7 },
        {}, {}, { id: 1 }, "employer"
      );
      const res = mockResponse();
      mockJob.create.mockResolvedValue({ id: 1, title: "Job" });

      await createJob(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
    });

    it("should throw if not employer", async () => {
      const req = mockRequest({ title: "J" }, {}, {}, { id: 1 }, "user");
      const res = mockResponse();

      await expect(createJob(req, res)).rejects.toThrow();
    });
  });

  describe("deleteJob()", () => {
    it("should delete job", async () => {
      mockJob.findByPk.mockResolvedValue({
        id: 1, employerId: 1, destroy: jest.fn(),
      });
      const req = mockRequest({}, { id: 1 }, {}, { id: 1 }, "employer");
      const res = mockResponse();

      await deleteJob(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true })
      );
    });

    it("should throw if not owner", async () => {
      mockJob.findByPk.mockResolvedValue({ id: 1, employerId: 2 });
      const req = mockRequest({}, { id: 1 }, {}, { id: 1 }, "employer");
      const res = mockResponse();

      await expect(deleteJob(req, res)).rejects.toThrow();
    });
  });

  describe("getEmployerJobs()", () => {
    it("should return employer jobs", async () => {
      mockJob.findAll.mockResolvedValue([{ id: 1 }]);
      const req = mockRequest({}, {}, {}, { id: 1 }, "employer");
      const res = mockResponse();

      await getEmployerJobs(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true })
      );
    });

    it("should throw if not employer", async () => {
      const req = mockRequest({}, {}, {}, { id: 1 }, "user");
      const res = mockResponse();

      await expect(getEmployerJobs(req, res)).rejects.toThrow();
    });
  });
});
