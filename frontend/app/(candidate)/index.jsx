import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import Colors from "../../theme/colors";
import { useAllJobs } from "../../hooks/useCandidate";
import CandidateJobCard from "../../components/CandidateJobCard";
import NotificationBadge from "../../components/NotificationBadge";
import { useCallback, useMemo, useState } from "react";

export default function CandidateHome() {
  // eslint-disable-next-line no-unused-vars
  const { data: jobs, isLoading, error } = useAllJobs();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    "All",
    "Restaurant",
    "Retail",
    "Delivery",
    "Security",
    "Tech",
  ];

  const filteredJobs = useMemo(() => {
    return jobs?.filter((job) => {
      // category filter
      const matchesCategory =
        selectedCategory === "All" ||
        job.category?.toLowerCase() === selectedCategory.toLowerCase();

      // search filter
      const matchesSearch =
        searchQuery === "" ||
        job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.employer?.fullname
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [jobs, selectedCategory, searchQuery]);

  const renderJobItem = useCallback(
    ({ item }) => (
      <CandidateJobCard
        job={item}
        onPress={() => router.push(`/(candidate)/job/${item.id}`)}
      />
    ),
    [],
  );

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={Colors.Primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />

      {/* header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello 👋</Text>
          <Text style={styles.headerTitle}>Find your job</Text>
        </View>
        <View style={styles.headerRight}>
          <NotificationBadge size={22} color={Colors.Primary} />
          <TouchableOpacity
            style={styles.mapBtn}
            onPress={() => router.push("/(candidate)/map")}
          >
            <Ionicons name="map-outline" size={22} color={Colors.Primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* search-bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color="#888" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for a job..."
            placeholderTextColor="#AAA"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={styles.filterBtn}>
          <Ionicons name="options-outline" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* categories */}
      <View style={styles.categoriesContainer}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryChip,
                selectedCategory === item && styles.categoryChipActive,
              ]}
              onPress={() => setSelectedCategory(item)}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  selectedCategory === item && styles.categoryChipTextActive,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* jobs list */}
      <View style={styles.jobsSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Jobs</Text>
          <Text style={styles.jobCount}>{filteredJobs?.length || 0} jobs</Text>
        </View>

        <FlatList
          data={filteredJobs}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderJobItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.jobsList}
        />
      </View>

      {/* bottom navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home" size={24} color={Colors.Primary} />
          <Text style={[styles.navText, styles.navTextActive]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/(candidate)/map")}
        >
          <Ionicons name="map-outline" size={24} color="#888" />
          <Text style={styles.navText}>Map</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/(candidate)/applications")}
        >
          <Ionicons name="document-text-outline" size={24} color="#888" />
          <Text style={styles.navText}>Applications</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/(candidate)/profile")}
        >
          <Ionicons name="person-outline" size={24} color="#888" />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
    backgroundColor: "#FFF",
  },
  greeting: {
    fontSize: 14,
    color: "#888",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1A1A1A",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  mapBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F0F5FF",
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#FFF",
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 14,
    paddingHorizontal: 15,
    height: 50,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#333",
  },
  filterBtn: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: Colors.Primary,
    justifyContent: "center",
    alignItems: "center",
  },
  categoriesContainer: {
    paddingLeft: 20,
    paddingVertical: 15,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 12,
  },
  categoryChip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    marginRight: 10,
  },
  categoryChipActive: {
    backgroundColor: Colors.Primary,
  },
  categoryChipText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "600",
  },
  categoryChipTextActive: {
    color: "#FFF",
  },
  jobsSection: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  jobCount: {
    fontSize: 13,
    color: "#888",
  },
  jobsList: {
    paddingBottom: 100,
  },
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
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    backgroundColor: "#FFF",
    paddingVertical: 12,
    paddingBottom: 25,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 10,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  navText: {
    fontSize: 11,
    color: "#888",
    fontWeight: "600",
  },
  navTextActive: {
    color: Colors.Primary,
  },
});
