import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";
import "./globals.css";

export default function RootLayout() {
  return (
    <PaperProvider>
      <Stack>
        <Stack.Screen name="(navroutes)" options={{ headerShown: false }} />
        <Stack.Screen name="signup" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="verification" options={{ headerShown: false }} />
        <Stack.Screen name="loginpass" options={{ headerShown: false }} />
        <Stack.Screen name="welcome" options={{ headerShown: false }} />
        <Stack.Screen name="accountsetup" options={{ headerShown: false }} />
        <Stack.Screen name="interestsetup" options={{ headerShown: false }} />
        <Stack.Screen name="coursesetup" options={{ headerShown: false }} />
        <Stack.Screen name="clubsetup" options={{ headerShown: false }} />
        <Stack.Screen name="clubpage" options={{ headerShown: false }} />
        <Stack.Screen name="chatscreen" options={{ headerShown: false }} />
        <Stack.Screen name="friends" options={{ headerShown: false }} />
      </Stack>
    </PaperProvider>
  );
}
