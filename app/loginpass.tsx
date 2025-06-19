import React from "react";
import { Image, View } from "react-native";
import { PaperProvider, TextInput } from "react-native-paper";
import CustomTextInput from "../components/CustomTextInput";
import DefaultButton from "../components/DefaultButton";

const loginpass = () => {
  const [text, setText] = React.useState("");
  return (
    <PaperProvider>
      <View className="screen justify-between">
        {/* Change to Profile Picture */}
        <Image
          source={require("../assets/images/logoinvis.png")}
          style={{ width: 100, height: 95 }}
          className="mt-[35] mb-[100] self-center"
        />
        <View className="flex-1 gap-2">
          <CustomTextInput
            label="Password"
            value={text}
            onChangeText={(text) => setText(text)}
            left={<TextInput.Icon icon="lock" color="#90A4AE" />}
          />
        </View>
        <DefaultButton
          mode="contained"
          onPress={() => console.log("Pressed")} // function to handle press button
        >
          Log In
        </DefaultButton>
      </View>
    </PaperProvider>
  );
};

export default loginpass;
