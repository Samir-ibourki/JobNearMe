import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "../../theme/colors";
import { useEmployerDashboardData } from "../../hooks/useEmployer";
import StatCard from "../../components/StatCard";
import QuickActionCard from "../../components/QuickActionCard";
import EmployerJobCard from "../../components/EmployerJobCard";
import NotificationBadge from "../../components/NotificationBadge";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAlert } from "../../hooks/useAlert";

export default function EmployerDashboard() {
  const { user, stats, recentJobs, isLoading } = useEmployerDashboardData();
  const { showConfirm } = useAlert();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={Colors.Primary} />
      </View>
    );
  }

  const userAvatar = user.fullname
    ? user.fullname
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2)
    : "EM";

  const handleLogout = async () => {
    const confirmed = await showConfirm(
      "Switch Account",
      "You will be logged out to switch account.",
      { confirmText: "Continue", cancelText: "Cancel" }
    );
    if (confirmed) {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");
      router.replace("/(auth)/logIn");
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <StatusBar barStyle="default" backgroundColor={Colors.Primary} />

      {/* Header with Gradient */}
      <LinearGradient
        colors={[Colors.Primary, Colors.Secondary]}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.avatarContainer}>
              <LinearGradient
                colors={["#FF6B9D", "#C06C84"]}
                style={styles.avatar}
              >
                <Text style={styles.avatarText}>{userAvatar}</Text>
              </LinearGradient>
              <View style={styles.onlineDot} />
            </View>
            <View>
              <Text style={styles.greeting}>Welcome back 👋</Text>
              <Text style={styles.userName}>{user.fullname}</Text>
              <View style={styles.premiumBadge}>
                <Ionicons name="star" size={12} color="#FFD700" />
                <Text style={styles.premiumText}>
                  {user.role || "Employer"}
                </Text>
              </View>
            </View>
          </View>

          {/* Notification Icon */}
          <NotificationBadge size={22} color="#FFF" style={styles.notificationButton} />

          {/* Logout Button */}
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <View style={styles.logoutIconContainer}>
              <Ionicons name="log-out-outline" size={22} color="#FFF" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Quick Stats Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quickStatsContainer}
        >
          <View style={styles.quickStatPill}>
            <Ionicons name="trending-up" size={16} color="#4CAF50" />
            <View style={styles.quickStatContent}>
              <Text style={styles.quickStatValue}>92%</Text>
              <Text style={styles.quickStatLabel}>Response Rate</Text>
            </View>
          </View>
          <View style={styles.quickStatPill}>
            <Ionicons name="time" size={16} color={Colors.Secondary} />
            <View style={styles.quickStatContent}>
              <Text style={styles.quickStatValue}>5 days</Text>
              <Text style={styles.quickStatLabel}>Avg. Time to Hire</Text>
            </View>
          </View>
          <View style={styles.quickStatPill}>
            <Ionicons name="eye" size={16} color="#9C27B0" />
            <View style={styles.quickStatContent}>
              <Text style={styles.quickStatValue}>1.2K</Text>
              <Text style={styles.quickStatLabel}>Profile Views</Text>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <QuickActionCard
              icon="add-circle"
              label="Post Job"
              color="#3498DB"
              onPress={() => router.push("/(employer)/add-job")}
            />
            <QuickActionCard
              icon="briefcase"
              label="My Jobs"
              color="#2ECC71"
              onPress={() => router.push("/(employer)/my-jobs")}
            />
          </View>
        </View>

        {/* Statistics Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.statsGrid}>
            <StatCard
              icon="briefcase"
              label="Active Jobs"
              value={stats.activeJobs}
              color="#3498DB"
            />
            <StatCard
              icon="document-text"
              label="Applications"
              value={stats.totalApplications}
              color="#E67E22"
            />
          </View>
        </View>

        {/* Recent Jobs */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Active Jobs</Text>
              <Text style={styles.sectionSubtitle}>
                Your top performing listings
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => router.push("/(employer)/my-jobs")}
            >
              <View style={styles.seeAllButton}>
                <Text style={styles.seeAllText}>See All</Text>
                <Ionicons
                  name="arrow-forward"
                  size={16}
                  color={Colors.Secondary}
                />
              </View>
            </TouchableOpacity>
          </View>

          {recentJobs.length > 0 ? (
            recentJobs.map((job) => <EmployerJobCard key={job.id} job={job} />)
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="briefcase-outline" size={48} color="#CCC" />
              <Text style={styles.emptyStateText}>No active jobs yet</Text>
            </View>
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  headerGradient: {
    paddingTop:55,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    flex: 1,
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.3)",
  },
  avatarText: {
    fontSize: 20,
    fontWeight: "800",
    color: "#FFF",
  },
  onlineDot: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#4CAF50",
    borderWidth: 2,
    borderColor: "#FFF",
  },
  greeting: {
    fontSize: 13,
    color: "rgba(255,255,255,0.8)",
    marginBottom: 2,
  },
  userName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFF",
    marginBottom: 4,
  },
  premiumBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    gap: 4,
    alignSelf: "flex-start",
  },
  premiumText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#FFF",
  },
  notificationButton: {
    marginLeft: 8,
  },
  logoutButton: {
    marginLeft: 8,
  },
  logoutIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: "#FF4458",
    borderRadius: 12,
    minWidth: 22,
    height: 22,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
    borderWidth: 2,
    borderColor: "#FFF",
  },
  notificationBadgeText: {
    color: "#FFF",
    fontSize: 11,
    fontWeight: "700",
  },
  quickStatsContainer: {
    paddingHorizontal: 20,
    gap: 10,
  },
  quickStatPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 10,
    backdropFilter: "blur(10px)",
  },
  quickStatContent: {
    gap: 2,
  },
  quickStatValue: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFF",
  },
  quickStatLabel: {
    fontSize: 10,
    color: "rgba(255,255,255,0.8)",
  },
  scrollContent: {
    paddingTop: 24,
  },
  section: {
    marginBottom: 28,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#2C3E50",
    marginBottom: 15,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: "#999",
    marginTop: 2,
  },
  seeAllButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.Secondary,
  },
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    backgroundColor: "#FFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#EEE",
    borderStyle: "dashed",
  },
  emptyStateText: {
    marginTop: 12,
    fontSize: 14,
    color: "#999",
  },
  switchSection: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  switchBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1ABC9C",
    paddingVertical: 16,
    borderRadius: 14,
    gap: 10,
    shadowColor: "#1ABC9C",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  switchBtnText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFF",
  },
});
