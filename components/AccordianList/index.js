import React, { useState } from "react";
import { View, ScrollView,Text } from "react-native";
import { ListItem } from "@rneui/themed";
import { Entypo } from "@expo/vector-icons";
import { AntDesign } from '@expo/vector-icons';
//import data from "../../constants";
import styles from "./styles";

const AccordianList = (props) => {
  const { 
    navigation,
     data,
     nursery,
     location,
     species,
     dateOfAudit,
     representative,
     representativeName,
     latitude,
     longitude,
     altitude
    } = props;
  const [expanded, setExpanded] = useState(false);

  const log = (l, i) => {
    navigation.navigate("Nursery Audit", { 
     nurseryAuditDetails: l,
     auditcriterionid: i,
     nursery:nursery,
     location: location,
     species:species,
     dateOfAudit:dateOfAudit,
     representative:representative,
     representativeName:representativeName,
     latitude:latitude,
     longitude:longitude,
     altitude:altitude
      });
  };

  return (
    <View style={{ paddingBottom: 30, flex: 1, marginTop: 2 }}>
      <ListItem.Accordion
 
        content={
          <>
          <AntDesign name="dingding-o"  size={24} style={{ marginRight: 10}}  />
            
            <ListItem.Content>
              <ListItem.Title style={{ fontSize: 18, fontWeight: "800" }}>
                 Audit Criterion
              </ListItem.Title>
            </ListItem.Content>
          </>
        }
        isExpanded={expanded}
        onPress={() => {
          setExpanded(!expanded);
        }}
     
      >
        <ScrollView>
          {data &&
            data?.map((l, i) => (
              
              <ListItem
                key={i}
                onPress={() => {
                  log(l, i);
                }}
                bottomDivider
                animation={"350ms"}
            
              >
                <ListItem.Content 
                style={{height:30,backgroundColor:'#e4eeec'}}
                >
                  <ListItem.Title
                    style={{ fontSize: 18, fontWeight: "600", padding: 4,marginLeft:10 }}
                  >
                    {l?.auditcriterion}
                  </ListItem.Title>
                </ListItem.Content>

               <View style={styles.arrowStyle}><ListItem.Chevron /></View> 
              </ListItem>
            ))}
        </ScrollView>
        
      </ListItem.Accordion>
    </View>
  );
};

export default AccordianList;
