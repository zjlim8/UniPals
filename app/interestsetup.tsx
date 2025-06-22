import DefaultButton from "@/components/DefaultButton";
import ToggleButton from "@/components/ToggleButton";
import { images } from "@/constants/images";
import React from "react";
import { Image, ScrollView, Text, View } from "react-native";

const interestsetup = () => {
  return (
    <View className="screen justify-between ">
      <View className="flex-1 gap-5 mt-[80]">
        <Image source={images.interests} />
        <Text className="headtext text-left">What are your interests?</Text>
        <ScrollView
          className="flex-1 w-full h-full"
          contentContainerStyle={{ paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-row flex-wrap">
            <ToggleButton
              label="Business"
              selected={false}
              onPress={() => console.log("Technology Pressed")}
            />
            <ToggleButton
              label="Chess"
              selected={true}
              onPress={() => console.log("Technology Pressed")}
            />
            <ToggleButton
              label="MMA"
              selected={true}
              onPress={() => console.log("Technology Pressed")}
            />
          </View>
        </ScrollView>
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
