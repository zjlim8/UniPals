import CustomCard from "@/components/CustomCard";
import { db } from "@/firebase";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "expo-router";
import { collection, getDocs } from "firebase/firestore";
import React, { useEffect } from "react";
import { Keyboard, ScrollView, TouchableOpacity, View } from "react-native";
import { Searchbar } from "react-native-paper";

type RootStackParamList = {
  clubpage: { clubId: string };
};

const Clubs = () => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [clubs, setClubs] = React.useState<any[]>([]);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "clubs"));
        const clubList = querySnapshot.docs.map((doc) => ({
          id: doc.data().code,
          name: doc.data().name,
          description: doc.data().description,
          image: doc.data().image,
          tag: doc.data().tag,
          social: doc.data().social,
        }));
        setClubs(clubList);
      } catch (error) {
        console.error("Failed to fetch clubs:", error);
      }
    };
    fetchClubs();
  }, []);

  // Optional: filter clubs by search query
  const filteredClubs = clubs.filter((club) =>
    club.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View className="screen flex-1">
      <Searchbar
        placeholder="Search"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={{
          backgroundColor: "#FFFFFF",
          borderWidth: 1,
          borderRadius: 12,
          borderColor: "#90A4AE",
          width: "100%",
          marginBottom: 20,
        }}
        onBlur={Keyboard.dismiss}
      />
      <ScrollView
        className="w-full flex-1"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View className="w-full gap-8 p-1">
          {filteredClubs.map((club) => (
            <TouchableOpacity
              key={club.id}
              onPress={() =>
                navigation.navigate("clubpage", { clubId: club.id })
              }
              activeOpacity={0.8}
            >
              <CustomCard
                key={club.id}
                imageUrl={club.image}
                title={club.name}
                description={club.description}
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default Clubs;
