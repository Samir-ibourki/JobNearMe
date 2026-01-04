import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../../theme/colors";
import { useJobApplications, useJobById } from "../../../hooks/useEmployer";
import { router, useLocalSearchParams } from "expo-router";
import ApplicantCard from "../../../components/ApplicantCard";

export default function JobApplicants() {
  const { id } = useLocalSearchParams();
  const { data: job, isLoading: jobLoading } = useJobById(id);
  const { data: applications, isLoading: appsLoading } = useJobApplications(id);

  const isLoading = jobLoading || appsLoading;

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.Primary} />
          <Text style={{ marginTop: 10, color: "#666" }}>
            Loading applicants...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Applicants</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.jobInfo}>
        <Text style={styles.jobTitle}>{job?.data?.title}</Text>
        <Text style={styles.applicantCount}>
          {applications?.length || 0} applicant
          {applications?.length !== 1 ? "s" : ""}
        </Text>
      </View>

      <FlatList
        data={applications}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <ApplicantCard item={item} />}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={60} color="#EEE" />
            <Text style={styles.emptyTitle}>No applicants yet</Text>
            <Text style={styles.emptySubtitle}>
              When candidates apply, they all appear here.
            </Text>
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
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  jobInfo: {
    backgroundColor: "#FFF",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  applicantCount: {
    fontSize: 14,
    color: "#666",
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
    color: "#666",
    marginTop: 8,
    textAlign: "center",
  },
});
