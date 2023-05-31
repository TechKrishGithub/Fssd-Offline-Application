import React, { useEffect } from "react";
import {View,Text,StyleSheet, TextInput,TouchableOpacity, Alert,Button,Image} from 'react-native';
import {useState} from 'react';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SQLite from 'expo-sqlite';
import logo from '../../assets/logo-removebg-preview.png'
import wiselogo from '../../assets/wiselogo.png';
import styles from "./style";
import Icon from 'react-native-vector-icons/FontAwesome';
import { apiEndpoints } from "../../config/endpoints";
import NetInfo from '@react-native-community/netinfo';

const db = SQLite.openDatabase('mydb.Nursery');

const UserInput=({navigation})=>
{
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

    
useEffect(()=>
{
    getData();
    createTables();
    setTimeout(()=>
    {
      getData()
    },500)
   
},[]);


const createTables=()=>
{
  db.transaction(tx => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS NurseryDetials (id INTEGER PRIMARY KEY AUTOINCREMENT, district TEXT, nurseryid VARCHAR,nurseryname TEXT,Latitude varchar,Longitude varchar,Address varchar)'
    );
  })
db.transaction(tx => {
  tx.executeSql(
    'CREATE TABLE IF NOT EXISTS User_Master (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT,userid INTEGER,token VARCHAR)',
  );
});
db.transaction(tx => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS NurseryAuditDetails (id INTEGER PRIMARY KEY AUTOINCREMENT, auditcriterion TEXT, auditcriterionid VARCHAR)',
    );
  });
  db.transaction(tx => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS NurseyAuditCriterionQuestions (id INTEGER PRIMARY KEY AUTOINCREMENT, questionsid VARCHAR, question VARCHAR,maxscore VARCAHR,auditcriterionid VARCHAR)',
    );
  });
  db.transaction(tx => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS SpeciesDetails(id INTEGER PRIMARY KEY AUTOINCREMENT, speciesId VARCHAR,speciesName VARCHAR)'
    );
  })

  db.transaction(tx => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS NurseryAuditAnswers (id INTEGER PRIMARY KEY AUTOINCREMENT,nursery varchar, auditcriterionid varchar,question varchar,maxscore integer,comment varchar)',
    );
  });

db.transaction(tx => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS NurseryObservation (id INTEGER PRIMARY KEY AUTOINCREMENT, Nusery VARCHAR, Observation VARCHAR,Date datetime)',
    );
  });


db.transaction(tx => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS CorrectiveAction (id INTEGER PRIMARY KEY AUTOINCREMENT,Nursery varchar, descOfNonConf VARCHAR,Date datetime)',
    );
  });

  db.transaction(tx => {
    tx.executeSql(
      tx.executeSql('create table if not exists NurseryAuditEntryDetails(id INTEGER PRIMARY KEY AUTOINCREMENT,nursery varchar,location varchar,species TEXT,date date,typeOfRepresentative TEXT,nameOfRepresentative Text,Latitude varchar,Longitude varchar,Altitude varchar)')
    );
  });
  db.transaction(tx=>
    {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS NurseryAuditAnswers (id INTEGER PRIMARY KEY AUTOINCREMENT,nursery varchar, auditcriterionid varchar,question varchar,maxscore integer,comment varchar)',
      );
    })

}


