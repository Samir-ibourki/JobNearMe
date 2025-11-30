import React from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Image,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

import Colors from "../../theme/colors.js";

const image = require("../../assets/congrat.png");

const LaundrifyOnboardingScreen = () => {
  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.Primary} />

      <LinearGradient
        colors={[Colors.Primary, Colors.Secondary, "#FFFFFF"]}
        locations={[0, 0.5, 1]}
        style={styles.gradientBackground}
      >
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logoIcon}>
              <Text style={styles.logoIconText}>🔍</Text>
            </View>
            <Text style={styles.headerLogoText}>JobNearMe</Text>
          </View>
        </View>

        <View style={styles.illustrationContainer}>
          <Image
            source={image}
            style={styles.illustration}
            resizeMode="contain"
          />
        </View>

        <View style={styles.contentBottom}>
          <Text style={styles.title}>
            Laundry, done for you.{"\n"}
            <Text style={styles.subtitle}>Anytime, anywhere</Text>
          </Text>

          <TouchableOpacity
            style={styles.getStartedButton}
            onPress={() => router.push("(auth)/signUp")}
          >
            <Text style={styles.getStartedText}>Get Started</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => {
              router.push("(auth)/logIn");
            }}
          >
            <Text style={styles.loginText}>I already have an account</Text>
          </TouchableOpacity>

          <Text style={styles.termsText}>
            By continuing you agree to our{" "}
            <Text style={styles.linkText}>Terms of Services</Text>
            {"\n"}and <Text style={styles.linkText}>Privacy Policy</Text>
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  gradientBackground: {
    flex: 1,
  },
  header: {
    width: "100%",
    paddingHorizontal: 20,
    paddingTop: 60,
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
  logoIconText: {
    fontSize: 18,
  },
  headerLogoText: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.textLight,
  },
  illustrationContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  illustration: {
    width: 600,
    height: 600,
  },
  contentBottom: {
    paddingHorizontal: 30,
    paddingBottom: 50,
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: Colors.textDark,
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 38,
  },
  subtitle: {
    fontSize: 32,
    fontWeight: "400",
    color: Colors.textDark,
  },
  getStartedButton: {
    width: "100%",
    backgroundColor: Colors.buttonPrimary,
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  getStartedText: {
    color: Colors.textLight,
    fontSize: 16,
    fontWeight: "600",
  },
  loginButton: {
    width: "100%",
    backgroundColor: Colors.buttonSecondary,
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  loginText: {
    color: Colors.textDark,
    fontSize: 16,
    fontWeight: "600",
  },
  termsText: {
    textAlign: "center",
    fontSize: 12,
    color: Colors.linkText,
    lineHeight: 18,
    fontWeight: "bold",
  },
  linkText: {
    color: Colors.linkText,
    fontWeight: "500",
  },
});

export default LaundrifyOnboardingScreen;
