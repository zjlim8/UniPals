import React from "react";
import { Button } from "react-native-paper";

interface ToggleButtonProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

export default function ToggleButton({
  label,
  selected,
  onPress,
}: ToggleButtonProps) {
  return (
    <Button
      mode={selected ? "contained" : "outlined"}
      buttonColor={selected ? "#3B82F6" : "transparent"}
      textColor={selected ? "#FDFDFD" : "#3B82F6"}
      onPress={onPress}
      compact
      style={{
        borderRadius: 10,
        margin: 4,
        borderColor: "#3B82F6",
        borderWidth: 1,
        paddingHorizontal: 3,
      }}
      contentStyle={{
        justifyContent: "center",
        alignItems: "center",
      }}
      labelStyle={{
        fontSize: 12,
        textAlign: "center",
        textAlignVertical: "center",
      }}
    >
      {label}
    </Button>
  );
}
