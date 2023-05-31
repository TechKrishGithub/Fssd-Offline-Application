import React, { useState,useEffect } from "react";
import { View, Text,TextInput, Keyboard } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import styles from "./style";

const DropDownForNormal=(props)=>
{
    const {
        placeholderText,
        label,
        maxHeight,
        myValue,
        keyboardType,
        takeValue
      } = props;
      const [value, setValue] = useState('');
      const [isFocus, setIsFocus] = useState(false);

      const renderLabel= () => {
        if (isFocus) {
          return (
            <Text style={[styles.label, isFocus && { color:"blue" }]}>
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
            style={[styles.dropdown,{fontSize:18} ]}
            placeholder={isFocus?'':placeholderText}
            onFocus={() => setIsFocus(true)}
            onBlur={() =>{
             value==''?setIsFocus(false):setIsFocus(true);
             myValue(value)
              
        }}
        keyboardType={keyboardType}
        maxHeight={maxHeight}
        value={value}
        placeholderTextColor="black"
        onChangeText={setValue}
            />
        </View>
    )
}

export default DropDownForNormal;