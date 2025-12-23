import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
export default function Layout() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding/index" />
        <Stack.Screen name="(auth)/logIn" />
        <Stack.Screen name="(auth)/signUp" />
        <Stack.Screen
          name="(auth)/forgotPassword"
          options={{
            presentation: "formSheet",
            animation: "fade_from_bottom",
            gestureDirection: "vertical",
            sheetGrabberVisible: true,
            sheetCornerRadius: 25,
            sheetAllowedDetents: [0.5, 1.0],
          }}
        />
        <Stack.Screen name="onboarding/lastOnboard" />
        <Stack.Screen name="home" />
      </Stack>
    </QueryClientProvider>
  );
}
