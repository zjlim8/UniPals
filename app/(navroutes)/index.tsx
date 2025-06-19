import { Link } from "expo-router";
import { Text, View } from "react-native";
import { PaperProvider } from "react-native-paper";

export default function Index() {
  return (
    <PaperProvider>
      <View className="flex-1 justify-center items-center">
        <Text>UniPals</Text>
        <Link href="/signup">Signup</Link>
        <Link href="/login">Login</Link>
        <Link href="/verification">Verify</Link>
        <Link href="/loginpass">LoginPass</Link>
      </View>
    </PaperProvider>
  );
}
