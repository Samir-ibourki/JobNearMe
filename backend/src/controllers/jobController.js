import { Job, User } from "../models/index.js";
import haversineDistance from "../utils/haversine.js";
import { AppError, asyncHandler } from "../middlewares/errorHandler.js";

export const getAllJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.findAll({
    include: [
      { model: User, as: "employer", attributes: ["fullname", "phone"] },
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
      { model: User, as: "employer", attributes: ["fullname", "phone"] },
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
      { model: User, as: "employer", attributes: ["fullname", "phone"] },
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
