import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { onboardingData } from "../../utils/data.js";
import Colors from "../../theme/colors";

export default function IndexOnboarding() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Animation values
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);
  const translateY = useSharedValue(30);

  const animatedImageStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
  }));

  const animatedTextStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  useEffect(() => {
    // Reset values
    opacity.value = 0;
    scale.value = 0.8;
    translateY.value = 30;

    // Animate
    opacity.value = withTiming(1, {
      duration: 800,
      easing: Easing.out(Easing.exp),
    });
    scale.value = withSpring(1, {
      damping: 12,
      stiffness: 100,
    });
    translateY.value = withSpring(0, {
      damping: 15,
      stiffness: 120,
    });
  }, [currentIndex]);

  const nextSlide = () => {
    if (currentIndex < onboardingData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      router.push("onboarding/lastOnboard");
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const currentSlide = onboardingData[currentIndex];

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient
        colors={[Colors.Primary, Colors.Secondary, "#FFFFFF"]}
        locations={[0, 0.5, 1]}
        style={styles.gradient}
      >
        {/* Logo Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logoIcon}>
              <Text style={styles.logoEmoji}>🔍</Text>
            </View>
            <Text style={styles.logoText}>JobNearMe</Text>
          </View>
        </View>

        {/* Content */}
        <View style={styles.contentContainer}>
          {/* Image */}
          <Animated.View style={[styles.imageContainer, animatedImageStyle]}>
            <Image
              source={currentSlide.img}
              resizeMode="contain"
              style={styles.image}
            />
          </Animated.View>

          {/* Text Content */}
          <Animated.View style={[styles.textContainer, animatedTextStyle]}>
            <Text style={styles.title}>{currentSlide.title}</Text>
            <Text style={styles.subtitle}>{currentSlide.subTitle}</Text>
          </Animated.View>
        </View>

        {/* Bottom Section */}
        <View style={styles.bottomSection}>
          {/* Dots Indicator */}
          <View style={styles.dotsContainer}>
            {onboardingData.map((_, index) => (
              <View
                key={index}
                style={[styles.dot, currentIndex === index && styles.activeDot]}
              />
            ))}
          </View>

          {/* Buttons */}
          <View style={styles.btns}>
            {currentIndex > 0 && (
              <TouchableOpacity
                onPress={prevSlide}
                style={styles.prevButton}
                activeOpacity={0.8}
              >
                <Text style={styles.prevText}>Previous</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={nextSlide}
              style={[
                styles.nextButton,
                currentIndex === 0 && styles.nextButtonFull,
              ]}
              activeOpacity={0.8}
            >
              <Text style={styles.nextText}>
                {currentIndex === onboardingData.length - 1
                  ? "Get Started"
                  : "Next"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Skip Button */}
          {currentIndex < onboardingData.length - 1 && (
            <TouchableOpacity
              onPress={() => router.push("onboarding/lastOnboard")}
              style={styles.skipButton}
            >
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.Primary,
  },
  gradient: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
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
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  imageContainer: {
    marginBottom: 40,
  },
  image: {
    width: 500,
    height: 500,
  },
  textContainer: {
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#000000",
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  bottomSection: {
    paddingHorizontal: 30,
    paddingBottom: 40,
    alignItems: "center",
    gap: 20,
  },
  dotsContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  activeDot: {
    backgroundColor: "#000000",
    width: 24,
  },
  btns: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  prevButton: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  prevText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "600",
  },
  nextButton: {
    flex: 1,
    backgroundColor: "#000000",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  nextButtonFull: {
    flex: 2,
  },
  nextText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  skipButton: {
    paddingVertical: 8,
  },
  skipText: {
    color: "#666666",
    fontSize: 14,
    fontWeight: "500",
  },
});
