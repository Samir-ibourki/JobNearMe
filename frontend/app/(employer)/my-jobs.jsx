import { Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MyJobs() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>My Jobs</Text>
      <Text>List of your posted jobs.</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
});
