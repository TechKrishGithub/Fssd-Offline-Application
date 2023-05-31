import React from "react";
import {
   View, 
  Text,
  TouchableOpacity,
  TextInput,
   Alert, 
   ScrollView,
   ActivityIndicator
  } 
   from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import {DropDownSearch} from "../../components";
import { useState,useEffect } from "react";
import styles from "./style";
import { Button } from "@rneui/base";
import {DataTable} from 'react-native-paper';
import * as SQLite from 'expo-sqlite';
import { 
  FontAwesome,
  Ionicons,
  EvilIcons,
  AntDesign,
  MaterialIcons
 } 
 from '@expo/vector-icons';

const db = SQLite.openDatabase('mydb.Nursery');


  const CorrectiveAction = ({route,navigation}) => {

    const {
      selectedNursery,
      nursery
    }=route.params;

  const [dateBeClosed, setDateBeClosed] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [isFocus,setIsFocus]=useState(true);
  const [descOfNonConf,setDescOfNonConf]=useState('');
  const [data, setData] = useState([]);
  const [error, setError] = useState('');
  const [success,setSuccess]=useState('');

  // const [selectedNursery, setIsselectedNursery] = useState(null);

  const [nurseryDetails,setNurseryDetails]=useState([]);

  const [edit,setEdit]=useState('')

  const [editIndex, setEditIndex] = useState(-1);

  const [editText,setEditText]=useState('');

  const [getNurseryFromEntry,setGetNurseryFromEntry]=useState([]);

  const [nurseryDateForUpdate,setNurseryDateForUpdate]=useState(new Date());

  const [loading,setLoading]=useState(false);

  const handleDateChange = (event, selectedDate) => {
    setShowPicker(false);
    if (selectedDate) {
      setDateBeClosed(selectedDate);
    }
  };

  const handleDateChangeForUpdate = (event, selectedDate) => {
    setShowPicker(false);
    if (selectedDate) {
      setNurseryDateForUpdate(selectedDate);
    }
  };



  useEffect(()=>
  {
    setLoading(true);
    getNurseryEntry();
    getNurseryDetails();
    setTimeout(()=>
    {
      getNurseryEntry();
      getNurseryDetails();
      setLoading(false);
    },2000)
    db.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS CorrectiveAction (id INTEGER PRIMARY KEY AUTOINCREMENT,Nursery varchar, descOfNonConf VARCHAR,Date datetime)',
      );
    });
  },[])


  const getNurseryDetails=()=>
  {
    db.transaction(tx=>
      { 
          tx.executeSql(
              'SELECT * FROM NurseryDetials',
              [],
              (_, { rows }) => {
                setNurseryDetails(rows._array);
      })
  })     
  }

  const getNurseryEntry=()=>
  {
    if(nursery!==undefined)
    {
      
      db.transaction(tx=>
        { 
            tx.executeSql(
                'SELECT * FROM CorrectiveAction where Nursery=?',
                [nursery],
                (_, { rows }) => {
                  if (rows.length > 0) {
                    setGetNurseryFromEntry(rows._array);
                    const date=new Date(rows._array[0].Date)
                    setNurseryDateForUpdate(date);
                  }
                  else
                  {
                    console.log('Data Not Found on this nursery');
                  }
                 
        })
    })     
    }
   
  }


  const renderLabel = (label) => {
    if (isFocus) {
      return (
        <Text style={[styles.label,{color:'blue',fontSize:15,fontWeight:'bold'}]}>
        {label}
        </Text>
      );
    }
    return null;
  };

  const addData = () => {
    if (descOfNonConf.trim() === '') {
      setError('Corrective Action is required');
      return;
    }
    else
    {  
      if (data.some((item) => item.descOfNonConf === descOfNonConf)) {
        setError('Corrective Action already exists');
      }
      else
      {
        setData([...data, { descOfNonConf, dateBeClosed }]);
        setDescOfNonConf('');
        setError('')
      }
      
    } 
   
  };

  const addDataUpdate = () => {
    if (descOfNonConf.trim() === '') {
      setError('Corrective Action is required');
      return;
    }
    else
    {  
      if (getNurseryFromEntry.some((item) => item.descOfNonConf === descOfNonConf)) {
        setError('Corrective Action already exists');
      }
      else
      {
        setGetNurseryFromEntry([...getNurseryFromEntry, { descOfNonConf,dateBeClosed }]);
        setDescOfNonConf('');
        setError('')
      }
      
    } 
   
  };

  const handleEditText = (index, descOfNonConf) => {
    if(descOfNonConf=='')
    {
      setError('Please Update the Corrective Action');
    }
    else
    {
      const newArray = [...data];
      newArray[index] = {descOfNonConf};
      setData(newArray);
      setDescOfNonConf('');
      setEditIndex(-1);
      if(error!=='')
      {
        setError('');
      }
      setEdit('')
      setEditText('')
    }
    
  };


  const handleEditTextUpdate = (index, descOfNonConf) => {
    if(descOfNonConf=='')
    {
      setError('Please Update the Corrective Action');
    }
    else
    {
      const newArray = [...getNurseryFromEntry];
      newArray[index] = {descOfNonConf};
      setGetNurseryFromEntry(newArray);
      setDescOfNonConf('');
      setEditIndex(-1);
      if(error!=='')
      {
        setError('');
      }
      setEdit('')
      setEditText('')
    }
    
  };


  const deleteRow = (index) => {
    const newData = [...data];
    newData.splice(index, 1);
    setData(newData);
  };

  const deleteRowForUpdate = (index) => {
    const newData = [...getNurseryFromEntry];
    newData.splice(index, 1);
    setGetNurseryFromEntry(newData);
  };


  const SubmitData=()=>
  {
    if(data.length <= 0)
  {
    setError('Please Enter Corrective Action Info');
    return
  }
  else
  {
    let myNursery;
    if(selectedNursery==undefined)
    {
      myNursery=nursery;
    }
    else
    {
      myNursery=selectedNursery;
    }
    console.log(myNursery);
    db.transaction(tx => {
      data.map((i)=>
      {
        tx.executeSql('INSERT INTO CorrectiveAction (Nursery,descOfNonConf, Date) VALUES (?, ?, ?)',
         [myNursery,i.descOfNonConf, i.dateBeClosed.toISOString().substr(0, 10)],
         (tx,result)=>
         {
            setSuccess('Data Saved Successfully');
            setTimeout(()=>
            {
              setError('');
              setSuccess('');
            },5000)
            setError('');
         },
         (tx,error)=>
         {
          setError('Sorry Data Not Saved Please Try Again')
         }
      )
    })
    })
  }
  setTimeout(()=>
  {
     if(error!='')
     {
      console.log('okay')
     }
     else
     {
      goBack();
     }
  },1000)
  }
  const goBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      // Handle case when there is no previous screen
    }
  };

  const onPress=()=>
  {

    db.transaction(tx=>
      {
        tx.executeSql('SELECT * FROM CorrectiveAction',
        [],
        (tx,result)=>
        {
          for(let i=0;i<result.rows.length;i++)
          {
            const {Nursery,descOfNonConf,Date}=result.rows.item(i);
            console.log(`Nursery:${Nursery},descOfNonConf:${descOfNonConf},Date:${Date}`);
          }
        }
        )
      })
  }


  const UpdateData=()=>
  {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM CorrectiveAction WHERE  Nursery= ?',
        [nursery],
        (_, result) => {
          console.log('Rows affected:', result.rowsAffected);
        },
        (_, error) => {
          console.log('Error deleting data:', error);
        }
      );
        getNurseryFromEntry.map((i)=>
        {
          tx.executeSql(
            'INSERT INTO CorrectiveAction (Nursery, descOfNonConf, Date) VALUES (?,?, ?)',
            [nursery,i.descOfNonConf,nurseryDateForUpdate.toISOString().substr(0, 10)],
            (_, result) => {
              console.log(result.rowsAffected);
              setSuccess('Data Updated Successfully');
              setTimeout(()=>
              {
                setSuccess('');
              },5000)
              setError('');
            },
            (_, error) => {
              setError('Sorry Data Not Updated Please Try Again');
              console.log(error)
            }
          )
          })
      })
    setTimeout(()=>
    {
       if(error!='')
       {
        console.log('okay')
       }
       else
       {
        goBack();
       }
    },1500)
  }


  if(loading)
  {
    return(
      <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
        <ActivityIndicator size={34} color="blue"/>
      </View>
    )
  }
  


  if(getNurseryFromEntry.length>0)
  {
    return(
      <View style={{padding:15}}>

<ScrollView style={{borderWidth:0.8,borderColor:'gray', borderRadius:8}}>



     <View style={styles.container}>
     {renderLabel('Date to be Closed')}
      <View style={[styles.dropdown,{justifyContent:'center'}]}>
      <TouchableOpacity
     onPress={() => setShowPicker(true)}
      >
        <View style={{flexDirection:'row'}}>
      <Text style={{marginLeft:10,fontWeight:'bold'}} editable={false}>{nurseryDateForUpdate.toLocaleDateString()}</Text>
      <Ionicons name="ios-calendar" size={25} color="#1b35ff" style={{position:'absolute',right:0,top:-3}}/>
      </View>
      </TouchableOpacity>
            {showPicker && (
        <DateTimePicker
          testID="DatePicker"
          value={nurseryDateForUpdate}
          mode="date"
          minimumDate={new Date()}
          display="spinner"
          onChange={handleDateChangeForUpdate}
          style={styles.picker}
          textColor="#FF0000"
          pickerStyle={styles.pickerItem}
        />
      )}    
  </View>
</View>

    <View style={styles.container}>

      <View style={styles.HeadContainer}>
    <Text style={styles.ObservHead}>Description of Non-conformance</Text>
    </View>
    <View style={[styles.ObservDropdown,{justifyContent:'center',padding:5}]}>
        <TextInput 
        style={[styles.ObservInfo,{justifyContent:'center'}]}
        placeholder="Enter Your Corrective Action Info"
        onChangeText={setDescOfNonConf}
        value={descOfNonConf}
        />
        <TouchableOpacity style={{padding:5,marginLeft:30}}
        onPress={addDataUpdate}
        >
        <AntDesign name="plussquare" size={28} color="green"/>
        </TouchableOpacity>
    </View>

    <View style={styles.errorField}>
    {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : null}
      </View>
      {/* <Button title='check' onPress={onPress}/> */}
 
    <View style={styles.ObservDropdownTable}>
    <DataTable>


    <DataTable.Header>
          <View style={{width:'60%'}}>
          <DataTable.Title><Text style={[styles.TableTitles,styles.content]}>Description of Non-conformance</Text></DataTable.Title>
          </View>
       
          <View style={styles.widthOfTableContent}>
          <DataTable.Title><Text style={[styles.TableTitles,styles.content]}>{edit?edit:'Edit'}</Text></DataTable.Title>
          </View>
          {
            edit?
            <View style={styles.widthOfTableContent}>
            <DataTable.Title ><Text style={[styles.TableTitles,styles.content]}>Cancel</Text></DataTable.Title>
            </View>      
            :
            <View style={styles.widthOfTableContent}>
            <DataTable.Title ><Text style={[styles.TableTitles,styles.content]}></Text></DataTable.Title>
            </View>      
          }
            </DataTable.Header>
        
          {getNurseryFromEntry.map((item, index) => 
          (
            
          <DataTable.Row key={index}>
            {editIndex === index ?
          (
               <>

                <View style={{width:'60%'}}>
            <DataTable.Cell>      
          <View  style={[{justifyContent:'center',alignItems:'center'}]}>
        <TextInput 
       style={[{justifyContent:'center',alignItems:'center'}]}
       placeholder="Enter your Corrective Action Info"
        onChangeText={(e)=>
        {
          setEditText(e);
        }}
        value={editText}
        
        />
        </View>
          
            </DataTable.Cell>
            </View>
            <View style={[styles.widthOfTableContent]}>
            <DataTable.Cell>
              <TouchableOpacity
               onPress={() =>{ handleEditTextUpdate(index, editText)
              }}
              >
             <EvilIcons name="refresh" size={35} color="black" />
              </TouchableOpacity>
    
           </DataTable.Cell>
           </View>
           <View style={[styles.widthOfTableContent]}>
           <DataTable.Cell>
            <TouchableOpacity onPress={() =>{ setEditIndex(-1); setEdit('');  setEditText(''); 
      if(error!=='')
      {
        setError('');
      }}} >
            <MaterialIcons name="cancel" size={24} color="black" />
            </TouchableOpacity>
            </DataTable.Cell>
            </View>
           

                 </>
          ):(
            <>

            <View style={{width:200}}>
            <DataTable.Cell><Text>{item.descOfNonConf}</Text></DataTable.Cell>
            </View>
           
            <View  style={[styles.widthOfTableContent,styles.content]}>
            <DataTable.Cell>
              <TouchableOpacity
              onPress={()=>{
                setEditIndex(index)
                 setEdit('Update');
              }}
              >
              <FontAwesome name="edit" size={27} color="black" />
              </TouchableOpacity>
        
           </DataTable.Cell>
           </View>
           <View  style={[styles.widthOfTableContent,styles.content]}>
           <DataTable.Cell>
            <TouchableOpacity onPress={() => deleteRowForUpdate(index)} >
            <AntDesign name="closesquare" size={24} color="red" />
            </TouchableOpacity>
            </DataTable.Cell>
            </View>
            </>
          )
  }
          </DataTable.Row>
         
        ))}

      </DataTable>
    </View>
    </View>
    {success?<Text style={styles.successText}>{success}</Text>:null}
    <View style={{paddingLeft:10,paddingRight:10}}>
 <TouchableOpacity 
 onPress={UpdateData}
 style={styles.Submitbutton}>
 <FontAwesome name="file" size={24} color="white"  style={styles.fileSubmit}/>
      <Text style={styles.SubmitbuttonText}>Update</Text>
    </TouchableOpacity>
    </View>
    </ScrollView>

    </View>
    )
  }



  return (
    <View style={{padding:15}}>

<ScrollView style={{borderWidth:0.8,borderColor:'gray', borderRadius:8}}>

     {/* <DropDownSearch
        placeholderText={"Select Nursery"}
        data={nurseryDetails}
        label={"Name Of Nursery"}
        maxHeight={250}
        handleChange={(e)=> setIsselectedNursery(e)}
        selectedValue={selectedNursery}
      /> */}


     <View style={styles.container}>
     {renderLabel('Date to be Closed')}
      <View style={[styles.dropdown,{justifyContent:'center'}]}>
      <TouchableOpacity
     onPress={() => setShowPicker(true)}
      >
        <View style={{flexDirection:'row'}}>
      <Text style={{marginLeft:10,fontWeight:'bold'}} editable={false}>{dateBeClosed.toLocaleDateString()}</Text>
      <Ionicons name="ios-calendar" size={25} color="#1b35ff" style={{position:'absolute',right:0,top:-3}}/>
      </View>
      </TouchableOpacity>
            {showPicker && (
        <DateTimePicker
          testID="DatePicker"
          value={dateBeClosed}
          mode="date"
          minimumDate={new Date()}
          display="spinner"
          onChange={handleDateChange}
          style={styles.picker}
          textColor="#FF0000"
          pickerStyle={styles.pickerItem}
        />
      )}    
  </View>
</View>

    <View style={styles.container}>

      <View style={styles.HeadContainer}>
    <Text style={styles.ObservHead}>Description of Non-conformance</Text>
    </View>
    <View style={[styles.ObservDropdown,{justifyContent:'center',padding:5}]}>
        <TextInput 
        style={[styles.ObservInfo,{justifyContent:'center'}]}
        placeholder="Enter Your Corrective Action Info"
        onChangeText={setDescOfNonConf}
        value={descOfNonConf}
        />
        <TouchableOpacity style={{padding:5,marginLeft:30}}
        onPress={addData}
        >
        <AntDesign name="plussquare" size={28} color="green"/>
        </TouchableOpacity>
    </View>

    <View style={styles.errorField}>
    {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : null}
      </View>
      {/* <Button title='check' onPress={onPress}/> */}
 
    <View style={styles.ObservDropdownTable}>
    <DataTable>


    <DataTable.Header>
          <View style={{width:'60%'}}>
          <DataTable.Title><Text style={[styles.TableTitles,styles.content]}>Description of Non-conformance</Text></DataTable.Title>
          </View>
          {/* <View style={styles.widthOfTableContent}>
          <DataTable.Title><Text  style={[styles.TableTitles,styles.content]}>Date</Text></DataTable.Title>
          </View> */}
          <View style={styles.widthOfTableContent}>
          <DataTable.Title><Text style={[styles.TableTitles,styles.content]}>{edit?edit:'Edit'}</Text></DataTable.Title>
          </View>
          {
            edit?
            <View style={styles.widthOfTableContent}>
            <DataTable.Title ><Text style={[styles.TableTitles,styles.content]}>Cancel</Text></DataTable.Title>
            </View>      
            :
            <View style={styles.widthOfTableContent}>
            <DataTable.Title ><Text style={[styles.TableTitles,styles.content]}></Text></DataTable.Title>
            </View>      
          }
            </DataTable.Header>
         


        {/* <DataTable.Header>
        <View style={{width:260}}>
          <DataTable.Title><Text style={styles.TableTitles}>Description of Non-conformance</Text></DataTable.Title>
          </View>
          <DataTable.Title><Text  style={styles.TableTitles}>Date</Text></DataTable.Title>
          <View style={{width:60,paddingLeft:50}}>
          <DataTable.Title></DataTable.Title>
          </View>
          </DataTable.Header> */}
          {data.map((item, index) => 
          (
            
          <DataTable.Row key={index}>
            {editIndex === index ?
          (
               <>

                <View style={{width:'60%'}}>
            <DataTable.Cell>      
          <View  style={[{justifyContent:'center',alignItems:'center'}]}>
        <TextInput 
       style={[{justifyContent:'center',alignItems:'center'}]}
       placeholder="Enter your Corrective Action Info"
        onChangeText={(e)=>
        {
          setEditText(e);
        }}
        value={editText}
        
        />
        </View>
          
            </DataTable.Cell>
            </View>
            {/* <View style={[{width:'20%'}]}>
            <DataTable.Cell><Text>{item.dateBeClosed.toISOString().substr(0, 10)}</Text></DataTable.Cell>
            </View> */}
            <View style={[styles.widthOfTableContent]}>
            <DataTable.Cell>
              <TouchableOpacity
               onPress={() =>{ handleEditText(index, editText)
              }}
              >
             <EvilIcons name="refresh" size={35} color="black" />
              </TouchableOpacity>
    
           </DataTable.Cell>
           </View>
           <View style={[styles.widthOfTableContent]}>
           <DataTable.Cell>
            <TouchableOpacity onPress={() =>{ setEditIndex(-1); setEdit('');  setEditText(''); 
      if(error!=='')
      {
        setError('');
      }}} >
            <MaterialIcons name="cancel" size={24} color="black" />
            </TouchableOpacity>
            </DataTable.Cell>
            </View>
           

                 </>
          ):(
            <>

            <View style={{width:200}}>
            <DataTable.Cell><Text>{item.descOfNonConf}</Text></DataTable.Cell>
            </View>
            {/* <View  style={[{width:'20%',marginLeft:15},styles.content]}>
            <DataTable.Cell><Text>{item.dateBeClosed.toISOString().substr(0, 10)}</Text></DataTable.Cell>
            </View> */}
            <View  style={[styles.widthOfTableContent,styles.content]}>
            <DataTable.Cell>
              <TouchableOpacity
              onPress={()=>{
                setEditIndex(index)
                 setEdit('Update');
              }}
              >
              <FontAwesome name="edit" size={27} color="black" />
              </TouchableOpacity>
        
           </DataTable.Cell>
           </View>
           <View  style={[styles.widthOfTableContent,styles.content]}>
           <DataTable.Cell>
            <TouchableOpacity onPress={() => deleteRow(index)} >
            <AntDesign name="closesquare" size={24} color="red" />
            </TouchableOpacity>
            </DataTable.Cell>
            </View>


            {/* <View style={{width:260}}>
            <DataTable.Cell><Text>{item.descOfNonConf}</Text></DataTable.Cell>
            </View>
            <DataTable.Cell><Text>{item.dateBeClosed.toISOString().substr(0, 10)}</Text></DataTable.Cell>
            <View style={{paddingLeft:10}}>
           <DataTable.Cell>
            <TouchableOpacity onPress={() => deleteRow(index)}>
            <AntDesign name="closesquare" size={24} color="red" />
            </TouchableOpacity>
            </DataTable.Cell>
            </View> */}
            </>
          )
  }
          </DataTable.Row>
         
        ))}

      </DataTable>
    </View>
    </View>
    {success?<Text style={styles.successText}>{success}</Text>:null}
    <View style={{paddingLeft:10,paddingRight:10}}>
 <TouchableOpacity 
 onPress={SubmitData}
 style={styles.Submitbutton}>
 <FontAwesome name="file" size={24} color="white"  style={styles.fileSubmit}/>
      <Text style={styles.SubmitbuttonText}>submit</Text>
    </TouchableOpacity>
    </View>
    </ScrollView>

    </View>
    
  );
};

export default CorrectiveAction;
