import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, ScrollView, StyleSheet } from 'react-native';
import { AntDesign,Ionicons } from '@expo/vector-icons';
import styles from './style';

const DropDownSearch = (props) => {
  const {
    placeholderText,
    data,
    label,
    handleChange,
    selectedValue,
    maxHeight,
    myData
  } = props;
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');

  const [value, setValue] = useState(selectedValue ? selectedValue : null);
  const [isFocus, setIsFocus] = useState(false);

  const renderLabel = () => {
    if ( selectedItem ) {
      return (
        <Text style={[styles.label, selectedItem && { color: 'blue' }]}>
          {label}
        </Text>
      );
    }
    return null;
  };
  const SecondArray = [
    { id: 1, nursery: 'Jose Limited' },
    { id: 2, nursery: 'Piajo Banika' },
    // Rest of the items
  ];

  const options = data.map((item) => ({
    id: item.id,
    name: item.nurseryname,
    disabled: myData.some((secondItem) => secondItem.nursery === item.nurseryname),
  }));

  const handleSelectItem = (item) => {
    if (!item.disabled) {
      setSelectedItem(item);
      setModalVisible(false);
      handleChange(item.name);
      setSearchText('');
    }

  };

  const handleSearch = (text) => {
    setSearchText(text);
  };

  const clearSearch = () => {
    setSearchText('');
  };

  const filteredOptions = options.filter((item) =>
    item.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleBack = () => {
    setModalVisible(false);
    setSearchText('');
  };

  return (
    <View style={styles.container}>
        {renderLabel()}
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={[styles.dropdown, { flexDirection:'row',alignItems:'center' }, selectedItem && { borderColor: 'blue' }]}
      >
       <AntDesign
            style={styles.icon}
            color={isFocus ? "blue" : "black"}
            name="dotchart"
            size={20}
          />
        <Text>{selectedItem ? selectedItem.name : placeholderText}</Text>
      </TouchableOpacity>
      <Modal
        visible={modalVisible}
        animationIn="slideInUp" // Specify the desired animation type for modal enter
        animationOut="slideOutDown" // Specify the desired animation type for modal exit
        animationInTiming={500} // Set the duration for modal enter animation
        animationOutTiming={500} // Set the duration for modal exit animation
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.searchContainer}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={25} color="black" />
            </TouchableOpacity>
           
              <TextInput
                style={styles.searchInput}
                placeholder="Search..."
                onChangeText={handleSearch}
                value={searchText}
              />
              {searchText !== '' && (
                <TouchableOpacity style={styles.clearIconContainer} onPress={clearSearch}>
                  <AntDesign name="closecircle" size={20} color="black" />
                </TouchableOpacity>
              )}
            </View>
            <ScrollView>
            {filteredOptions.length > 0 ? (
                filteredOptions.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => handleSelectItem(item)}
                    disabled={item.disabled}
                    style={[styles.option, item.disabled && styles.disabledOption]}
                  >
                    <Text style={styles.optionText}>{item.name}</Text>
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={styles.notFoundText}>Nursery not found</Text>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default DropDownSearch;

