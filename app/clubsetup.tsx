import DefaultButton from "@/components/DefaultButton";
import DefaultMultiSelect from "@/components/DefaultMultiSelect";
import React from "react";
import { Keyboard, Text, TouchableWithoutFeedback, View } from "react-native";

const data = [
  { label: "Math", value: "math" },
  { label: "Science", value: "science" },
  { label: "History", value: "history" },
  { label: "English", value: "english" },
];

const clubsetup = () => {
  const [selected, setSelected] = React.useState<string[]>();

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <View className="screen justify-between">
        <View className="gap-2">
          <Text className="headtext mt-[120]">Are you in any clubs?</Text>
          <Text className="text-sm text-bodytext">
            Let us know if you are part of any clubs or societies to connect you
            with the right people!
          </Text>
          <View className="mt-[20] gap-3">
            <DefaultMultiSelect
              data={data}
              labelField="label"
              valueField="value"
              placeholder="Select Clubs"
              search
              searchPlaceholder="Search clubs..."
              value={selected}
              onChange={(item) => {
                setSelected(item);
              }}
            />
          </View>
        </View>
        <DefaultButton
          mode="contained"
          onPress={() => console.log("Pressed")} // function to handle press button
        >
          Done
        </DefaultButton>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default clubsetup;
