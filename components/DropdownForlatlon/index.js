import React, { useState } from "react";
import { View, Text,TextInput } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import styles from "./style";

const DropDownForlatlon=(props)=>
{
    const {
        label,
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
            <View   style={[styles.dropdown]}>
            <Text
            >{Location?Location:label}</Text>
            </View>
        </View>
    )
}

export default DropDownForlatlon;