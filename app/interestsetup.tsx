import DefaultButton from "@/components/DefaultButton";
import ToggleButton from "@/components/ToggleButton";
import { images } from "@/constants/images";
import { auth, db } from "@/firebaseSetup";
import { Image } from "expo-image";
import { router } from "expo-router";
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, Text, View } from "react-native";

const interestsetup = () => {
  const [interests, setInterests] = useState<any[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isExistingUser, setIsExistingUser] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Fetch available interests from clubs collection
        const querySnapshot = await getDocs(collection(db, "clubs"));
        const interestList = querySnapshot.docs.map((doc) => ({
          label: doc.data().tag,
        }));
        // Filtering duplicates
        const uniqueInterests = Array.from(
          new Set(interestList.map((i) => i.label))
        )
          .map((label) => interestList.find((i) => i.label === label))
          .sort((a, b) => (a?.label ?? "").localeCompare(b?.label ?? ""));
        setInterests(uniqueInterests);

        // Load existing user interests
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.interests && userData.interests.length > 0) {
            setSelectedInterests(userData.interests);
            setIsExistingUser(true);
          }
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleToggle = (label: string) => {
    setSelectedInterests((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
  };

  const handleInterestSetup = async () => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert("Error", "No user is logged in.");
      return;
    }

    try {
      if (selectedInterests.length === 0) {
        Alert.alert("Error", "Please select at least one interest.");
        return;
      }

      await setDoc(
        doc(db, "users", user.uid),
        {
          interests: selectedInterests,
        },
        { merge: true }
      );
      if (isExistingUser) {
        Alert.alert("Success", "Interests updated successfully!");
        router.back(); // Go back to edit profile
      } else {
        Alert.alert("Success", "Interests set successfully!", [
          {
            text: "OK",
            onPress: () => {
              router.replace("/welcome"); // Continue setup for new users
            },
          },
        ]);
      }
    } catch (error) {
      Alert.alert("Error", "Could not update interests.");
      return;
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
    <View className="flex-1 p-[25] bg-background justify-between ">
      <View className="flex-1 gap-5 mt-[80]">
        <Image
          source={images.interests}
          style={{
            width: 250,
            height: 220,
            alignItems: "center",
            alignSelf: "center",
          }}
        />
        <Text className="headtext text-left">
          {isExistingUser
            ? "Update your interests"
            : "What are your interests?"}
        </Text>
        <ScrollView
          className="flex-1 w-full h-full"
          contentContainerStyle={{ paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-row flex-wrap">
            {interests.map((interest) => (
              <ToggleButton
                key={interest.label}
                label={interest.label}
                selected={selectedInterests.includes(interest.label)}
                onPress={() => handleToggle(interest.label)}
              />
            ))}
          </View>
        </ScrollView>
      </View>
      <DefaultButton mode="contained" onPress={handleInterestSetup}>
        {isExistingUser ? "Update" : "Done"}
      </DefaultButton>
    </View>
  );
};

export default interestsetup;
