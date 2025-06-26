import { images } from "@/constants/images";
import { Link } from "expo-router";
import { Image, Text, View } from "react-native";
import { PaperProvider } from "react-native-paper";

export default function Index() {
  return (
    <PaperProvider>
      <View className="flex-1 justify-center items-center gap-10">
        <Image
          source={images.logoinvis}
          style={{ width: 100, height: 95 }}
          className="mt-[35] mb-[100]"
          resizeMode="contain"
        />
        <Text>UniPals</Text>
        <Link href="/signup">Signup</Link>
        <Link href="/login">Login</Link>
        <Link href="/verification">Verify</Link>
        <Link href="/loginpass">LoginPass</Link>
        <Link href="/welcome">Welcome</Link>
        <Link href="/accountsetup">Account Setup</Link>
        <Link href="/interestsetup">Interest Setup</Link>
        <Link href="/coursesetup">Course Setup</Link>
        <Link href="/clubsetup">Club Setup</Link>
      </View>
    </PaperProvider>
  );
}
