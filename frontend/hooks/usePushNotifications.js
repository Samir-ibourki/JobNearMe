import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import {
  registerForPushNotificationsAsync,
  addNotificationListeners,
} from "../utils/pushNotifications";
import { savePushToken } from "../api/notificationApi";
import { useQueryClient } from "@tanstack/react-query";

export function usePushNotifications() {
  const [expoPushToken, setExpoPushToken] = useState(null);
  const [notification, setNotification] = useState(null);
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      if (token) {
        setExpoPushToken(token);

        savePushToken(token).catch((err) => {
          console.log("Could not save push token to server:", err);
        });
      }
    });

    const cleanup = addNotificationListeners(
      (notification) => {
        setNotification(notification);

        queryClient.invalidateQueries({ queryKey: ["notifications"] });
        queryClient.invalidateQueries({ queryKey: ["unreadCount"] });
      },
      (response) => {
        const data = response.notification.request.content.data;

        if (data?.relatedId) {
          router.push("/notifications");
        }
      },
    );

    return cleanup;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    expoPushToken,
    notification,
  };
}
