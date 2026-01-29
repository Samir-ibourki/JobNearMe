import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../theme/colors";

const NotificationItem = ({ notification, onPress, onMarkAsRead }) => {
  const getTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "new_application":
        return { name: "document-text", color: Colors.Primary, bg: "#E8F2FF" };
      case "application_accepted":
        return { name: "checkmark-circle", color: "#10B981", bg: "#D1FAE5" };
      case "application_rejected":
        return { name: "close-circle", color: "#EF4444", bg: "#FEE2E2" };
      default:
        return { name: "notifications", color: Colors.Primary, bg: "#E8F2FF" };
    }
  };

  const iconConfig = getNotificationIcon(notification.type);

  return (
    <TouchableOpacity
      style={[styles.container, !notification.isRead && styles.unreadContainer]}
      onPress={() => onPress && onPress(notification)}
      activeOpacity={0.7}
    >
      {/* Unread indicator */}
      {!notification.isRead && <View style={styles.unreadDot} />}

      {/* Icon */}
      <View style={[styles.iconContainer, { backgroundColor: iconConfig.bg }]}>
        <Ionicons name={iconConfig.name} size={24} color={iconConfig.color} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>
            {notification.title}
          </Text>
          <Text style={styles.time}>{getTimeAgo(notification.createdAt)}</Text>
        </View>
        <Text style={styles.message} numberOfLines={2}>
          {notification.message}
        </Text>
      </View>

      {/* Mark as read button */}
      {!notification.isRead && (
        <TouchableOpacity
          style={styles.markReadBtn}
          onPress={() => onMarkAsRead && onMarkAsRead(notification.id)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="checkmark" size={18} color={Colors.Primary} />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  unreadContainer: {
    backgroundColor: "#F8FBFF",
    borderLeftWidth: 3,
    borderLeftColor: Colors.Primary,
  },
  unreadDot: {
    position: "absolute",
    top: 16,
    left: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.Primary,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1A1A1A",
    flex: 1,
    marginRight: 10,
  },
  time: {
    fontSize: 12,
    color: "#999",
  },
  message: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
  },
  markReadBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E8F2FF",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
});

export default NotificationItem;
