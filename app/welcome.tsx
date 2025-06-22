import DefaultButton from "@/components/DefaultButton";
import { images } from "@/constants/images";
import React from "react";
import { Image, Text, View } from "react-native";

const welcome = () => {
  return (
    <View className="screen justify-between ">
      <View className="gap-5 mt-[120]">
        <Image source={images.welcome} />
        <Text className="headtext text-center">Welcome to UniPals!</Text>
        <Text className="text-sm text-bodytext text-center">
          Set up your profile and start discovering awesome people around you!
        </Text>
      </View>
      <DefaultButton
        mode="contained"
        onPress={() => console.log("Profile Setup Pressed")} // function to handle press button
      >
        Get Started
      </DefaultButton>
    </View>
  );
};

export default welcome;
