import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="logIn" />
      <Stack.Screen name="signUp" />
      <Stack.Screen
        name="forgotPassword"
        options={{
          presentation: "formSheet",
          animation: "fade_from_bottom",
          gestureDirection: "vertical",
          sheetGrabberVisible: true,
          sheetCornerRadius: 25,
          sheetAllowedDetents: [0.5, 1.0],
        }}
      />
      <Stack.Screen name="resetPassword" />
    </Stack>
  );
}
