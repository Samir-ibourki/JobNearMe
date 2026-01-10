import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import Colors from "../../theme/colors";
import { useMyApplications } from "../../hooks/useCandidate";
import ApplicationCard from "../../components/ApplicationCard";

export default function CandidateApplications() {
  const { data: applications, isLoading, refetch } = useMyApplications();

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color={Colors.Primary} />
          <Text style={{ marginTop: 10, color: "#666" }}>
            Loading applications...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const totalApplications = applications?.length || 0;
  const pendingCount =
    applications?.filter((a) => a.status === "pending").length || 0;
  const acceptedCount =
    applications?.filter((a) => a.status === "accepted").length || 0;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />

      {/* header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Applications</Text>
        <TouchableOpacity onPress={() => refetch()} style={styles.backBtn}>
          <Ionicons name="refresh-outline" size={22} color="#000" />
        </TouchableOpacity>
      </View>

      {/* stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{totalApplications}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: "#F5A623" }]}>
            {pendingCount}
          </Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: "#1ABC9C" }]}>
            {acceptedCount}
          </Text>
          <Text style={styles.statLabel}>Accepted</Text>
        </View>
      </View>

      {/* applications list */}
      <FlatList
        data={applications || []}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ApplicationCard
            application={item}
            onPress={() => router.push(`/(candidate)/job/${item.jobId}`)}
          />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={60} color="#EEE" />
            <Text style={styles.emptyTitle}>No Applications</Text>
            <Text style={styles.emptySubtitle}>
              Your job applications will appear here
            </Text>
            <TouchableOpacity
              style={styles.browseBtn}
              onPress={() => router.push("/(candidate)")}
            >
              <Text style={styles.browseBtnText}>Browse Jobs</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FE",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 28,
    fontWeight: "800",
    color: Colors.Primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#888",
  },
  statDivider: {
    width: 1,
    backgroundColor: "#F0F0F0",
  },
  list: {
    padding: 20,
    paddingBottom: 40,
  },
  emptyState: {
    marginTop: 80,
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#888",
    marginTop: 8,
  },
  browseBtn: {
    marginTop: 20,
    backgroundColor: Colors.Primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  browseBtnText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 15,
  },
});
