import React, { useState } from "react";
import { View, Text } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { 
    AntDesign,
    Ionicons
 } from "@expo/vector-icons";
import styles from "./style";
import MultiSelect from 'react-native-multiple-select';

const SelectOptionsForSpecies=(props)=>
{
    const {
        placeholderText,
        data,
        label,
        handleChange,
        selectedItems,
        maxHeight,
      } = props;
     
      const [isFocus, setIsFocus] = useState(false);
    
    //   const onSelect = (item) => {

    //     //child to parent passing selected Value
    //     handleChange(item.speciesName);
    //   };
    
      const renderLabel = () => {
        if ( isFocus) {
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
          <MultiSelect
        items={data}
        uniqueKey="speciesName"
        displayKey="speciesName"
        onSelectedItemsChange={(item)=>handleChange(item.speciesName)}
        selectedItems={selectedItems}
        searchInputPlaceholderText="Search options..."
        selectText={placeholderText}
        tagRemoveIconColor="#CCC"
        tagBorderColor="#CCC"
        tagTextColor="#CCC"
        selectedItemTextColor="#CCC"
        selectedItemIconColor="#CCC"
        itemTextColor="#000"
        searchInputStyle={{ color: '#CCC' }}
        submitButtonColor="#CCC"
        submitButtonText="Submit"
      />
        </View>
      );    
}

export default SelectOptionsForSpecies;