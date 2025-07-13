import React from "react";
import { StyleSheet } from "react-native";
import { Dropdown } from "react-native-element-dropdown";

type DropdownSelectProps = React.ComponentProps<typeof Dropdown>;

export default function DropdownSearch(props: DropdownSelectProps) {
  return (
    <Dropdown
      style={[styles.dropdown, props.style]}
      placeholderStyle={[styles.placeholderStyle, props.placeholderStyle]}
      selectedTextStyle={[styles.selectedTextStyle, props.selectedTextStyle]}
      inputSearchStyle={[styles.inputSearchStyle, props.inputSearchStyle]}
      iconStyle={[styles.iconStyle, props.iconStyle]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  dropdown: {
    height: 60,
    borderColor: "#90A4AE",
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 17,
    backgroundColor: "#FFFFFF",
  },
  placeholderStyle: {
    fontSize: 16,
    color: "#C7C7CD",
  },
  selectedTextStyle: {
    fontSize: 16,
    color: "#1F2937",
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    borderColor: "#90A4AE",
    borderRadius: 6,
    paddingHorizontal: 8,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
});
