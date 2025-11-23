import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export default function ForgotPassword() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>New Password</Text>
        <View style={styles.input}>
          <Ionicons name="lock-closed-outline" size={22} />
          <TextInput placeholder="Enter your new password " />
        </View>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Confirm Your new Password</Text>
        <View style={styles.input}>
          <Ionicons name="lock-closed-outline" size={22} />
          <TextInput placeholder="Confirm your new password " />
        </View>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 8,
  },
  inputContainer: {
    paddingHorizontal: 23,
  },
  input: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#E5E5E5",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
});
