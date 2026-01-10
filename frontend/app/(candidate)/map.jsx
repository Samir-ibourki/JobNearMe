import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { useState, useEffect, useRef } from "react";
import Colors from "../../theme/colors";
import { useAllJobs } from "../../hooks/useCandidate";

export default function CandidateMap() {
  const mapRef = useRef(null);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(true);

  const { data: jobs } = useAllJobs();

  // Filter only jobs have coordinates
  const jobsWithCoordinates =
    jobs?.filter((job) => job.latitude && job.longitude) || [];

  useEffect(() => {
    (async () => {
      // location permission
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission denied");
        setLoading(false);
        return;
      }
      // get current location
      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      setLoading(false);

      // Animate map to user location
      if (mapRef.current) {
        mapRef.current.animateToRegion(
          {
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          },
          1000
        );
      }
    })();
  }, []);

  const centerOnUser = () => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        },
        500
      );
    }
  };

  // Default region (casa)
  const initialRegion = {
    latitude: location?.coords?.latitude || 33.5731,
    longitude: location?.coords?.longitude || -7.5898,
    latitudeDelta: 0.08,
    longitudeDelta: 0.08,
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />

      {/* map */}
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation={true}
        showsMyLocationButton={false}
      >
        {jobsWithCoordinates.map((job) => (
          <Marker
            key={job.id}
            coordinate={{
              latitude: parseFloat(job.latitude),
              longitude: parseFloat(job.longitude),
            }}
            title={job.title}
            description={`${job.employer?.fullname || "Employer"} - ${
              job.salary ? job.salary + " DH" : "Salary TBD"
            }`}
            onCalloutPress={() => router.push(`/(candidate)/job/${job.id}`)}
          >
            <View style={styles.markerContainer}>
              <View style={styles.marker}>
                <Ionicons name="briefcase" size={16} color="#FFF" />
              </View>
              <View style={styles.markerArrow} />
            </View>
          </Marker>
        ))}
      </MapView>

      {/* loading overlay */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={Colors.Primary} />
          <Text style={styles.loadingText}>Localisation en cours...</Text>
        </View>
      )}

      {/* header overlay */}
      <SafeAreaView style={styles.headerOverlay}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
          >
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={18} color="#888" />
            <Text style={styles.searchText}>
              {errorMsg || (location ? "Ma position" : "Recherche...")}
            </Text>
          </View>
          <TouchableOpacity style={styles.filterBtn}>
            <Ionicons name="options-outline" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* my location button */}
      <TouchableOpacity style={styles.myLocationBtn} onPress={centerOnUser}>
        <Ionicons name="locate" size={22} color={Colors.Primary} />
      </TouchableOpacity>

      {/* jobs count  */}
      <View style={styles.countBadge}>
        <Ionicons name="briefcase" size={16} color={Colors.Primary} />
        <Text style={styles.countText}>{jobsWithCoordinates.length} jobs</Text>
      </View>

      {/* bottom card */}
      <View style={styles.bottomCard}>
        <View style={styles.dragHandle} />
        <Text style={styles.bottomTitle}>Nearby Jobs</Text>
        <Text style={styles.bottomSubtitle}>
          Click on a marker to see details
        </Text>
        <TouchableOpacity
          style={styles.listViewBtn}
          onPress={() => router.back()}
        >
          <Ionicons name="list" size={18} color={Colors.Primary} />
          <Text style={styles.listViewText}>List View</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  headerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
    gap: 12,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 22,
    paddingHorizontal: 15,
    height: 44,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  searchText: {
    fontSize: 15,
    color: "#333",
    fontWeight: "500",
  },
  filterBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.Primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.Primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  markerContainer: {
    alignItems: "center",
  },
  marker: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.Primary,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#FFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  markerArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: Colors.Primary,
    marginTop: -2,
  },
  callout: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 12,
    minWidth: 180,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  calloutTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 2,
  },
  calloutEmployer: {
    fontSize: 13,
    color: "#888",
    marginBottom: 4,
  },
  calloutSalary: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1ABC9C",
    marginBottom: 8,
  },
  calloutBtn: {
    backgroundColor: Colors.Primary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  calloutBtnText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFF",
  },
  countBadge: {
    position: "absolute",
    top: 120,
    left: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  countText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
  },
  bottomCard: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 35,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#E0E0E0",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 15,
  },
  bottomTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  bottomSubtitle: {
    fontSize: 14,
    color: "#888",
    marginBottom: 15,
  },
  listViewBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F0F5FF",
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  listViewText: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.Primary,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: "#666",
  },
  myLocationBtn: {
    position: "absolute",
    right: 20,
    top: 130,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
});
