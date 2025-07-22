import DefaultButton from "@/components/DefaultButton";
import { images } from "@/constants/images";
import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

const welcome = () => {
  return (
    <View className="screen justify-between ">
      <View className="gap-5 mt-[120]">
        <Image
          source={images.welcome}
          style={{
            width: 250,
            height: 220,
            alignItems: "center",
            alignSelf: "center",
          }}
        />
        <Text className="headtext text-center">Welcome to UniPals!</Text>
        <Text className="text-sm text-bodytext text-center">
          You're all done! You can now start connecting with like-minded
          individuals!
        </Text>
      </View>
      <DefaultButton
        mode="contained"
        onPress={() => {
          router.replace("/(navroutes)");
        }} // function to handle press button
      >
        Get Started
      </DefaultButton>
    </View>
  );
};

export default welcome;
