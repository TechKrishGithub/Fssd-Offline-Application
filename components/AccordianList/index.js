import React, { useState } from "react";
import { View, ScrollView,Text } from "react-native";
import { ListItem } from "@rneui/themed";
import { Entypo } from "@expo/vector-icons";
import { AntDesign } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/FontAwesome'; 
//import data from "../../constants";
import styles from "./styles";
import { useEffect } from "react";

const AccordianList = (props) => {
  const { 
    navigation,
     data,
     nursery,
     location,
     District,
     species,
     dateOfAudit,
     representative,
     representativeName,
     phonenumber,
     latitude,
     longitude,
     altitude,
     nurAudAns,
     que1,
     que2,
     que3
    } = props;
  const [expanded, setExpanded] = useState(false);

  const log = (l, i) => {
    navigation.navigate("Nursery Audit", { 
     nurseryAuditDetails: l,
     auditcriterionid: i,
     nursery:nursery,
     location: location,
     District:District,
     species:species,
     dateOfAudit:dateOfAudit,
     representative:representative,
     representativeName:representativeName,
     phonenumber:phonenumber,
     latitude:latitude,
     longitude:longitude,
     altitude:altitude,
     que1:que1,
     que2:que2,
     que3:que3
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
            data?.map((l, i) =>
            {
              let status;
              nurAudAns.map(obj=>
                {
                  if(obj.auditcriterionid==l.auditcriterionid)
                  {
                    status='saved';
                  }
                })
            return(
              
              <ListItem
                key={i}
                onPress={() => {
                  log(l, i);
                }}
                bottomDivider
                animation={"350ms"}
            
              >
               <ListItem.Content style={{ backgroundColor: '#e4eeec' }}>
              <ListItem.Title style={{ padding: 4,fontWeight:'600' }}>
              {l?.auditcriterion}
              </ListItem.Title>
            </ListItem.Content>
              {status=='saved'?<Icon name="check-circle" size={15} color="green" />:null}
               <View style={styles.arrowStyle}><ListItem.Chevron /></View> 
              </ListItem>
            )})}
        </ScrollView>
        
      </ListItem.Accordion>
    </View>
            
  );
  
};

export default AccordianList;
