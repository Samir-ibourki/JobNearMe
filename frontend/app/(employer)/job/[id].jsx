import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../../theme/colors";
import { useJobById } from "../../../hooks/useEmployer";
import { router, useLocalSearchParams } from "expo-router";

export default function JobDetails() {
  const { id } = useLocalSearchParams();
  const { data: jobData, isLoading, error } = useJobById(id);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.Primary} />
          <Text style={{ marginTop: 10, color: "#666" }}>
            Loading job details...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !jobData?.data) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Ionicons name="alert-circle-outline" size={60} color="#FF6B6B" />
          <Text style={styles.errorText}>Failed to load job details</Text>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
          >
            <Text style={styles.backBtnText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const job = jobData.data;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Job Details</Text>
        <TouchableOpacity
          onPress={() => router.push(`/(employer)/edit-job/${id}`)}
          style={styles.editHeaderBtn}
        >
          <Ionicons name="pencil-outline" size={20} color={Colors.Primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.titleSection}>
          <Text style={styles.jobTitle}>{job.title}</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>Active</Text>
          </View>
        </View>

        {job.category && <Text style={styles.category}>{job.category}</Text>}

        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={18} color="#666" />
          <Text style={styles.infoText}>
            {job.city}
            {job.address ? `, ${job.address}` : ""}
          </Text>
        </View>

        {job.salary && (
          <View style={styles.infoRow}>
            <Ionicons name="cash-outline" size={18} color="#666" />
            <Text style={styles.infoText}>{job.salary}</Text>
          </View>
        )}

        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={18} color="#666" />
          <Text style={styles.infoText}>
            Posted on {new Date(job.createdAt).toLocaleDateString()}
          </Text>
        </View>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{job.description}</Text>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Location</Text>
        <View style={styles.locationBox}>
          <Ionicons name="map-outline" size={24} color={Colors.Primary} />
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.locationCity}>{job.city}</Text>
            <Text style={styles.locationCoords}>
              Lat: {job.latitude}, Lng: {job.longitude}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <TouchableOpacity
          style={styles.applicantsBtn}
          onPress={() => router.push(`/(employer)/applicants/${id}`)}
        >
          <Ionicons name="people-outline" size={20} color="#FFF" />
          <Text style={styles.applicantsBtnText}>View Applicants</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#666",
    marginTop: 10,
    marginBottom: 20,
  },
  backBtn: {
    backgroundColor: Colors.Primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  backBtnText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
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
  editHeaderBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F0F5FF",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    padding: 24,
  },
  titleSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  jobTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1A1A1A",
    flex: 1,
    paddingRight: 10,
  },
  statusBadge: {
    backgroundColor: "#E8F8F5",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1ABC9C",
  },
  category: {
    fontSize: 14,
    color: Colors.Primary,
    fontWeight: "600",
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 15,
    color: "#666",
  },
  divider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginVertical: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: "#444",
    lineHeight: 24,
  },
  locationBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FE",
    padding: 16,
    borderRadius: 16,
  },
  locationCity: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  locationCoords: {
    fontSize: 13,
    color: "#888",
    marginTop: 4,
  },
  applicantsBtn: {
    backgroundColor: Colors.Primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 16,
    borderRadius: 16,
  },
  applicantsBtnText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
