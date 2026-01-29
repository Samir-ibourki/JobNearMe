import express from "express";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import {
  getMyNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  savePushToken,
} from "../controllers/notificationController.js";

const router = express.Router();

router.use(authenticateToken);

router.get("/", getMyNotifications);
router.get("/unread-count", getUnreadCount);
router.put("/:notificationId/read", markAsRead);
router.put("/read-all", markAllAsRead);
router.post("/push-token", savePushToken);

export default router;
