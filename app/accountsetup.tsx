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
  const [gender, setGender] = React.useState<string>();

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <View className="screen justify-between">
        <View>
          <Text className="headtext mb-2">Tell us more about you!</Text>
          <Text className="text-sm text-bodytext">
            Please enter your details to complete your profile
          </Text>
        </View>
        <View className="gap-3">
          <CustomTextInput
            label="First Name"
            value={text}
            onChangeText={(text) => setText(text)}
          />
          <CustomTextInput
            label="Last Name"
            value={text}
            onChangeText={(text) => setText(text)}
          />
          <CustomTextInput
            label="Course"
            value={text}
            onChangeText={(text) => setText(text)}
          />
          <CustomTextInput
            label="Semester"
            value={text}
            onChangeText={(text) => setText(text)}
          />
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
