import CustomTextInput from "@/components/CustomTextInput";
import DefaultButton from "@/components/DefaultButton";
import { auth, db } from "@/firebaseSetup";
import { router } from "expo-router";
import { doc, getDoc, setDoc } from "firebase/firestore";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const accountsetup = () => {
  const [text, setText] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [isExistingUser, setIsExistingUser] = React.useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.firstName || userData.lastName) {
            setText(userData.firstName || "");
            setLastName(userData.lastName || "");
            setIsExistingUser(true);
          }
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

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
        { merge: true }
      );
      if (isExistingUser) {
        Alert.alert("Success", "Profile updated!");
        router.back(); // Go back to edit profile
      } else {
        Alert.alert("Success", "Account created!", [
          {
            text: "OK",
            onPress: () => {
              router.push("/verification"); // Redirect user to verification page
            },
          },
        ]);
      }
    } catch (error) {
      Alert.alert("Error", "Could not save profile.");
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <View className="screen justify-between">
        <View className="gap-2">
          <Text className="headtext mt-[120]">
            {isExistingUser ? "Change your Name" : "Tell us more about you!"}
          </Text>
          <Text className="text-sm text-bodytext">
            {isExistingUser
              ? "Please enter your preferred name"
              : "Please enter your details to complete your profile"}
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
        <DefaultButton mode="contained" onPress={handleAccountSetup}>
          {isExistingUser ? "Update" : "Next"}
        </DefaultButton>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default accountsetup;
