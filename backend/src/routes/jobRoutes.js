import express from "express";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import {
  getAllJobs,
  getJobById,
  getNearbyJobs,
  createJob,
  deleteJob,
} from "../controllers/jobController.js";

const router = express.Router();

router.get("/", getAllJobs);
router.post("/", authenticateToken, createJob);

router.get("/nearby", getNearbyJobs);

router.get("/:id", getJobById);
router.delete("/:id", authenticateToken, deleteJob);

export default router;
