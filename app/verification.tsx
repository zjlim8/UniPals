import DefaultButton from "@/components/DefaultButton";
import { images } from "@/constants/images";
import { Asset } from "expo-asset";
import { useRouter } from "expo-router";
import { reload, signOut } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Keyboard,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { auth, db } from "../firebaseSetup";

const Verification = () => {
  const [email, setEmail] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);
  const router = useRouter();

  useEffect(() => {
    Asset.loadAsync([images.logoinvis]);
    if (auth.currentUser?.email) {
      setEmail(auth.currentUser.email);
    }
  }, []);

  const handleCheckVerification = async () => {
    if (!auth.currentUser) return;

    setChecking(true);
    try {
      await reload(auth.currentUser);
      if (auth.currentUser.emailVerified) {
        const user = auth.currentUser;
        const email = user.email ?? "";
        const studentID = email.split("@")[0];

        await setDoc(
          doc(db, "users", user.uid),
          {
            email,
            studentID,
          },
          { merge: true }
        );
        await signOut(auth);
        router.push("/login"); // Redirect to login page
      } else {
        Alert.alert(
          "Not Verified",
          "Please verify your email before continuing."
        );
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Something went wrong while checking verification.");
    }
    setChecking(false);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="screen justify-between">
        <View>
          <View className="items-center justify-center">
            <Image
              source={images.logoinvis}
              style={{ width: 100, height: 95 }}
              className="mt-[35] mb-[100] self-center"
            />
          </View>

          <Text className="headtext text-center mb-2">Verify Your Email</Text>
          <Text className="text-sm text-auxiliary text-center mb-6">
            We have sent a verification link to{" "}
            <Text className="font-semibold text-headingtext">{email}</Text>.{" "}
            Please click the link to activate your account.
          </Text>

          <Text className="text-sm text-center text-auxiliary mb-6">
            After verifying, tap the button below.
          </Text>
        </View>

        <View>
          <DefaultButton onPress={handleCheckVerification} loading={checking}>
            I've Verified My Email
          </DefaultButton>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Verification;
