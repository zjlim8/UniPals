import { router } from "expo-router";
import React from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Avatar, Chip } from "react-native-paper";

const screenWidth = Dimensions.get("window").width;
const interests = [
  "Technology",
  "Business",
  "Marketing",
  "Calisthenics",
  "MMA",
];
const clubs = [
  "MMA Club",
  "Sunway Tech Club",
  "Technology",
  "Business",
  "Marketing",
  "Calisthenics",
  "MMA",
];

const Profile = () => {
  return (
    <ScrollView style={styles.container}>
      {/* Background Image */}
      <View>
        <Image
          source={{
            uri: "https://upload.wikimedia.org/wikipedia/commons/3/3f/The_Soviet_Union_1937_CPA_551_sheet_of_4_%284_x_Palace_of_the_Soviets%29_%28cropped%29.jpg",
          }} // replace with your own
          className="w-full h-[250]"
        />
        {/* Profile Image */}
        <Avatar.Image
          size={100}
          source={{ uri: "https://randomuser.me/api/portraits/men/75.jpg" }} // replace with your own
          className="absolute bottom-[-50] left-[50%] translate-x-[-50%] border-white border-3"
        />
      </View>

      {/* Name and Details */}
      <View className="px-5 pt-[60]">
        <Text className="text-2xl text-black text-center font-bold">
          Lim Zi Jie
        </Text>
        <Text className="text-lg text-center text-headingtext mx-[15]">
          Bachelor of Software Engineering (Hons)
        </Text>
        <Text className="text-lg text-center text-headingtext mx-[15]">
          Year 2 Semester 3
        </Text>

        {/* Bio */}
        <Text className="text-justify mt-3 mx-[15] text-bodytext text-sm">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean eu
          nisl vitae nulla pretium posuere...
        </Text>

        {/* Interests */}
        <Text className="text-2xl text-primary font-bold mt-5 mx-[15]">
          Interests
        </Text>
        <View className="flex-row flex-wrap gap-2 mt-2 mx-[15]">
          {interests.map((item, index) => (
            <Chip
              key={index}
              style={styles.chip}
              textStyle={{ color: "#323232" }}
            >
              {item}
            </Chip>
          ))}
        </View>

        {/* "Friends" */}
        <View className="flex-row justify-between mr-[15]">
          <Text className="text-2xl text-primary font-bold mt-5 mx-[15]">
            Your Friends
          </Text>
          <TouchableOpacity
            className="flex self-end mt-5"
            onPress={() => {
              router.push("/friends");
            }}
          >
            <Text className="text-primary font-semibold">See all</Text>
          </TouchableOpacity>
        </View>

        <View className="mx-[15]" style={styles.chipContainer}>
          {clubs.slice(0, 5).map((item, index) => (
            <Chip
              key={index}
              style={styles.chip}
              textStyle={{ color: "#323232" }}
            >
              {item}
            </Chip>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FDFDFD",
  },
  backgroundImage: {
    width: screenWidth,
    height: 250,
  },
  avatar: {
    position: "absolute",
    bottom: -50,
    left: screenWidth / 2 - 50,
    borderColor: "white",
    borderWidth: 3,
  },
  detailsContainer: {
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  name: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#555",
  },
  bio: {
    textAlign: "center",
    marginTop: 15,
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 30,
    marginBottom: 10,
    color: "#3B82F6",
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    margin: 4,
    borderColor: "#323232",
    borderWidth: 1,
    backgroundColor: "#fff",
  },
});

export default Profile;
