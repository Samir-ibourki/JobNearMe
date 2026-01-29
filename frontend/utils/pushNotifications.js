import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function registerForPushNotificationsAsync() {
  let token;

  if (!Device.isDevice) {
    console.log("Push notifications need a physical device");
    return null;
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "Default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#0066FF",
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.log("Failed to get push token: permission denied");
    return null;
  }

  try {
    const projectId = Constants.expoConfig?.extra?.eas?.projectId;
    token = (
      await Notifications.getExpoPushTokenAsync({
        projectId: projectId,
      })
    ).data;
    console.log("Push token:", token);
  } catch (error) {
    console.log("Error getting push token:", error);
    return null;
  }

  return token;
}

export async function scheduleLocalNotification(title, body, data = {}) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data,
      sound: true,
    },
    trigger: null,
  });
}

export function addNotificationListeners(
  onNotificationReceived,
  onNotificationResponse,
) {
  const notificationListener = Notifications.addNotificationReceivedListener(
    (notification) => {
      console.log("Notification received:", notification);
      if (onNotificationReceived) {
        onNotificationReceived(notification);
      }
    },
  );

  const responseListener =
    Notifications.addNotificationResponseReceivedListener((response) => {
      console.log("Notification tapped:", response);
      if (onNotificationResponse) {
        onNotificationResponse(response);
      }
    });

  // Return cleanup function - use .remove() method (new API)
  return () => {
    notificationListener.remove();
    responseListener.remove();
  };
}
