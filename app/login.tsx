import { images } from "@/constants/images";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import React from "react";
import {
  Alert,
  Keyboard,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { TextInput } from "react-native-paper";
import CustomTextInput from "../components/CustomTextInput";
import DefaultButton from "../components/DefaultButton";
import { auth, db } from "../firebaseSetup";

const login = () => {
  const [studentID, setStudentID] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [checking, setChecking] = React.useState(false);
  const [showPassword, setShowPass] = React.useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setChecking(true);
    const trimmedStudentID = studentID.trim();
    const email = `${trimmedStudentID}@imail.sunway.edu.my`;
    const passwordTrimmed = password.trim();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        passwordTrimmed
      );
      setChecking(false);
      if (!userCredential.user.emailVerified) {
        Alert.alert("Email not verified", "Please verify before logging in.");
        return;
      }

      // Check Firestore for first and last name
      const userDocRef = doc(db, "users", userCredential.user.uid);
      const userDoc = await getDoc(userDocRef);

      if (
        !userDoc.exists() ||
        !userDoc.data().firstName ||
        !userDoc.data().lastName
      ) {
        router.replace("/accountsetup");
      } else {
        router.replace("/(navroutes)");
      }
    } catch (err: any) {
      Alert.alert("Login failed", "Something went wrong.");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="screen justify-between">
        <View className="items-center justify-center">
          <Image
            source={images.logoinvis}
            style={{
              width: 100,
              height: 95,
              marginTop: 35,
              marginBottom: 100,
            }}
          />
        </View>
        <View className="flex-1 gap-2">
          <Text className="headtext mb-2">Log In</Text>
          <CustomTextInput
            label="Student ID"
            value={studentID}
            onChangeText={(studentID) => setStudentID(studentID)}
            left={<TextInput.Icon icon="email" color="#90A4AE" />}
          />
          <CustomTextInput
            label="Password"
            value={password}
            secureTextEntry={!showPassword}
            onChangeText={(password) => setPassword(password)}
            left={<TextInput.Icon icon="lock" color="#90A4AE" />}
            right={
              <TextInput.Icon
                icon={showPassword ? "eye-off" : "eye"}
                onPress={() => setShowPass(!showPassword)}
                color="#90A4AE"
              />
            }
          />
          <View className="flex-row items-center mt-4 text-bodytext">
            <Text>Don't have an account? </Text>
            <TouchableOpacity
              className="underline text-auxiliary"
              onPress={() => router.push("/signup")}
            >
              <Text className="text-auxiliary underline">Sign up here</Text>
            </TouchableOpacity>
          </View>
        </View>
        <DefaultButton
          mode="contained"
          onPress={handleLogin} // function to handle press button
          loading={checking}
        >
          Next
        </DefaultButton>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default login;
