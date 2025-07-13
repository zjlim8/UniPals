import DefaultButton from "@/components/DefaultButton";
import ToggleButton from "@/components/ToggleButton";
import { images } from "@/constants/images";
import { auth, db } from "@/firebase";
import { router } from "expo-router";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import React, { useEffect } from "react";
import { Alert, Image, ScrollView, Text, View } from "react-native";

// const interests = [
//   { label: "Academic & Research", value: "1" },
//   { label: "Animal Welfare", value: "2" },
//   { label: "Arts & Performance", value: "3" },
//   { label: "Automotive & Transportation", value: "4" },
//   { label: "Business & Finance", value: "5" },
//   { label: "Community Service", value: "6" },
//   { label: "Cultural & Heritage", value: "7" },
//   { label: "Entertainment & Pop Culture", value: "8" },
//   { label: "Environmental & Sustainability", value: "9" },
//   { label: "Faith & Spirituality", value: "10" },
//   { label: "Food & Culinary", value: "11" },
//   { label: "Games & Recreation", value: "12" },
//   { label: "Innovation & Entrepreneurship", value: "13" },
//   { label: "International & Community", value: "14" },
//   { label: "Language & Communication", value: "15" },
//   { label: "Leadership & Governance", value: "16" },
//   { label: "Literature & Reading", value: "17" },
//   { label: "Martial Arts", value: "18" },
//   { label: "Media & Communications", value: "19" },
//   { label: "Social & Networking", value: "20" },
//   { label: "Social Justice & Advocacy", value: "21" },
//   { label: "Sports & Recreation", value: "22" },
// ];

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
