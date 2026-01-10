import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../theme/colors";

const CandidateJobCard = ({ job, onPress }) => {
  const formatSalary = (salary) => {
    if (!salary) return "salary not specified";
    if (typeof salary === "number" || !isNaN(salary)) {
      return `${salary} DH`;
    }
    return salary;
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.cardHeader}>
        <View style={styles.employerAvatar}>
          <Text style={styles.avatarText}>
            {job.employer?.fullname?.charAt(0) || job.title?.charAt(0) || "J"}
          </Text>
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.jobTitle}>{job.title}</Text>
          <Text style={styles.employerName}>
            {job.employer?.fullname || "Employer"}
          </Text>
        </View>
        <TouchableOpacity style={styles.bookmarkBtn}>
          <Ionicons name="bookmark-outline" size={22} color="#888" />
        </TouchableOpacity>
      </View>

      <View style={styles.cardTags}>
        <View style={styles.tag}>
          <Ionicons name="location-outline" size={14} color={Colors.Primary} />
          <Text style={styles.tagText}>{job.city}</Text>
        </View>
        <View style={styles.tag}>
          <Ionicons name="pricetag-outline" size={14} color={Colors.Primary} />
          <Text style={styles.tagText}>{job.category || "General"}</Text>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.salary}>{formatSalary(job.salary)}</Text>
        <Text style={styles.postedAt}>
          {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : ""}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
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
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  employerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.Primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
  },
  cardInfo: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 2,
  },
  employerName: {
    fontSize: 13,
    color: "#888",
  },
  bookmarkBtn: {
    padding: 5,
  },
  cardTags: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F5FF",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 5,
  },
  tagText: {
    fontSize: 12,
    color: Colors.Primary,
    fontWeight: "600",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#F5F5F5",
    paddingTop: 12,
  },
  salary: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1ABC9C",
  },
  postedAt: {
    fontSize: 12,
    color: "#AAA",
  },
});

export default CandidateJobCard;
