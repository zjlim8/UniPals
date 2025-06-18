import { Stack } from "expo-router";
import "./globals.css";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(navroutes)" options={{ headerShown: false }} />
    </Stack>
  );
}
