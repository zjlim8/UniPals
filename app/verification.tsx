import DefaultButton from "@/components/DefaultButton";
import { Asset } from "expo-asset";
import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const verification = () => {
  const [code, setCode] = useState(["", "", "", ""]);
  const inputs = useRef<Array<TextInput | null>>([]);

  const handleChange = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);
    if (text && index < 3) {
      inputs.current[index + 1]?.focus();
    }
  };

  useEffect(() => {
    Asset.loadAsync([require("../assets/images/logoinvis.png")]);
  }, []);

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <View className="screen justify-between">
        <View>
          <View className="items-center justify-center">
            <Image
              source={require("../assets/images/logoinvis.png")}
              style={{ width: 100, height: 95 }}
              className="mt-[35] mb-[100] self-center"
            />
          </View>
          <Text className="headtext text-center mb-2">
            Enter Verification Code
          </Text>

          <Text className="text-sm text-auxiliary text-center mb-6">
            We have sent the verification code to
            <Text className="font-semibold text-headingtext"> </Text>
          </Text>

          <View className="flex-row justify-center gap-4 mb-4">
            {code.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  inputs.current[index] = ref;
                }}
                value={digit}
                maxLength={1}
                keyboardType="number-pad"
                onChangeText={(text) => handleChange(text, index)}
                className="w-20 h-24 border border-auxiliary rounded-2xl text-center text-2xl"
              />
            ))}
          </View>

          <TouchableOpacity>
            <Text className="text-sm text-auxiliary text-center">
              Didn't receive the code?{" "}
              <Text className="underline text-sm text-headingtext">
                Resend Code
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
        <View>
          <DefaultButton onPress={() => console.log("Verify Now")}>
            Verify Now
          </DefaultButton>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default verification;
