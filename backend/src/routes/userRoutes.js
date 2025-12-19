import express from "express";
import { updateLocation } from "../controllers/userController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";
const router = express.Router();
router.use(authenticateToken);
router.patch("/location", updateLocation);

export default router;
