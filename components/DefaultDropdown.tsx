import React from "react";
import { Dropdown } from "react-native-element-dropdown";

type DropdownProps = React.ComponentProps<typeof Dropdown>;

export default function DefaultDropdown(props: DropdownProps) {
  return (
    <Dropdown
      style={{
        borderWidth: 1,
        borderColor: "#90A4AE",
        borderRadius: 4,
        padding: 18,
      }}
      selectedTextStyle={{ color: "#000000" }}
      placeholderStyle={{ color: "#C7C7CD" }}
      containerStyle={{ borderRadius: 8 }}
      {...props}
    />
  );
}
