import React, { useState } from "react";
import { View, Text } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { AntDesign } from "@expo/vector-icons";
import styles from "./style";

const DropDownSearch = (props) => {
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
    setValue(item.nurseryname);
    setIsFocus(false);
    //child to parent passing selected Value
    handleChange(item.nurseryname);
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
        itemTextStyle={{ marginVertical: -10}}
        search
        maxHeight={maxHeight}
        labelField="nurseryname"
        valueField="nurseryname"
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
          <AntDesign
            style={styles.icon}
            color={isFocus ? "blue" : "black"}
            name="dotchart"
            size={20}
          />
        )}
      />
    </View>
  );
};

export default DropDownSearch;
