import CustomTextInput from "@/components/CustomTextInput";
import DefaultButton from "@/components/DefaultButton";
import { auth, db } from "@/firebase";
import { router } from "expo-router";
import { doc, setDoc } from "firebase/firestore";
import React from "react";
import {
  Alert,
  Keyboard,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const accountsetup = () => {
  const [text, setText] = React.useState("");
  const [lastName, setLastName] = React.useState("");

  const handleAccountSetup = async () => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert("Error", "No user is logged in.");
      return;
    }

    try {
      await setDoc(
        doc(db, "users", user.uid),
        {
          firstName: text,
          lastName: lastName,
        },
        { merge: true } // Merge to update existing fields without overwriting the entire document
      );
      Alert.alert("Success", "Profile updated!");
      console.log("Profile updated:");
      router.replace("/coursesetup"); // Redirect to course setup page
    } catch (error) {
      Alert.alert("Error", "Could not save profile.");
    }
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <View className="screen justify-between">
        <View className="gap-2">
          <Text className="headtext mt-[120]">Tell us more about you!</Text>
          <Text className="text-sm text-bodytext">
            Please enter your details to complete your profile
          </Text>

          <View className="gap-3">
            <View className="mt-[20] gap-1">
              <CustomTextInput
                label="First Name"
                value={text}
                onChangeText={(text) => setText(text)}
              />
              <CustomTextInput
                label="Last Name"
                value={lastName}
                onChangeText={(lastName) => setLastName(lastName)}
              />
            </View>
          </View>
        </View>
        <DefaultButton
          mode="contained"
          onPress={handleAccountSetup} // function to handle press button
        >
          Next
        </DefaultButton>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default accountsetup;
