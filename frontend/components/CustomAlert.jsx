import React, { useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
  Pressable,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  withDelay,
  Easing,
  interpolate,
  runOnJS,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "../theme/colors";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const CustomAlert = ({
  visible,
  title,
  message,
  type = "success",
  onClose,
  onConfirm,
  confirmText = "Confirm",
  cancelText = "Cancel",
  autoClose = false, 
}) => {
  const scale = useSharedValue(0);
  const translateY = useSharedValue(50);
  const opacity = useSharedValue(0);
  const backdropOpacity = useSharedValue(0);
  const iconRotation = useSharedValue(0);
  const iconScale = useSharedValue(0);
  const buttonScale = useSharedValue(1);
  const shimmer = useSharedValue(0);

  const [showModal, setShowModal] = React.useState(visible);

  // Animation configurations
  const springConfig = {
    damping: 15,
    stiffness: 150,
    mass: 0.8,
  };

  const handleClose = useCallback(() => {
    // Exit animation
    scale.value = withTiming(0.8, { duration: 200 });
    translateY.value = withTiming(50, { duration: 200 });
    opacity.value = withTiming(0, { duration: 200 });
    backdropOpacity.value = withTiming(0, { duration: 200 });
    iconScale.value = withTiming(0, { duration: 150 });

    const timer = setTimeout(() => {
      setShowModal(false);
      onClose?.();
    }, 200);
    return () => clearTimeout(timer);
  }, [
    backdropOpacity,
    iconScale,
    onClose,
    opacity,
    scale,
    translateY,
  ]);

  useEffect(() => {
    if (visible) {
      setShowModal(true);
      // Entrance animations with sequence
      backdropOpacity.value = withTiming(1, { duration: 300 });
      scale.value = withDelay(100, withSpring(1, springConfig));
      translateY.value = withDelay(100, withSpring(0, springConfig));
      opacity.value = withDelay(100, withTiming(1, { duration: 300 }));

      // Icon animation with bounce
      iconScale.value = withDelay(
        300,
        withSequence(
          withSpring(1.2, { damping: 8, stiffness: 200 }),
          withSpring(1, { damping: 10, stiffness: 100 }),
        ),
      );
      iconRotation.value = withDelay(
        300,
        withSequence(
          withTiming(-10, { duration: 100 }),
          withTiming(10, { duration: 100 }),
          withTiming(0, { duration: 100 }),
        ),
      );

      // Shimmer effect
      shimmer.value = withDelay(
        500,
        withTiming(1, { duration: 600, easing: Easing.inOut(Easing.ease) }),
      );

      // Auto close for non-confirm alerts
      if (autoClose && type !== "confirm") {
        const timer = setTimeout(() => {
          handleClose();
        }, 3000);
        return () => clearTimeout(timer);
      }
    } else {
      handleClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const backdropAnimatedStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateY: translateY.value },
    ],
    opacity: opacity.value,
  }));

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: iconScale.value },
      { rotate: `${iconRotation.value}deg` },
    ],
  }));

  const shimmerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(shimmer.value, [0, 0.5, 1], [0, 0.3, 0]),
    transform: [
      { translateX: interpolate(shimmer.value, [0, 1], [-100, 100]) },
    ],
  }));

  const getAlertConfig = () => {
    switch (type) {
      case "success":
        return {
          icon: "checkmark-circle",
          color: "#10B981",
          gradient: ["#10B981", "#059669"],
          bgColor: "rgba(16, 185, 129, 0.1)",
        };
      case "error":
        return {
          icon: "close-circle",
          color: "#EF4444",
          gradient: ["#EF4444", "#DC2626"],
          bgColor: "rgba(239, 68, 68, 0.1)",
        };
      case "warning":
        return {
          icon: "warning",
          color: "#F59E0B",
          gradient: ["#F59E0B", "#D97706"],
          bgColor: "rgba(245, 158, 11, 0.1)",
        };
      case "confirm":
        return {
          icon: "help-circle",
          color: Colors.Primary,
          gradient: [Colors.Primary, Colors.Secondary],
          bgColor: `${Colors.Primary}15`,
        };
      default:
        return {
          icon: "information-circle",
          color: Colors.Primary,
          gradient: [Colors.Primary, Colors.Secondary],
          bgColor: `${Colors.Primary}15`,
        };
    }
  };

  const config = getAlertConfig();

  const handleButtonPress = (isConfirm) => {
    buttonScale.value = withSequence(
      withTiming(0.95, { duration: 100 }),
      withTiming(1, { duration: 100 }),
    );

    setTimeout(() => {
      if (isConfirm) {
        handleClose();
        onConfirm?.();
      } else {
        handleClose();
      }
    }, 150);
  };

  if (!showModal) return null;

  return (
    <Modal transparent visible={visible} animationType="none" statusBarTranslucent>
      <AnimatedPressable
        style={[styles.overlay, backdropAnimatedStyle]}
        onPress={type !== "confirm" ? handleClose : undefined}
      >
        <Animated.View
          style={[styles.alertContainer, containerAnimatedStyle]}
          onStartShouldSetResponder={() => true}
        >
          {/* Shimmer effect */}
          <Animated.View style={[styles.shimmer, shimmerAnimatedStyle]}>
            <LinearGradient
              colors={["transparent", "rgba(255,255,255,0.4)", "transparent"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>

          {/* Icon container with gradient background */}
          <View style={[styles.iconWrapper, { backgroundColor: config.bgColor }]}>
            <Animated.View style={[styles.iconContainer, iconAnimatedStyle]}>
              <LinearGradient
                colors={config.gradient}
                style={styles.iconGradient}
              >
                <Ionicons name={config.icon} size={40} color="#FFF" />
              </LinearGradient>
            </Animated.View>
          </View>

          {/* Title & Message */}
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            {type === "confirm" ? (
              <>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => handleButtonPress(false)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.cancelButtonText}>{cancelText}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.confirmButton]}
                  onPress={() => handleButtonPress(true)}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={config.gradient}
                    style={styles.buttonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Text style={styles.confirmButtonText}>{confirmText}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                style={[styles.button, styles.okButton]}
                onPress={() => handleButtonPress(true)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={config.gradient}
                  style={styles.buttonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.okButtonText}>OK</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>
      </AnimatedPressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  alertContainer: {
    backgroundColor: "#FFF",
    width: Math.min(SCREEN_WIDTH - 48, 380),
    borderRadius: 28,
    padding: 28,
    alignItems: "center",
    overflow: "hidden",
    // Premium shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.25,
    shadowRadius: 40,
    elevation: 25,
  },
  shimmer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: 100,
    height: "100%",
  },
  iconWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    overflow: "hidden",
  },
  iconGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1A1A2E",
    marginBottom: 12,
    textAlign: "center",
    letterSpacing: -0.5,
  },
  message: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 28,
    paddingHorizontal: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    width: "100%",
    gap: 12,
  },
  button: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    overflow: "hidden",
  },
  buttonGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  okButton: {
    width: "100%",
  },
  okButtonText: {
    color: "#FFF",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  cancelButton: {
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#4B5563",
    fontSize: 17,
    fontWeight: "700",
  },
  confirmButton: {
    // Gradient applied via child
  },
  confirmButtonText: {
    color: "#FFF",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});

export default CustomAlert;
