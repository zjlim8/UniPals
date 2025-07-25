import { images } from "@/constants/images";
import { Asset } from "expo-asset";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import React, { useEffect } from "react";
import {
  Alert,
  Keyboard,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { TextInput } from "react-native-paper";
import CustomTextInput from "../components/CustomTextInput";
import DefaultButton from "../components/DefaultButton";
import { auth } from "../firebaseSetup";

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
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      Alert.alert("Success", "Account created!", [
        {
          text: "OK",
          onPress: () => {
            router.push("/verification"); // Redirect user to verification page
          },
        },
      ]);
      await sendEmailVerification(userCredential.user);
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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="screen justify-between">
        <View className="items-center justify-center">
          <Image
            source={images.logoinvis}
            style={{ width: 100, height: 95, marginTop: 35, marginBottom: 100 }}
            contentFit="contain"
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
            textContentType="none"
            autoComplete="off"
            autoCorrect={false}
            importantForAutofill="no"
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
    </TouchableWithoutFeedback>
  );
};

export default signup;
