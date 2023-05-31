import React, { useState } from "react";
import { View, Text } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { 
    AntDesign,
    Ionicons
 } from "@expo/vector-icons";
import styles from "./style";

const DropDownSearchForSpecies = (props) => {
  const {
    placeholderText,
    data,
    label,
    handleChange,
    selectedValue,
    maxHeight,
  } = props;


  const [value, setValue] = useState(selectedValue ? selectedValue : null);
  const [isFocus, setIsFocus] = useState(false);

  const onSelect = (item) => {
    setValue(item.speciesName);
    setIsFocus(false);
    //child to parent passing selected Value
    handleChange(item.speciesName);
  };

  const renderLabel = () => {
    if (value || isFocus) {
      return (
        <Text style={[styles.label, isFocus && { color: "blue" }]}>
         {label}
        </Text>
      ); 
    }
    return null;
  };

  return (
    <View style={styles.container}>
      {renderLabel()}
      <Dropdown
        style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={data}
        search
        maxHeight={maxHeight}
        labelField="speciesName"
        valueField="speciesName"
        placeholder={
          !isFocus ? (placeholderText ? placeholderText : "Select Item") : "..."
        }
        searchPlaceholder="Search..."
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          onSelect(item);
        }}
        renderLeftIcon={() => (
            <Ionicons  style={styles.icon} name="logo-dropbox" size={20} color={isFocus ? "blue" : "black"} />
        )}
      />
    </View>
  );
};

export default DropDownSearchForSpecies;
