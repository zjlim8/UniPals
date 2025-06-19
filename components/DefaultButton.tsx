import React from "react";
import { Button } from "react-native-paper";

type DefaultButtonProps = React.ComponentProps<typeof Button>;

export default function DefaultButton(props: DefaultButtonProps) {
  return (
    <Button
      mode="contained"
      buttonColor="#3B82F6"
      textColor="#FDFDFD"
      contentStyle={{ borderRadius: 10, height: 55 }}
      {...props}
    />
  );
}
