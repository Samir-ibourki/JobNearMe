import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Image,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const COLORS = {
  primary: "#003366",
  secondary: "#0059b3",
  textDark: "#000000",
  textLight: "#FFFFFF",
  buttonPrimary: "#000000",
  buttonSecondary: "#EEEEEE",
  linkText: "#007bff",
};

const JOB_IMAGE = require("../../assets/onboard3.png");

const JobNearMeOnboardingScreen = ({ navigation }) => {
  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      <LinearGradient
        colors={[COLORS.primary, COLORS.secondary]}
        style={styles.gradientTop}
      >
        <View style={styles.header}>
          <Text style={styles.headerLogoText}>JobNearMe</Text>
        </View>

        <View style={styles.illustrationContainer}>
          <Image
            source={JOB_IMAGE}
            style={styles.illustration}
            resizeMode="contain"
          />
        </View>
      </LinearGradient>

      <View style={styles.contentBottom}>
        <Text style={styles.title}>
          Your Next Job Awaits.
          {"\n"}
          <Text style={styles.subtitle}>Find opportunities nearby</Text>
        </Text>

        <TouchableOpacity style={styles.getStartedButton} onPress={() => {}}>
          <Text style={styles.getStartedText}>Get Started</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginButton}>
          <Text style={styles.loginText}>I already have an account</Text>
        </TouchableOpacity>

        <Text style={styles.termsText}>
          By continuing you agree to our{" "}
          <Text style={styles.linkText}>Terms of Services</Text> and{" "}
          <Text style={styles.linkText}>Privacy Policy</Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  gradientTop: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 50,
    alignItems: "center",
  },
  header: {
    width: "100%",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  headerLogoText: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.textLight,
  },
  illustrationContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 40,
  },
  illustration: {
    width: 250,
    height: 250,
  },
  contentBottom: {
    flex: 1.2,
    paddingHorizontal: 30,
    alignItems: "center",
    marginTop: -50, // Pulls content up over the gradient edge
  },
  title: {
    fontSize: 34,
    fontWeight: "900",
    color: COLORS.textDark,
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 40,
  },
  subtitle: {
    fontSize: 34,
    fontWeight: "900",
    color: COLORS.textDark,
  },
  getStartedButton: {
    width: "100%",
    backgroundColor: COLORS.buttonPrimary,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  getStartedText: {
    color: COLORS.textLight,
    fontSize: 18,
    fontWeight: "bold",
  },
  loginButton: {
    width: "100%",
    backgroundColor: COLORS.buttonSecondary,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 15,
    borderColor: "#DDDDDD",
    borderWidth: 1,
  },
  loginText: {
    color: COLORS.textDark,
    fontSize: 18,
    fontWeight: "bold",
  },
  termsText: {
    position: "absolute",
    bottom: 30,
    textAlign: "center",
    fontSize: 12,
    color: "#666666",
    paddingHorizontal: 20,
  },
  linkText: {
    textDecorationLine: "underline",
    color: COLORS.linkText,
  },
});

export default JobNearMeOnboardingScreen;
