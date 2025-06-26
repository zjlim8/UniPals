import CustomTextInput from "@/components/CustomTextInput";
import DefaultButton from "@/components/DefaultButton";
import React from "react";
import { Keyboard, Text, TouchableWithoutFeedback, View } from "react-native";

const OPTIONS = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Other", value: "other" },
];

const accountsetup = () => {
  const [text, setText] = React.useState("");
  const [lastName, setLastName] = React.useState("");

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <View className="screen justify-between">
        <View className="gap-2">
          <Text className="headtext mt-[120]">Tell us more about you!</Text>
          <Text className="text-sm text-bodytext">
            Please enter your details to complete your profile
          </Text>

          <View className="gap-3">
            <View className="mt-[20] gap-1">
              <CustomTextInput
                label="First Name"
                value={text}
                onChangeText={(text) => setText(text)}
              />
              <CustomTextInput
                label="Last Name"
                value={lastName}
                onChangeText={(lastName) => setLastName(lastName)}
              />
            </View>
          </View>
        </View>
        <DefaultButton
          mode="contained"
          onPress={() => console.log("Pressed")} // function to handle press button
        >
          Next
        </DefaultButton>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default accountsetup;
