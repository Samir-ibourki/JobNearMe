import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import icon from "../assets/AppIcon.png";

export default function Index() {
  const router = useRouter();
  const progress = useSharedValue(0);
  const translateY = useSharedValue(50);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ translateY: translateY.value }],
  }));

  useEffect(() => {
    // Animation on mount
    progress.value = withTiming(1, { duration: 1500 });
    translateY.value = withSpring(0, { damping: 10, stiffness: 100 });

    // Check if it's the first time opening the app
    const checkFirstLaunch = async () => {
      const alreadyLaunched = await AsyncStorage.getItem("alreadyLaunched");
      setTimeout(async () => {
        if (alreadyLaunched === null) {
          await AsyncStorage.setItem("alreadyLaunched", "true");
          router.replace("/logIn");
        } else {
          router.replace("/logIn");
        }
      }, 3000);
    };

    checkFirstLaunch();
  }, [progress, router, translateY]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.center, animatedStyle]}>
        <Image
          source={icon}
          resizeMode="contain"
          style={{ width: 160, height: 160 }}
        />
        <Text style={styles.text}>JobNearMe</Text>
        <Text style={styles.subtitle}>Find Jobs near you instantly.</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0a84ff93",
  },
  center: {
    alignItems: "center",
    gap: 10,
  },
  text: {
    fontSize: 35,
    fontWeight: "bold",
    color: "#fff",
  },
  subtitle: {
    fontSize: 18,
    textAlign: "center",
    color: "#f5f5f5",
  },
});
