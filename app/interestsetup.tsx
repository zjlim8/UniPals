import DefaultButton from "@/components/DefaultButton";
import { images } from "@/constants/images";
import React from "react";
import { Image, Text, View } from "react-native";

const interestsetup = () => {
  return (
    <View className="screen justify-between ">
      <View className="gap-5 mt-[80]">
        <Image source={images.interests} />
        <Text className="headtext text-left">What are your interests?</Text>
      </View>
      <DefaultButton
        mode="contained"
        onPress={() => console.log("Profile Setup Pressed")} // function to handle press button
      >
        Done
      </DefaultButton>
    </View>
  );
};

export default interestsetup;
