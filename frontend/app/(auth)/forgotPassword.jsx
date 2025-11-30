import { Ionicons } from "@expo/vector-icons";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../../theme/colors";
import { inputContainer, label } from "../../theme/styles";
export default function ForgotPassword() {
  return (
    <SafeAreaView style={styles.conatiner}>
      <Animated.View style={styles.form}>
        <View style={styles.inputWrapper}>
          <Text style={label}>New Password</Text>
          <View style={inputContainer}>
            <Ionicons name="lock-closed-outline" size={22} />
            <TextInput placeholder="Enter your new password " />
          </View>
        </View>
        <View style={styles.inputWrapper}>
          <Text style={label}>Confirm Your new Password</Text>
          <View style={inputContainer}>
            <Ionicons name="lock-closed-outline" size={22} />
            <TextInput placeholder="Confirm your new password " />
          </View>
        </View>
        <TouchableOpacity style={styles.registerBtn} activeOpacity={0.8}>
          <Text style={styles.restBtn}>Reset your password </Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  conatiner: {
    flex: 1,
    paddingHorizontal: 24,
    backgroundColor: "#eee",
  },
  inputWrapper: {
    marginBottom: 20,
  },

  inputFocused: {
    borderColor: Colors.Secondary,
    backgroundColor: "#F0F8FF",
  },
  registerBtn: {
    backgroundColor: Colors.Secondary,
    alignItems: "center",
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: Colors.Secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  restBtn: {
    color: "#f5f3f3ff",
    fontSize: 18,
    fontWeight: 600,
  },
});
