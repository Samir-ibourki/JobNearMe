import API from "./axios.js";

export const getMyNotifications = () =>
  API.get("/notifications").then((res) => res.data.data);
export const getUnreadCount = () =>
  API.get("/notifications/unread-count").then((res) => res.data.unreadCount);

export const markAsRead = (notificationId) =>
  API.put(`/notifications/${notificationId}/read`).then((res) => res.data);

export const markAllAsRead = () =>
  API.put("/notifications/read-all").then((res) => res.data);

export const savePushToken = (pushToken) =>
  API.post("/notifications/push-token", { pushToken }).then((res) => res.data);
