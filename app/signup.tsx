import { images } from "@/constants/images";
import { Asset } from "expo-asset";
import { useRouter } from "expo-router";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import React, { useEffect } from "react";
import { Alert, Image, Text, View } from "react-native";
import { PaperProvider, TextInput } from "react-native-paper";
import CustomTextInput from "../components/CustomTextInput";
import DefaultButton from "../components/DefaultButton";
import { auth } from "../firebase";

const signup = () => {
  const router = useRouter();
  const [studentID, setStudentID] = React.useState("");
  const [password, setPass] = React.useState("");
  const [confirmPassword, setConfPass] = React.useState("");
  const [showPassword, setShowPass] = React.useState(false);
  const [showConfPassword, setShowConfPass] = React.useState(false);

  const handleSignUp = async () => {
    const email = `${studentID}@imail.sunway.edu.my`;

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    try {
      console.log("Creating account for:", email, password, confirmPassword);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log(userCredential);
      Alert.alert("Success", "Account created!");
      await sendEmailVerification(userCredential.user);
      router.push("/verification"); // Redirect user to verification page
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("Registration Error", error.message);
      } else {
        Alert.alert("Registration Error", "An unknown error occurred.");
      }
    }
  };

  useEffect(() => {
    Asset.loadAsync([images.logoinvis]);
  }, []);

  return (
    <PaperProvider>
      <View className="screen justify-between">
        <View className="items-center justify-center">
          <Image
            source={images.logoinvis}
            style={{ width: 100, height: 95 }}
            className="mt-[35] mb-[100]"
            resizeMode="contain"
          />
        </View>
        <View className="flex-1 gap-2">
          <Text className="headtext mb-2">Create your account</Text>
          <CustomTextInput
            label="Student ID"
            value={studentID}
            onChangeText={(studentID) => setStudentID(studentID)}
            left={<TextInput.Icon icon="email" color="#90A4AE" />}
          />
          <CustomTextInput
            label="Password"
            value={password}
            onChangeText={(password) => setPass(password)}
            secureTextEntry={!showPassword}
            left={<TextInput.Icon icon="lock" color="#90A4AE" />}
            right={
              <TextInput.Icon
                icon={showPassword ? "eye-off" : "eye"}
                onPress={() => setShowPass(!showPassword)}
                color="#90A4AE"
              />
            }
          />
          <CustomTextInput
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={(confirmPassword) => setConfPass(confirmPassword)}
            secureTextEntry={!showConfPassword}
            left={<TextInput.Icon icon="lock" color="#90A4AE" />}
            right={
              <TextInput.Icon
                icon={showConfPassword ? "eye-off" : "eye"}
                onPress={() => setShowConfPass(!showConfPassword)}
                color="#90A4AE"
              />
            }
          />
        </View>
        <DefaultButton
          mode="contained"
          onPress={handleSignUp} // function to handle press button
        >
          Sign Up
        </DefaultButton>
      </View>
    </PaperProvider>
  );
};

export default signup;
