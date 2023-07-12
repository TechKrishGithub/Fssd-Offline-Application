import React, { useState } from "react";
import { View, Text,TextInput } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import styles from "./style";
import { useEffect } from "react";

const DropDownForlatlon=(props)=>
{
    const {
        label,
        Location,
        placeholderText,
        valueGet,
        myValue
      } = props;
      const [isFocus, setIsFocus] = useState(false);
      const [placeholderTextColor,setPlaceHolderTextColor]=useState('black');

      const renderLabel= () => {
        if (Location || isFocus) {
          return (
            <Text style={[styles.label, { color: "blue" }]}>
            {label}
            </Text>
          );
        }
        return null;
      };
      useEffect(()=>{if(!myValue){setIsFocus(false);setPlaceHolderTextColor('black')}},[myValue])
    

    return(
        <View style={styles.container}>
            {renderLabel()}
            <View   style={[styles.dropdown]}>
            <TextInput
            onChangeText={(e)=>valueGet(e)}
            placeholder={placeholderText}
            placeholderTextColor={Location?'gray':myValue?'gray':placeholderTextColor}
            value={Location?Location:myValue?myValue:''}
              onFocus={() => 
              {
                setPlaceHolderTextColor('gray')
                setIsFocus(true)
              }}
              onBlur={() => 
              { 
                if(Location||myValue)
                {
                
                }
                else
                {
                  setIsFocus(false)
                  setPlaceHolderTextColor('black')
                }
              }}
            />
            
            </View>
        </View>
    )
}

export default DropDownForlatlon;