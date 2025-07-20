import { router } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
import { List } from "react-native-paper";

const editprofile = () => {
  return (
    <View className="pt-[75] px-5">
      <Text className="headtext">Edit Profile</Text>
      <List.Section>
        <List.Item
          title="Name"
          description="Change your name"
          left={(props) => <List.Icon {...props} icon="account" />}
          onPress={() => router.push("/accountsetup")}
        />
        <List.Item
          title="Course Information"
          description="Change your course information"
          left={(props) => <List.Icon {...props} icon="school" />}
          onPress={() => router.push("/coursesetup")}
        />
        <List.Item
          title="Bio"
          description="Change your bio"
          left={(props) => <List.Icon {...props} icon="text" />}
          onPress={() => router.push("/biosetup")}
        />
        <List.Item
          title="Interests"
          description="Change your interests"
          left={(props) => <List.Icon {...props} icon="star" />}
          onPress={() => router.push("/interestsetup")}
        />
      </List.Section>
    </View>
  );
};

export default editprofile;
