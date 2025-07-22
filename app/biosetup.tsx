import DefaultButton from "@/components/DefaultButton";
import { images } from "@/constants/images";
import { db } from "@/firebaseSetup";
import { Image } from "expo-image";
import { router } from "expo-router";
import { getAuth } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const biosetup = () => {
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(true);
  const [isExistingUser, setIsExistingUser] = useState(false);
  const currentUser = getAuth().currentUser;

  useEffect(() => {
    const loadUserData = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.bio) {
            setBio(userData.bio);
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

  const handleBioSetup = async () => {
    if (!currentUser) {
      Alert.alert("Error", "Please login to continue");
      return;
    }
    try {
      await setDoc(
        doc(db, "users", currentUser.uid),
        {
          bio: bio.trim(),
        },
        { merge: true }
      );
      if (isExistingUser) {
        Alert.alert("Success", "Bio updated successfully!");
        router.back(); // Go back to edit profile
      } else {
        Alert.alert("Success", "Bio set successfully!", [
          {
            text: "OK",
            onPress: () => {
              router.replace("/interestsetup"); // Continue to main app for new users
            },
          },
        ]);
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong!");
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
        <View>
          <Image
            className="w-[250] h-[220] mb-5 items-center self-center"
            style={{
              width: 250,
              height: 220,
              marginBottom: 20,
              alignItems: "center",
              alignSelf: "center",
            }}
            source={images.biosetup}
          />
          <Text className="headtext mb-[10]">
            {isExistingUser
              ? "📝 Update your bio!"
              : "📝 Tell us about yourself!"}
          </Text>
          <Text className="text-base text-bodytext text-justify">
            {isExistingUser
              ? "Update your bio to let others know more about you!"
              : "This helps others understand who you are and what you're looking for in a friend!"}
          </Text>
          <TextInput
            className="bg-white p-4 rounded-xl border border-auxiliary text-base min-h-[150] text-bodytext mt-[25]"
            multiline
            numberOfLines={6}
            placeholder="Write something about yourself..."
            placeholderTextColor="#90A4AE"
            value={bio}
            onChangeText={setBio}
            textAlignVertical="top"
            maxLength={500}
            cursorColor="#90A4AE"
            selectionColor="#90A4AE"
          />
        </View>
        <View>
          <DefaultButton mode="contained" onPress={handleBioSetup}>
            {isExistingUser ? "Update" : "Next"}
          </DefaultButton>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default biosetup;
