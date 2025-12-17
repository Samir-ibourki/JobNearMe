import express from "express";
import {
  getAllJobs,
  getJobById,
  getNearbyJobs,
} from "../controllers/jobController.js";

const router = express.Router();

router.get("/", getAllJobs);

router.get("/nearby", getNearbyJobs);

router.get("/:id", getJobById);

export default router;
