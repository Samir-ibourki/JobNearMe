import { Application, Job } from "../models/index.js";
import haversineDistance from "../utils/haversine.js";
import { AppError, asyncHandler } from "../middlewares/errorHandler.js";
import Employer from "../models/Employer.js";
import { geocodeAddress } from "../services/geocodingService.js";

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
        job.longitude,
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

export const createJob = asyncHandler(async (req, res) => {
  if (req.userType !== "employer") {
    throw new AppError("Only employers can create jobs", 403);
  }

  const { title, description, salary, category, city, address } = req.body;

  let { latitude, longitude } = req.body;

  if (!title || !description || !city) {
    throw new AppError("Title, description and city are required", 400);
  }

  // autoGeocode if coordinates are missing but address is provided
  if (address && (!latitude || !longitude)) {
    const coords = await geocodeAddress(`${address}, ${city}`);
    if (coords) {
      latitude = coords.latitude;
      longitude = coords.longitude;
    }
  }

  if (!latitude || !longitude) {
    throw new AppError(
      "Could not determine location coordinates. Please provide a more specific address.",
      400,
    );
  }

  const job = await Job.create({
    employerId: req.user.id,
    title,
    description,
    salary,
    category,
    city,
    address,
    latitude,
    longitude,
  });

  res.status(201).json({
    success: true,
    data: job,
  });
});

export const getEmployerJobs = asyncHandler(async (req, res) => {
  if (req.userType !== "employer") {
    throw new AppError("Access denied", 403);
  }

  const jobs = await Job.findAll({
    where: { employerId: req.user.id },
    order: [["createdAt", "DESC"]],
  });

  res.json({
    success: true,
    count: jobs.length,
    data: jobs,
  });
});

export const deleteJob = asyncHandler(async (req, res) => {
  if (req.userType !== "employer") {
    throw new AppError("Only employers can delete jobs", 403);
  }

  const job = await Job.findByPk(req.params.id);

  if (!job) {
    throw new AppError("Job not found", 404);
  }

  // Ensure the employer owns the job
  if (job.employerId !== req.user.id) {
    throw new AppError("You execute this action only on your own jobs", 403);
  }

  await job.destroy();

  res.json({
    success: true,
    message: "Job deleted successfully",
  });
});

export const getEmployerStats = asyncHandler(async (req, res) => {
  if (req.userType !== "employer") {
    throw new AppError("Access denied", 403);
  }

  const employerId = req.user.id;

  const activeJobsCount = await Job.count({
    where: { employerId },
  });

  // fetch employer is jobs IDs to count appliction
  const employerJobs = await Job.findAll({
    where: { employerId },
    attributes: ["id"],
  });

  const jobIds = employerJobs.map((job) => job.id);

  const totalApplicationsCount = await Application.count({
    where: { jobId: jobIds },
  });

  const newApplicationsCount = await Application.count({
    where: {
      jobId: jobIds,
      status: "pending",
    },
  });

  // fetch recent jobs with application counts
  const recentJobs = await Job.findAll({
    where: { employerId },
    order: [["createdAt", "DESC"]],

    include: [
      {
        model: Application,
        as: "applications",
        attributes: ["id"],
      },
    ],
  });

  const formattedRecentJobs = recentJobs.map((job) => ({
    id: job.id,
    title: job.title,
    category: job.category,
    applications: job.applications.length,
    postedAt: job.createdAt,
    status: "active",
  }));

  res.json({
    success: true,
    data: {
      stats: {
        activeJobs: activeJobsCount,
        totalApplications: totalApplicationsCount,
        newApplications: newApplicationsCount,
        viewsThisWeek: 0,
      },
      recentJobs: formattedRecentJobs,
    },
  });
});
export const updateJob = asyncHandler(async (req, res) => {
  if (req.userType !== "employer") {
    throw new AppError("Only employers can update jobs", 403);
  }

  const { title, description, salary, category, city, address } = req.body;

  let { latitude, longitude } = req.body;

  if (!title || !description || !city) {
    throw new AppError("Title, description and city are required", 400);
  }

  const job = await Job.findByPk(req.params.id);

  if (!job) {
    throw new AppError("Job not found", 404);
  }

  // ensure the employer owns the job
  if (job.employerId !== req.user.id) {
    throw new AppError("You can only update your own jobs", 403);
  }

  // Re-geocode if address or city has changed
  const addressChanged = address && address !== job.address;
  const cityChanged = city && city !== job.city;
  
  if (address && (addressChanged || cityChanged)) {
    const coords = await geocodeAddress(`${address}, ${city}`);
    if (coords) {
      latitude = coords.latitude;
      longitude = coords.longitude;
    }
  }

  await job.update({
    title,
    description,
    salary,
    category,
    city,
    address,
    latitude: latitude || job.latitude,
    longitude: longitude || job.longitude,
  });

  // Reload job to get fresh data
  await job.reload();

  res.json({
    success: true,
    data: job,
  });
});
