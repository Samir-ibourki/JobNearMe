import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import useUserStore from "../../store/useStore";
import Colors from "../../theme/colors";
import FormInput from "../../components/FormInput";
import Divider from "../../components/Divider";
import Terms from "../../components/Terms";
import { useLogin } from "../../hooks/useAuth";

export default function LogIn() {
  const {
    email,
    password,
    showPassword,
    setEmail,
    setPassword,
    setShowPassword,
  } = useUserStore();
  const { mutate: login, isPending, isError, error } = useLogin();

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Erreur", "Veuillez remplir email et mot de passe");
      return;
    }

    login(
      { email, password },
      {
        onSuccess: (res) => {
          Alert.alert("Succès", "Connexion réussie !");
          setEmail("");
          setPassword("");

          const user = res.data.data.user;

          if (user.role === "employer") {
            router.replace("/(employer)/dashboard");
          } else {
            router.replace("/(candidate)");
          }
        },
        onError: (err) => {
          Alert.alert(
            "Erreur",
            err.response?.data?.message || "Échec de connexion"
          );
        },
      }
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={Colors.Primary}
        translucent={false}
      />
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <LinearGradient
          colors={[Colors.Primary, Colors.Secondary, "#FFFFFF"]}
          locations={[0, 0.3, 0.7]}
          style={styles.gradient}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity
                onPress={() => router.back()}
                style={styles.backButton}
              >
                <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
              </TouchableOpacity>

              <View style={styles.logoContainer}>
                <View style={styles.logoIcon}>
                  <Text style={styles.logoEmoji}>🔍</Text>
                </View>
                <Text style={styles.logoText}>JobNearMe</Text>
              </View>
            </View>

            {/* Form Container */}
            <View style={styles.formContainer}>
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>
                Log in to find your next opportunity
              </Text>

              {/* Email Input */}
              <FormInput
                label="Email Address"
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                iconName="mail-outline"
                keyboardType="email-address"
              />

              {/* Password Input */}
              <FormInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                iconName="lock-closed-outline"
                secureTextEntry={true}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
              />

              {/* Forgot Password */}
              <TouchableOpacity
                onPress={() => router.push("(auth)/forgotPassword")}
                style={styles.forgotPassword}
              >
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>

              {/* Login Button */}
              <TouchableOpacity
                style={[styles.loginButton, isPending && { opacity: 0.7 }]}
                onPress={handleLogin}
                disabled={isPending}
                activeOpacity={0.8}
              >
                <Text style={styles.loginButtonText}>
                  {isPending ? "Connexion..." : "Log In"}
                </Text>
                {!isPending && (
                  <Ionicons name="arrow-forward" size={20} color="#fff" />
                )}
              </TouchableOpacity>

              {isError && (
                <Text
                  style={{
                    color: "red",
                    textAlign: "center",
                    marginVertical: 10,
                  }}
                >
                  {error?.response?.data?.message || "Erreur de connexion"}
                </Text>
              )}

              {/* Divider */}
              <Divider text="or" />

              {/* Sign Up Link */}
              <TouchableOpacity
                onPress={() => router.push("(auth)/signUp")}
                style={styles.signUpButton}
              >
                <Text style={styles.signUpButtonText}>Create New Account</Text>
              </TouchableOpacity>

              {/* Terms */}
              <Terms />
            </View>
          </ScrollView>
        </LinearGradient>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  keyboardView: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    left: 20,
    top: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  logoIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  logoEmoji: {
    fontSize: 18,
  },
  logoText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  formContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 30,
    paddingTop: 40,
    paddingBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 30,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: Colors.Secondary,
    fontWeight: "600",
  },
  loginButton: {
    backgroundColor: "#000000",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    borderRadius: 12,
    marginBottom: 20,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  signUpButton: {
    backgroundColor: "#F5F5F5",
    borderWidth: 2,
    borderColor: "#E0E0E0",
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  signUpButtonText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "600",
  },
});
