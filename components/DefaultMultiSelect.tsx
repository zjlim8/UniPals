import React from "react";
import { StyleSheet } from "react-native";
import { MultiSelect } from "react-native-element-dropdown";

type MultiSelectProps = React.ComponentProps<typeof MultiSelect>;

export default function DefaultMultiSelect(props: MultiSelectProps) {
  return (
    <MultiSelect
      style={[styles.dropdown, props.style]}
      placeholderStyle={[styles.placeholderStyle, props.placeholderStyle]}
      selectedTextStyle={[styles.selectedTextStyle, props.selectedTextStyle]}
      inputSearchStyle={[styles.inputSearchStyle, props.inputSearchStyle]}
      iconStyle={[styles.iconStyle, props.iconStyle]}
      selectedStyle={[styles.selectedStyle, props.selectedStyle]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  dropdown: {
    height: 60,
    borderColor: "#90A4AE",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: "#FFFFFF",
  },
  placeholderStyle: {
    fontSize: 14,
    color: "#C7C7CD",
  },
  selectedTextStyle: {
    fontSize: 14,
    color: "#1F2937",
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 14,
    borderColor: "#90A4AE",
    borderRadius: 6,
    paddingHorizontal: 8,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  selectedStyle: {
    borderRadius: 12,
    backgroundColor: "#73A5F6",
    borderColor: "#3B82F6",
    borderWidth: 1,
    padding: 5,
  },
});
