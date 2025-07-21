import DefaultButton from "@/components/DefaultButton";
import DefaultMultiSelect from "@/components/DefaultMultiSelect";
import { auth, db } from "@/firebaseSetup";
import { router } from "expo-router";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import React, { useEffect } from "react";
import {
  Alert,
  Keyboard,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const clubsetup = () => {
  const [selectedClubs, setSelected] = React.useState<string[]>([]);
  const [clubs, setClubs] = React.useState<any[]>([]);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "clubs"));
        const clubList = querySnapshot.docs.map((doc) => ({
          label: doc.data().name,
          value: doc.data().code,
        }));
        setClubs(clubList);
      } catch (error) {
        console.error("Failed to fetch clubs:", error);
      }
    };

    fetchClubs();
  }, []);

  const handleClubSetup = async () => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert("Error", "No user is logged in.");
      return;
    }

    try {
      if (selectedClubs.length === 0) {
        Alert.alert("Error", "Please select at least one club.");
        return;
      }

      // Setting up clubs for user
      await setDoc(
        doc(db, "users", user.uid),
        {
          clubs: selectedClubs,
        },
        { merge: true }
      );
      Alert.alert("Success", "Club setup completed!");
      router.replace("/(navroutes)"); // Redirect to home
    } catch (error) {
      Alert.alert("Error", "Could not set up clubs.");
      return;
    }
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <View className="screen justify-between">
        <ScrollView className="gap-2 mb-5">
          <Text className="headtext mt-[120]">Are you in any clubs?</Text>
          <Text className="text-sm text-bodytext">
            Let us know if you are part of any clubs or societies to connect you
            with the right people!
          </Text>
          <View className="mt-[20] gap-3">
            <DefaultMultiSelect
              data={clubs}
              labelField="label"
              valueField="value"
              placeholder="Select Clubs"
              search
              searchPlaceholder="Search clubs..."
              value={selectedClubs}
              onChange={(item) => {
                setSelected(item);
              }}
            />
          </View>
        </ScrollView>
        <DefaultButton
          mode="contained"
          onPress={handleClubSetup} // function to handle press button
        >
          Done
        </DefaultButton>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default clubsetup;
