import React, { useEffect, useState } from "react";
import { View, Text, Alert } from "react-native";

import data from "../../constants";
import { AccordianList, DropDownSearch } from "../../components";
import styles from "./style";
import { getComplainceCategories } from "../../config/api";
import { apiEndpoints } from "../../config/endpoints/index";

const GroundWaterComplaince = (props) => {
  const { navigation } = props;
  const [selectedPermit, setIsselectedPermit] = useState(null);
  const [seletedQuarter, setSelectedQuarter] = useState(null);
  const [complainceData, setComplainceData] = useState([]);

  const onChangePermit = (permit) => {
    setIsselectedPermit(permit);
  };

  const onChangeQuarter = (quarter) => {
    setSelectedQuarter(quarter);
  };

  const getComplainceCategories = async () => {
    try {
      const response = await fetch(apiEndpoints.getComplainceFactors);
      const responseData = await response.json();
      if (responseData) {
        setComplainceData(JSON.parse(responseData));
      }
    } catch (error) {
      console.error(error);
      Alert.alert("PERMITS", "Server is busy please try again later");
    }
  };

  useEffect(() => {
    getComplainceCategories();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "white", padding: 10 }}>
      <DropDownSearch
        placeholderText={"Select Permit Number"}
        data={data.permitsList}
        label={"Permit Number"}
        maxHeight={250}
        handleChange={onChangePermit}
        selectedValue={selectedPermit}
      />

      <DropDownSearch
        placeholderText={"Select Quarter"}
        data={data.quarterList}
        label={"Quarter"}
        maxHeight={"auto"}
        handleChange={onChangeQuarter}
        selectedValue={seletedQuarter}
      />

      <View style={styles.userView}>
        <Text style={styles.userlabel}>
          {" "}
          Year : {new Date().getFullYear() - 1}
        </Text>
        <Text style={styles.userlabel}> User : Allu Lavaraju</Text>
      </View>

      <AccordianList navigation={navigation} data={complainceData} />
    </View>
  );
};

export default GroundWaterComplaince;
