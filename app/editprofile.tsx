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
          titleStyle={{ fontWeight: "600" }}
          left={(props) => (
            <List.Icon {...props} icon="account" color="#3B82F6" />
          )}
          onPress={() => router.push("/accountsetup")}
        />
        <List.Item
          title="Course Information"
          description="Change your course information"
          titleStyle={{ fontWeight: "600" }}
          left={(props) => (
            <List.Icon {...props} icon="school" color="#3B82F6" />
          )}
          onPress={() => router.push("/coursesetup")}
        />
        <List.Item
          title="Bio"
          description="Change your bio"
          titleStyle={{ fontWeight: "600" }}
          left={(props) => <List.Icon {...props} icon="text" color="#3B82F6" />}
          onPress={() => router.push("/biosetup")}
        />
        <List.Item
          title="Interests"
          description="Change your interests"
          titleStyle={{ fontWeight: "600" }}
          left={(props) => <List.Icon {...props} icon="star" color="#3B82F6" />}
          onPress={() => router.push("/interestsetup")}
        />
        <List.Item
          title="Privacy Settings"
          description="Control who can see your profile"
          titleStyle={{ fontWeight: "600" }}
          left={(props) => (
            <List.Icon {...props} icon="shield-account" color="#3B82F6" />
          )}
          onPress={() => router.push("/privacysettings")}
        />
      </List.Section>
    </View>
  );
};

export default editprofile;
