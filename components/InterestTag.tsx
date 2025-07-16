import React from "react";
import { Text, View } from "react-native";

interface InterestTagProps {
  label: string;
}

export default function InterestTag({ label }: InterestTagProps) {
  return (
    <View className="self-start px-4 py-2 bg-white border border-headingtext rounded-[10]">
      <Text className="text-headingtext text-base text-center">{label}</Text>
    </View>
  );
}
