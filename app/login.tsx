import React from "react";
import { Image, Text, View } from "react-native";
import { PaperProvider, TextInput } from "react-native-paper";
import CustomTextInput from "../components/CustomTextInput";
import DefaultButton from "../components/DefaultButton";

const login = () => {
  const [text, setText] = React.useState("");
  return (
    <PaperProvider>
      <View className="screen justify-between">
        <Image
          source={require("../assets/images/logoinvis.png")}
          style={{ width: 100, height: 95 }}
          className="mt-[35] mb-[100] self-center"
        />
        <View className="flex-1 gap-2">
          <Text className="headtext mb-2">Log In</Text>
          <CustomTextInput
            label="Student ID"
            value={text}
            onChangeText={(text) => setText(text)}
            left={<TextInput.Icon icon="email" color="#90A4AE" />}
          />
        </View>
        <DefaultButton
          mode="contained"
          onPress={() => console.log("Pressed")} // function to handle press button
        >
          Next
        </DefaultButton>
      </View>
    </PaperProvider>
  );
};

export default login;