const getNurseryDetails = async () => {
    try {
      const response = await fetch(apiEndpoints.getNurseryDetails);
      const responseData = await response.json();
      if (responseData) {
       const result=JSON.parse(responseData);
       const isTableEmpty = () => {
        return new Promise((resolve, reject) => {
          db.transaction((tx) => {
            tx.executeSql(
              'SELECT COUNT(*) as count FROM NurseryDetials',
              [],
              (_, result) => {
                const count = result.rows.item(0).count;
                resolve(count === 0);
              },
              (_, error) => {
                reject(error);
              }
            );
          });
        });
      };
      
       isTableEmpty().then(empty=>
       {
        if(empty)
        {
          db.transaction(tx => {
            result.map((i)=>
            {
              tx.executeSql('INSERT INTO NurseryDetials (district, nurseryid,nurseryname,Latitude,Longitude,Address) VALUES (?, ? , ? , ? , ?, ?)', [i.district, i.nurseryid,i.nurseryname,i.Latitude,i.Longitude,i.Address], (tx, results) => {
                if (results.rowsAffected > 0)
                 {
                  console.log('NurseryDetials Successful');
                } else 
                {
                  console.log('Error adding');
                }
            })
           
               })
              });
        
        }
       })
        }
    } catch (error) {
      console.error(error);
      Alert.alert("Nursery", "Server is busy please try again later");
    }
  };


  const getspeciesDetails = async () => {
    try {
      const response = await fetch(apiEndpoints.getNurseryAuditCriterionSpeciesDetails);
      const responseData = await response.json();
      if (responseData) {
       const result=JSON.parse(responseData);
       const isTableEmpty = () => {
        return new Promise((resolve, reject) => {
          db.transaction((tx) => {
            tx.executeSql(
              'SELECT COUNT(*) as count FROM SpeciesDetails',
              [],
              (_, result) => {
                const count = result.rows.item(0).count;
                resolve(count === 0);
              },
              (_, error) => {
                reject(error);
              }
            );
          });
        });
      };
      
       isTableEmpty().then(empty=>
       {
        if(empty)
        {
          db.transaction(tx => {
            result.map((i)=>
            {
              tx.executeSql('INSERT INTO SpeciesDetails (speciesId,speciesName) VALUES ( ? ,?)', [i.speciesId,i.speciesName], (tx, results) => {
                if (results.rowsAffected > 0)
                 {
                  console.log('SpeciesDetails Successful');
                } else 
                {
                  console.log('Error adding');
                }
            })
           
               })
              });
        
        }
       })
        }
    } catch (error) {
      console.error(error);
      Alert.alert("SpeciesDetails", "Server is busy please try again later");
    }
  };




  const getNurseryAuditDetails = async () => {
    try {
      const response = await fetch(apiEndpoints.getNurseyAuditCriterionDetails);
      const responseData = await response.json();
      if (responseData) {
       const result=JSON.parse(responseData);
       const isTableEmpty = () => {
        return new Promise((resolve, reject) => {
          db.transaction((tx) => {
            tx.executeSql(
              'SELECT COUNT(*) as count FROM NurseryAuditDetails',
              [],
              (_, result) => {
                const count = result.rows.item(0).count;
                resolve(count === 0);
              },
              (_, error) => {
                reject(error);
              }
            );
          });
        });
      };
      
       isTableEmpty().then(empty=>
       {
        if(empty)
        {
          db.transaction(tx => {
            result.map((i)=>
            {
              tx.executeSql('INSERT INTO NurseryAuditDetails (auditcriterion,auditcriterionid) VALUES (?,?)', [i.auditcriterion, i.auditcriterionid], (tx, results) => {
                if (results.rowsAffected > 0)
                 {
                  console.log('NurseryAuditDetails Successful');
                } else 
                {
                  console.log('Error adding');
                }
            })
           
               })
              });
        
        }
       })
        }
    } catch (error) {
      console.error(error);
      Alert.alert("Nursery", "Server is busy please try again later");
    }
  };

  const  getNurseyAuditCriterionQuestions = async () => {
    try {
      const response = await fetch(apiEndpoints.getNurseryAuditCriterionDetailsQuestions);
      const responseData = await response.json();
      if (responseData) {
       const result=JSON.parse(responseData);
       const isTableEmpty = () => {
        return new Promise((resolve, reject) => {
          db.transaction((tx) => {
            tx.executeSql(
              'SELECT COUNT(*) as count FROM NurseyAuditCriterionQuestions',
              [],
              (_, result) => {
                const count = result.rows.item(0).count;
                resolve(count === 0);
              },
              (_, error) => {
                reject(error);
              }
            );
          });
        });
      };
      
       isTableEmpty().then(empty=>
       {
        if(empty)
        {
          db.transaction(tx => {
            result.map((i)=>
            {
              tx.executeSql('INSERT INTO NurseyAuditCriterionQuestions (questionsid,question,maxscore,auditcriterionid) VALUES (?,?,?,?)', [i.questionsid, i.question,i.maxscore,i.auditcriterionid], (tx, results) => {
                if (results.rowsAffected > 0)
                 {
                  console.log('NurseyAuditCriterionQuestions Successful');
                } else 
                {
                  console.log('Error adding');
                }
            })
           
               })
              });
        
        }
       })
        }
    } catch (error) {
      console.error(error);
      Alert.alert("Nursery", "Server is busy please try again later");
    }
  };


    const getData=async ()=>
    {
        try{
         await AsyncStorage.getItem('Username').then(
            async value=>
            {
                if(value!=null)
                {
                    await AsyncStorage.getItem('Password').then(
                        value=>{
                            if(value!=null)
                            {
                                navigation.replace('PinGeneration');
                            }
                        }
                    )
                }
            }
         )

        }
        catch(error)
        {
            console.log(error);
        }
    }

    
   
    
    
    const Validate=async ()=>
    {
      const netInfo = await NetInfo.fetch();
      const isConnected = netInfo.isConnected;    
      if (isConnected==false) {
        Alert.alert(
          'No Network Connection',
          'Please connect to a network and try again.',
          [{ text: 'OK' }],
          { cancelable: false }
        );
      }
      else
      {
        try{
          if(username!=''&&password!='')
          { 
            fetch('http://182.18.181.115:8084/api/login/loginservice?username='+username+'&password='+password+'').
        then(response=>response.json()).
        then(responseText=>JSON.parse(responseText)).
        then(async (result)=>{
    
          if(result.length!==0)
          {
              getNurseryDetails();
              getNurseryAuditDetails();
              getNurseyAuditCriterionQuestions();
              getspeciesDetails();
            console.log(result[0].userid);
            console.log(result[0].token);
            await AsyncStorage.setItem('Username',username);
            await AsyncStorage.setItem('Password',password);
            db.transaction(tx => {
              tx.executeSql('INSERT INTO User_Master (username, password, userid,token) VALUES (? ,? ,?, ?)', [username,password,result[0].userid,result[0].token], (tx, results) => {
                if (results.rowsAffected > 0) {
                  console.log('User added');
                } else {
                  console.log('Error adding user');
                }
              });
            }); 
          
            navigation.navigate('PinGeneration');
            setUsername('');
            setPassword('');
  
          }
          else
          {
            Alert.alert('warning','Username and password wrong');
          }
        }).catch(error=>{ 
          console.log(error)
        })
          }
          else
          {
             Alert.alert('warning','Please Entered Username and Password')
          }
         }
         catch(error)
         {
          console.log(error);
         }

      }
     

    }

    
    
    // Rest of your component's rendering logic
    


  return(
    <View style={styles.user}>
     <View style={{height:'10%',width:'20%',justifyContent:'center',alignItems:'center',backgroundColor:'white',borderRadius:60}}>
     <Image source={logo} style={{height:'80%',width:'70%'}}/>
     </View>
     <Text></Text> 
      <View style={styles.Field}>
      <Image source={wiselogo} style={{height:'18%',width:'40%'}}/>
       
        <Text></Text>
        <Text style={{fontSize:20,}}>sign in to start your session  while online</Text>
        
     
      <Text></Text>
      <Text></Text> 
      <View style={styles.InputContainer}>
      <TextInput placeholder="Enter username" placeholderTextColor='grey' style={styles.FieldInput} onChangeText={setUsername} value={username}/>
      <Icon name="user" size={20} color="#000" style={{ marginRight: 10 }} />
      </View>
      <Text></Text>
      <View style={styles.InputContainer}>
      <TextInput placeholder="Enter password" placeholderTextColor='gray'  secureTextEntry={true}  style={styles.FieldInput} onChangeText={setPassword} value={password} />
      <Icon name="lock" size={20} color="#000" style={{ marginRight: 10 }} />
      </View>
      <Text></Text>
      <TouchableOpacity style={styles.button} onPress={Validate}>
      <Text style={styles.buttonText}>Submit</Text>
    </TouchableOpacity>
      </View>
        {/* <Warning visible={warningVis} change={WarningMessage}/> */}
    </View>
  )
}



export default UserInput;