import { Notification } from "../models/index.js";
import { asyncHandler, AppError } from "../middlewares/errorHandler.js";

export const getMyNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.findAll({
    where: {
      userId: req.user.id,
      userType: req.userType,
    },
    order: [["createdAt", "DESC"]],
  });
  res.status(200).json({
    success: true,
    count: notifications.length,
    data: notifications,
  });
});
export const getUnreadCount = asyncHandler(async (req, res) => {
  const count = await Notification.count({
    where: {
      userId: req.user.id,
      userType: req.userType,
      isRead: false,
    },
  });

  res.status(200).json({
    success: true,
    unreadCount: count,
  });
});

export const markAsRead = asyncHandler(async (req, res) => {
  const { notificationId } = req.params;
  const notification = await Notification.findByPk(notificationId);
  if (!notification) {
    throw new AppError("Notification not found", 404);
  }
  if (
    notification.userId !== req.user.id ||
    notification.userType !== req.userType
  ) {
    throw new AppError("Not authorized to update this notification", 403);
  }
  notification.isRead = true;
  await notification.save();
  res.status(200).json({
    success: true,
    message: "Notification marked as read",
    data: notification,
  });
});

export const markAllAsRead = asyncHandler(async (req, res) => {
  const [updatedCount] = await Notification.update(
    { isRead: true },
    {
      where: {
        userId: req.user.id,
        userType: req.userType,
        isRead: false,
      },
    },
  );
  res.status(200).json({
    success: true,
    message: `${updatedCount} notifications marked as read`,
  });
});

export const savePushToken = asyncHandler(async (req, res) => {
  const { pushToken } = req.body;

  if (!pushToken) {
    throw new AppError("Push token is required", 400);
  }

  // Update user's push token
  req.user.pushToken = pushToken;
  await req.user.save();

  res.status(200).json({
    success: true,
    message: "Push token saved successfully",
  });
});
