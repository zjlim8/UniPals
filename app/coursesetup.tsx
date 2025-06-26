import DefaultButton from "@/components/DefaultButton";
import DefaultDropdown from "@/components/DefaultDropdown";
import React from "react";
import { Keyboard, Text, TouchableWithoutFeedback, View } from "react-native";

const OPTIONS = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Other", value: "other" },
];

const coursesetup = () => {
  const [gender, setGender] = React.useState<string>();

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <View className="screen justify-between">
        <View className="gap-2">
          <Text className="headtext mt-[120]">Which course are you in?</Text>
          <Text className="text-sm text-bodytext">
            Let us know your course and semester to connect you with the right
            people!
          </Text>
          <View className="mt-[20] gap-3">
            <DefaultDropdown
              placeholder="Select Course"
              data={OPTIONS}
              labelField="label"
              valueField="value"
              value={gender}
              onChange={(item) => setGender(item.value)}
            />
            <DefaultDropdown
              placeholder="Select Semester"
              data={OPTIONS}
              labelField="label"
              valueField="value"
              value={gender}
              onChange={(item) => setGender(item.value)}
            />
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

export default coursesetup;
