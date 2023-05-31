import React, { useLayoutEffect,useState,useEffect } from "react";
import { 
  View,
  Text,
  Modal,
  TouchableHighlight,

 } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import * as SQLite from 'expo-sqlite';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { 
  MaterialCommunityIcons,
  FontAwesome5,
  Ionicons,
  AntDesign
} from '@expo/vector-icons';
import style from "./style";
import { DataTable } from "react-native-paper";
import { TouchableOpacity } from "react-native-gesture-handler";

const db = SQLite.openDatabase('mydb.Nursery');
function Logout({ navigation }) {
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Profile",
    });
  }, [navigation]);

  

  const [modalVisible, setModalVisible] = useState(false);
  const [log,setLog]=useState(false);
  const [dots, setDots] = useState('');
  const [user,setUser]=useState('');
 
  useEffect(() => {
    getUser();
    setTimeout(()=>
    {
      getUser();
    },100)
    const interval = setInterval(() => {
      setDots((prevDots) => {
        if (prevDots.length === 5) {
          return '';
        } else {
          return prevDots + '.';
        }
      });
    }, 500);
    

    return () => clearInterval(interval);
  }, []);

  const getUser=()=>
  {
   db.transaction(tx=>
    {
        tx.executeSql(
        'SELECT username FROM User_Master',
        [],
        (_, { rows }) => setUser(rows._array[0].username)
        )
    })
  }

  useFocusEffect(() => {
    getUser();
  });

  const handleConfirm=()=>
  {
   setLog(true);
   setTimeout(()=>
   {
    setModalVisible(false);
    setLog(false);
    db.transaction(tx => {
      tx.executeSql(
       'DROP TABLE IF EXISTS User_Master',[],
    )
    })
    db.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS User_Master (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT,userid INTEGER,token VARCHAR)',
      );
    });
    AsyncStorage.removeItem('Username');
    AsyncStorage.removeItem('Password');
    navigation.navigate('UserLogin');
   },3500)
    
   
  }
  const handleCancel=()=>
  {
    setModalVisible(false);
    //  navigation.navigate('Nursery Audit Checklist')
  }

 

  return (
    <View style={{ backgroundColor:'rgba(198, 227, 228,0.5)',flex:1}}>
    <View style={style.containerForTotal}>

        <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(false);
      }}
    >
      <View style={style.modal}>
        {log&& 
         <View style={style.container}>
         <Text style={style.text}>Logingout</Text>
         <View style={{width:'15%'}}>
         <Text style={style.dots}>{dots}</Text>
         </View>
       </View>
        }
        {
  !log&&
  <View style={style.modalContent}>
  <Text style={style.modalText}>Are you sure you want to log out?</Text>
  <View style={style.modalButtons}>
    <TouchableHighlight
      style={[style.modalButton, style.modalCancelButton]}
      onPress={() => {
        handleCancel()
      }}
    >
      <Text style={style.modalButtonText}>Cancel</Text>
    </TouchableHighlight>
    <TouchableHighlight
      style={[style.modalButton, style.modalLogoutButton]}
      onPress={handleConfirm}
    >
      <Text style={style.modalButtonText}>Logout</Text>
    </TouchableHighlight>
  </View>
  </View>
        }
      
      </View>
    </Modal>

  <View style={style.profile}>
  <FontAwesome5 name="user-tie" size={80} color="black" />
  </View>
  <Text style={style.user}>{user}</Text>
  <Text></Text>
  <View style={style.Table}>
  <DataTable>
    <DataTable.Row>
      <DataTable.Cell style={[style.cell,{borderTopWidth:0.3,borderTopColor:'gray'}]}><Text style={style.textTable}>user</Text></DataTable.Cell>
      <DataTable.Cell style={[style.cell,{borderTopWidth:0.3,borderTopColor:'gray'}]}>{user}</DataTable.Cell>
    </DataTable.Row>
    <DataTable.Row>
      <DataTable.Cell  style={style.cell}><Text style={style.textTable}>Department</Text></DataTable.Cell>
      <DataTable.Cell style={style.cell}>Forestry Support Service Database</DataTable.Cell>
    </DataTable.Row>
  </DataTable>
  </View>

<View style={style.Buttons}>

  <TouchableHighlight style={style.containerForLogout} 
  onPress={()=>
    {
      setModalVisible(true)
    }}
  >
    <View style={[style.button,{backgroundColor:'red'}]}>
    <AntDesign name="logout" size={18} color="#FFFFFF" />
      <Text style={[style.textForLogout]}>Logout</Text>
      </View>
    </TouchableHighlight>

<View style={{paddingLeft:'20%'}}>
    <TouchableOpacity
    onPress={()=>navigation.navigate('PinAccess')}
    >
      <View style={[style.button]}>
        <Ionicons name="lock-closed" size={20} color="#FFFFFF" />
        <Text style={style.buttonText}>Lock</Text>
      </View>
    </TouchableOpacity>

    </View>

    </View>
{/* <TouchableHighlight
style={[style.modalButton, style.modalCancelButton]}

>
  <Text style={style.modalButtonText}>Logout</Text>
</TouchableHighlight> */}

  </View>
  </View>
  );
}

export default Logout;
