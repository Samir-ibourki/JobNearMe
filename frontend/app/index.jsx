import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withSequence,
  Easing,
} from "react-native-reanimated";
import icon from "../assets/AppIcon.png";
import Colors from "../theme/colors";

export default function Index() {
  const router = useRouter();

  // Animation values
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.5);
  const translateY = useSharedValue(30);
  const logoRotate = useSharedValue(0);

  const animatedLogoStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }, { rotate: `${logoRotate.value}deg` }],
  }));

  const animatedTextStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  useEffect(() => {
    // Start animations
    opacity.value = withTiming(1, {
      duration: 1000,
      easing: Easing.out(Easing.exp),
    });

    scale.value = withSpring(1, {
      damping: 8,
      stiffness: 100,
    });

    translateY.value = withSpring(0, {
      damping: 10,
      stiffness: 100,
    });

    logoRotate.value = withSequence(
      withTiming(360, { duration: 1000, easing: Easing.out(Easing.exp) }),
      withTiming(360, { duration: 0 })
    );

    // Check first launch and navigate
    const checkFirstLaunch = async () => {
      const alreadyLaunched = await AsyncStorage.getItem("alreadyLaunched");

      setTimeout(() => {
        opacity.value = withTiming(0, { duration: 400 });

        setTimeout(async () => {
          if (alreadyLaunched === null) {
            await AsyncStorage.setItem("alreadyLaunched", "true");
            router.replace("onboarding/index");
          } else {
            router.replace("(auth)/logIn");
          }
        }, 400);
      }, 2500);
    };

    checkFirstLaunch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <LinearGradient
      colors={[Colors.Primary, Colors.Secondary, "#FFFFFF"]}
      locations={[0, 0.6, 1]}
      style={styles.container}
    >
      <View style={styles.center}>
        <Animated.View style={[styles.logoContainer, animatedLogoStyle]}>
          <View style={styles.logoIcon}>
            <Image
              source={icon}
              resizeMode="contain"
              style={styles.logoImage}
            />
          </View>
        </Animated.View>

        <Animated.View style={animatedTextStyle}>
          <Text style={styles.appName}>JobNearMe</Text>
          <Text style={styles.subtitle}>Find Jobs near you instantly.</Text>
        </Animated.View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  center: {
    alignItems: "center",
    gap: 30,
  },
  logoContainer: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  logoIcon: {
    width: 120,
    height: 120,
    borderRadius: 28,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  logoImage: {
    width: 80,
    height: 80,
  },
  appName: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#FFFFFF",
    letterSpacing: 1,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "rgba(255, 255, 255, 0.9)",
    marginTop: 5,
    fontWeight: "500",
  },
});
