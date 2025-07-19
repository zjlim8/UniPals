import DefaultButton from "@/components/DefaultButton";
import { images } from "@/constants/images";
import { db } from "@/firebase";
import { router } from "expo-router";
import { getAuth } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Keyboard,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const biosetup = () => {
  const [bio, setBio] = useState("");
  const currentUser = getAuth().currentUser;

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
      Alert.alert("Success", "Bio updated successfully!");
      router.replace("/(navroutes)");
    } catch (error) {
      Alert.alert("Error", "Something went wrong!");
    }
  };

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
            source={images.biosetup}
          />
          <Text className="headtext mb-[10]">📝 Tell us about yourself!</Text>
          <Text className="text-base text-bodytext text-justify">
            This helps others understand who you are and what you're looking for
            in a friend!
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
            Next
          </DefaultButton>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default biosetup;
