import { Expo } from "expo-server-sdk";

// Create Expo SDK instance
const expo = new Expo();

/**
 * Send push notification to a user
 * @param {string} pushToken - Expo push token
 * @param {string} title - Notification title
 * @param {string} body - Notification message
 * @param {object} data - Additional data to send
 */
export async function sendPushNotification(pushToken, title, body, data = {}) {
  // Check if the token is valid
  if (!Expo.isExpoPushToken(pushToken)) {
    console.log(`Push token ${pushToken} is not a valid Expo push token`);
    return null;
  }

  // Create the message
  const message = {
    to: pushToken,
    sound: "default",
    title,
    body,
    data,
  };

  try {
    // Send the notification
    const chunks = expo.chunkPushNotifications([message]);
    const tickets = [];

    for (const chunk of chunks) {
      const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      tickets.push(...ticketChunk);
    }

    console.log("Push notification sent:", tickets);
    return tickets;
  } catch (error) {
    console.error("Error sending push notification:", error);
    return null;
  }
}

/**
 * Send push notifications to multiple users
 * @param {Array} notifications - Array of {pushToken, title, body, data}
 */
export async function sendBatchPushNotifications(notifications) {
  const messages = notifications
    .filter((n) => Expo.isExpoPushToken(n.pushToken))
    .map((n) => ({
      to: n.pushToken,
      sound: "default",
      title: n.title,
      body: n.body,
      data: n.data || {},
    }));

  if (messages.length === 0) {
    console.log("No valid push tokens to send to");
    return [];
  }

  try {
    const chunks = expo.chunkPushNotifications(messages);
    const tickets = [];

    for (const chunk of chunks) {
      const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      tickets.push(...ticketChunk);
    }

    console.log(`Sent ${tickets.length} push notifications`);
    return tickets;
  } catch (error) {
    console.error("Error sending batch push notifications:", error);
    return [];
  }
}
