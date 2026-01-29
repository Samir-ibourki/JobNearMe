import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePushNotifications } from "../hooks/usePushNotifications";
import { useMemo } from "react";
function PushNotificationInitializer() {
  usePushNotifications();
  return null;
}
export default function Layout() {
  const queryClient = useMemo(() => new QueryClient(), []);
  return (
    <QueryClientProvider client={queryClient}>
      <PushNotificationInitializer />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(candidate)" />
        <Stack.Screen name="(employer)" />
        <Stack.Screen name="notifications" />
      </Stack>
    </QueryClientProvider>
  );
}
