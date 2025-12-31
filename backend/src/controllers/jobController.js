import { Job } from "../models/index.js";
import haversineDistance from "../utils/haversine.js";
import { AppError, asyncHandler } from "../middlewares/errorHandler.js";
import Employer from "../models/Employer.js";

export const createJob = asyncHandler(async (req, res) => {
  //only employers can create job
  if (req.userType !== "employer") {
    throw new AppError("Only employers can create jobs", 403);
  }

  const {
    title,
    description,
    salary,
    type,
    location,
    latitude,
    longitude,
    requirements,
  } = req.body;

  if (!title || !description || !location) {
    throw new AppError("Title, description and location are required", 400);
  }

  const job = await Job.create({
    employerId: req.user.id,
    title,
    description,
    salary,
    type,
    location,
    latitude,
    longitude,
    requirements,
  });

  res.status(201).json({
    success: true,
    data: job,
  });
});

export const deleteJob = asyncHandler(async (req, res) => {
  //only employers can delete jobs
  if (req.userType !== "employer") {
    throw new AppError("Only employers can delete jobs", 403);
  }

  const job = await Job.findByPk(req.params.id);

  if (!job) {
    throw new AppError("Job not found", 404);
  }

  //ensure the employer owns the job
  if (job.employerId !== req.user.id) {
    throw new AppError("You execute this action only on your own jobs", 403);
  }

  await job.destroy();

  res.json({
    success: true,
    message: "Job deleted successfully",
  });
});

export const getAllJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.findAll({
    include: [
      { model: Employer, as: "employer", attributes: ["fullname", "phone"] },
    ],
    order: [["createdAt", "DESC"]],
  });

  res.json({
    success: true,
    count: jobs.length,
    data: jobs,
  });
});

export const getJobById = asyncHandler(async (req, res) => {
  const job = await Job.findByPk(req.params.id, {
    include: [
      { model: Employer, as: "employer", attributes: ["fullname", "phone"] },
    ],
  });

  if (!job) throw new AppError("Offre non trouvée", 404);

  res.json({
    success: true,
    data: job,
  });
});

export const getNearbyJobs = asyncHandler(async (req, res) => {
  const { lat, lng, radius = 20 } = req.query;

  if (!lat || !lng) {
    throw new AppError("Latitude et longitude sont requises", 400);
  }

  const latitude = parseFloat(lat);
  const longitude = parseFloat(lng);
  const maxRadius = parseFloat(radius);

  const jobs = await Job.findAll({
    include: [
      { model: Employer, as: "employer", attributes: ["fullname", "phone"] },
    ],
  });

  const nearbyJobs = jobs
    .map((job) => {
      const distance = haversineDistance(
        latitude,
        longitude,
        job.latitude,
        job.longitude
      );
      if (distance <= maxRadius) {
        return { ...job.toJSON(), distance: Math.round(distance) };
      }
      return null;
    })
    .filter(Boolean)
    .sort((a, b) => a.distance - b.distance);

  res.json({
    success: true,
    count: nearbyJobs.length,
    searchRadius: maxRadius,
    data: nearbyJobs,
  });
});
