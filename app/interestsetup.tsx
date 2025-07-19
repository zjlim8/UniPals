import DefaultButton from "@/components/DefaultButton";
import ToggleButton from "@/components/ToggleButton";
import { images } from "@/constants/images";
import { auth, db } from "@/firebase";
import { router } from "expo-router";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import React, { useEffect } from "react";
import { Alert, Image, ScrollView, Text, View } from "react-native";

const interestsetup = () => {
  const [interests, setInterests] = React.useState<any[]>([]);
  const [selectedInterests, setSelectedInterests] = React.useState<string[]>(
    []
  );

  useEffect(() => {
    const fetchInterests = async () => {
      try {
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
      } catch (error) {
        console.error("Failed to fetch interests:", error);
      }
    };
    fetchInterests();
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
      if (interests.length === 0) {
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
      Alert.alert("Success", "Interest setup completed!");
      router.replace("/(navroutes)");
    } catch (error) {
      Alert.alert("Error", "Could not set up interests.");
      return;
    }
  };

  return (
    <View className="flex-1 p-[25] bg-background justify-between ">
      <View className="flex-1 gap-5 mt-[80]">
        <Image source={images.interests} />
        <Text className="headtext text-left">What are your interests?</Text>
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
      <DefaultButton
        mode="contained"
        onPress={handleInterestSetup} // function to handle press button
      >
        Done
      </DefaultButton>
    </View>
  );
};

export default interestsetup;
