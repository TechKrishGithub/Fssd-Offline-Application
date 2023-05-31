import React, { useState } from "react";
import { View, Text,TextInput } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import styles from "./style";

const DropDown=(props)=>
{
    const {
        placeholderText,
        label,
        maxHeight,
        myValue,
        Location
      } = props;

      const renderLabel= () => {
        if (Location) {
          return (
            <Text style={[styles.label, Location && { color: "blue" }]}>
            {label}
            </Text>
          );
        }
        return null;
      };

    return(
        <View style={styles.container}>
            {renderLabel()}
            <TextInput 
            style={[styles.dropdown ]}
            placeholder={Location?Location:placeholderText}
            maxHeight={maxHeight}
            value={Location}
            placeholderTextColor="black"
            />
        </View>
    )
}

export default DropDown;