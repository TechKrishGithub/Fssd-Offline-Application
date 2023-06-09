import { Button } from '@rneui/base';
import { ListItem } from 'react-native-elements';
import React, { useState,useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Alert,
 } from "react-native";
 import { Foundation ,Feather,MaterialIcons } from '@expo/vector-icons';
 import styles from './styles';
 import SyncingData from '../SyncingData';
 import * as SQLite from 'expo-sqlite';
 


 const db=SQLite.openDatabase('mydb.Nursery');

const DashboardNurseryAuditList = ({ nurAudEntry,nurAudDet,nurAudAns,navigation,nurObserData,correctiveData,forQuestionIdAndMaxScore,forNurId,userDetails,syncedData,myStatus}) => {
    const [selectedRow, setSelectedRow] = useState(null);


    const handleButtonPress = (rowData) => {
      setSelectedRow(rowData);
    };

    const handleHideDetails = () => {
      setSelectedRow(null);
    };

    return (
      <View>
    
        {nurAudEntry.map((rowData) => 
        {
         
          let filterSyncedData='';

          if(syncedData.some((o)=>o.NurseryName===rowData.nursery))
          {
            filterSyncedData='Yes'
          }
          
          const filterMyArray=nurAudAns.filter(obj=>
            rowData.nursery==obj.nursery
          )

          const filteredArray = nurAudDet.filter((obj) =>
          filterMyArray.some((o) => o.auditcriterionid === obj.auditcriterionid)
            );

            let savedCount = 0;
            let statusForObs='';
            let statusForCorr='';
            let totalcount=0;
          
            const completed = nurAudDet.every((v) =>
               filteredArray.some((o) => o.auditcriterionid === v.auditcriterionid)
               );

           
            nurAudDet.map(v=>
                {
                    if(filteredArray.some((o) => o.auditcriterionid ===v.auditcriterionid))
                    {
                        savedCount++;
                        totalcount++;
                    }       
                    else
                    {
                      totalcount++;
                    }
                }
            )

          if(nurObserData.some((o)=>o.Nusery===rowData.nursery))
          {
            statusForObs='saved'
          }
          else
          {
            statusForObs='pending'
          }

          if(correctiveData.some((o)=>o.Nursery===rowData.nursery))
          {
            statusForCorr='saved'
          }
          else
          {
            statusForCorr='pending'
          }


          return (
            <View key={rowData.id}>
             
        
           
              <ListItem >
                <ListItem.Content style={styles.ListContent}>

                  <ListItem.Title style={styles.auditName}>{rowData.nursery}
                  {/* <Text> ({savedCount}/{totalcount})</Text> */}
                  </ListItem.Title>
                  {/* <ListItem.Subtitle>species: {rowData.species}</ListItem.Subtitle> */}
                  <Text>Out of {totalcount} Audit Criterion {savedCount} completed</Text>
                  <ListItem.Subtitle>{completed && statusForCorr=='saved' && statusForObs=='saved' ?
                  <View style={[styles.auditInfo,{borderBottomWidth:0}]}>
                  <Text>Status:</Text>
                 <Text style={{color:'green',fontSize:13}}> completed</Text>
                 </View>
                  :
                  <View style={[styles.auditInfo,{borderBottomWidth:0}]}>
                     <Text>Status: </Text>
                 <Text style={{color:'red',fontSize:13}}> Inprogress</Text>
                 </View>
                  }</ListItem.Subtitle>
                        <View style={[styles.auditInfo,{borderBottomWidth:0}]}>
                            <Text style={[styles.auditcriterion,{fontSize:13,width:'50%',color:'black'}]}>Nursery Observations</Text>
                            {statusForObs=='saved'?
                               <View style={styles.savEdit}>
                               <Text style={styles.successText}>saved</Text>

                               {filterSyncedData=='Yes'?
                               <TouchableOpacity
                               style={{marginLeft:20}}
                               onPress={()=>
                              {
                                navigation.navigate('NurseryObservations',{nursery:rowData.nursery,filterSyncedData:filterSyncedData});
                              }}
                               >
                               <MaterialIcons name="preview" size={18} color="green" />
                               </TouchableOpacity> 
                               :
                               <TouchableOpacity
                               style={{marginLeft:20}}
                               onPress={()=>
                              {
                                navigation.navigate('NurseryObservations',{nursery:rowData.nursery});
                              }}
                               >
                               <Feather name="edit" size={18} color="blue" />
                               </TouchableOpacity>
                               
                              }

                               </View>
                              
                              :
                              <TouchableOpacity
                              onPress={()=>
                              {
                                navigation.navigate('NurseryObservations',{nursery:rowData.nursery});
                              }}
                              >
                                    <Text style={styles.pendingText}>pending</Text> 
                              </TouchableOpacity>
                            
                          }
                </View>

                <View style={[styles.auditInfo,{borderBottomWidth:0}]}>
                            <Text style={[styles.auditcriterion,{fontSize:13,width:'50%',color:'black'}]}>corrective Action</Text>
                            {statusForCorr=='saved'?
                               <View style={styles.savEdit}>
                               <Text style={styles.successText}>saved</Text>

                               {filterSyncedData=='Yes'?
                               <TouchableOpacity
                               style={{marginLeft:20}}
                               onPress={()=>
                              {
                                navigation.navigate('CorrectiveAction',{nursery:rowData.nursery,filterSyncedData:filterSyncedData});
                              }}
                               >
                               <MaterialIcons name="preview" size={18} color="green" />
                               </TouchableOpacity> 
                              :
                              <TouchableOpacity
                              style={{marginLeft:20}}
                              onPress={()=>
                              {
                               navigation.navigate('CorrectiveAction',{nursery:rowData.nursery});
                              }}
                              >
                              <Feather name="edit" size={18} color="blue" />
                              </TouchableOpacity>
                            }

                               
                               </View>
                              :
                              <TouchableOpacity
                              onPress={()=>
                                {
                                  navigation.navigate('CorrectiveAction',{nursery:rowData.nursery});
                                }}
                              >
                                    <Text style={styles.pendingText}>pending</Text> 
                              </TouchableOpacity>
                          }
                </View>

                </ListItem.Content>
                {!selectedRow || rowData.id !== selectedRow.id ? (
                    
                     <TouchableOpacity style={[styles.buttonContainerDetails]} onPress={() => handleButtonPress(rowData)}>
                     <Text style={styles.buttonTextDetails}>Details</Text>
                   </TouchableOpacity>
              
                ) : (
                     
                    <TouchableOpacity style={[styles.buttonContainerDetails,{backgroundColor: '#3498db',}]} onPress={handleHideDetails}>
                    <Text style={styles.buttonTextDetails}>Hide</Text>
                  </TouchableOpacity>
                 
                )}
              </ListItem>

        {/* {savedCount=='0'?   <SyncingData 
               nursery={rowData.nursery}
               nurAudEntry={nurAudEntry}
               nurAudDet={nurAudDet}
               forNurId={forNurId}
               userDetails={userDetails}
               /> 
              :
              null
              } */}
                {completed && statusForCorr=='saved' && statusForObs=='saved'?
                selectedRow && rowData.id === selectedRow.id ?
                 null
               :
               <SyncingData 
               nursery={rowData.nursery}
               nurAudEntry={nurAudEntry}
               nurAudDet={nurAudDet}
               nurAudAns={nurAudAns}
               nurObserData={nurObserData} 
               correctiveData={correctiveData}
               forQuestionIdAndMaxScore={forQuestionIdAndMaxScore}
               forNurId={forNurId}
               userDetails={userDetails}
               syncedData={syncedData}
               myStatus={myStatus}
               />
              :
              null
              }
                       
              {selectedRow && rowData.id === selectedRow.id && (
    
                nurAudDet.map(v=>
                    {
                       
                        return(
                            <View style={styles.auditInfo} key={v.id}>
                            <Text style={[styles.auditcriterion,{marginLeft:10}]}>{v.auditcriterion}</Text>
                            {filteredArray.some((o) => o.auditcriterionid ===v.auditcriterionid) ?
                            <View style={styles.savEdit}>
                            <Text style={styles.successText}>saved</Text>
                            
                            {
                              filterSyncedData=='Yes'?
                              <TouchableOpacity
                              style={styles.edit}
                              onPress={()=>
                              {
                                navigation.navigate("Nursery Audit", { nurseryAuditDetails: v, auditcriterionid: v.auditcriterionid, nursery:rowData.nursery,filterSyncedData:filterSyncedData });
                              }}
                              >
                              <MaterialIcons name="preview" size={18} color="green" />
                              </TouchableOpacity>
                            :
                            <TouchableOpacity
                            style={styles.edit}
                            onPress={()=>
                            {
                              navigation.navigate("Nursery Audit", { nurseryAuditDetails: v, auditcriterionid: v.auditcriterionid, nursery:rowData.nursery });
                            }}
                            >
                            <Feather name="edit" size={18} color="blue" />
                            </TouchableOpacity>
                              
                            }


                          
                            </View>
                            :
                            <TouchableOpacity
                            onPress={()=>
                            {
                              navigation.navigate("Nursery Audit", { nurseryAuditDetails: v, auditcriterionid: v.auditcriterionid, nursery:rowData.nursery });
                            }}
                            >
                            <Text style={styles.pendingText}>pending</Text> 
                            
                            </TouchableOpacity>
                            
                            }      
               
                            </View>
                        )
                          
                    }
                  )
              )}
                <Text></Text>
                {completed && statusForCorr=='saved' && statusForObs=='saved'?
                selectedRow && rowData.id === selectedRow.id ?
                <SyncingData 
                nursery={rowData.nursery}
                nurAudEntry={nurAudEntry}
                nurAudDet={nurAudDet}
                nurAudAns={nurAudAns}
                nurObserData={nurObserData} 
                correctiveData={correctiveData}
                forQuestionIdAndMaxScore={forQuestionIdAndMaxScore}
                forNurId={forNurId}
                userDetails={userDetails}
                syncedData={syncedData}
                myStatus={myStatus}
                />
               :
              null
              :
                  
              null
                  
              }
        
            </View>
            
          )
            
        }
        
       )}
       
      </View>
    );
      
  }
  
  export default DashboardNurseryAuditList;