import React from "react";
import { TextInput } from "react-native-paper";

type CustomInputProps = React.ComponentProps<typeof TextInput>;

export default function CustomInput(props: CustomInputProps) {
  return (
    <TextInput
      mode="outlined"
      textColor="#000000"
      outlineColor="#90A4AE"
      activeOutlineColor="#3B82F6"
      style={[{ backgroundColor: "#FFFFFF", height: 55 }, props.style]}
      {...props}
    />
  );
}
