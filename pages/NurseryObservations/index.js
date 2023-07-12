import React from "react";
import { 
   View,
   Text,
   TouchableOpacity,
   TextInput,
   Alert, 
   ActivityIndicator,
   ScrollView}  from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import { useState,useEffect } from "react";
import styles from "./style";
import { Button } from "@rneui/base";
import {DataTable, Modal} from 'react-native-paper';
import { 
  FontAwesome,
  Ionicons,
  EvilIcons,
  AntDesign,
  MaterialIcons
} from '@expo/vector-icons';

import {DropDownSearch} from "../../components";

import * as SQLite from 'expo-sqlite';


const db = SQLite.openDatabase('mydb.Nursery');
const NurseryObservations = ({route,navigation}) => {

  const {
    selectedNursery,
    nurDate,
    nursery,
    filterSyncedData
  }=route.params;
 

  const [showPicker, setShowPicker] = useState(false);
  const [isFocus,setIsFocus]=useState(true);
  const [Observation,setObservations]=useState('');
  const [data, setData] = useState([]);
  const [error, setError] = useState('');
  const [success,setSuccess]=useState('');
  const [nurseryDetails,setNurseryDetails]=useState([]);

  const [editObser,setEditObser]=useState('');


  const [getNurseryFromEntry,setGetNurseryFromEntry]=useState([]);
  const [statusForObser,setStatusForObser]=useState(false);

  const [nurseryDate,setNurseryDate]=useState(new Date());

  const [nurseryDateForUpdate,setNurseryDateForUpdate]=useState(new Date());

  

   const [edit,setEdit]=useState('')

   const [editIndex, setEditIndex] = useState(-1);

   const [editText,setEditText]=useState('');

   const [loading,setLoading]=useState(false)


  useEffect(()=>
  {
  console.log(nursery)
  setLoading(true);
    getNurseryDetails();
    getNurseryEntry();
    setTimeout(()=>
    {
      getNurseryDetails();
      getNurseryEntry();
      setLoading(false);
    },2000)
    db.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS NurseryObservation (id INTEGER PRIMARY KEY AUTOINCREMENT, Nusery VARCHAR, Observation VARCHAR,Date datetime)',
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
                'SELECT * FROM NurseryObservation where Nusery=?',
                [nursery],
                (_, { rows }) => {
                  if (rows.length > 0) {
                    setGetNurseryFromEntry(rows._array);
                    setStatusForObser(true);
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
    else
    {
      db.transaction(tx=>
        { 
            tx.executeSql(
                'SELECT * FROM NurseryObservation where Nusery=?',
                [selectedNursery],
                (_, { rows }) => {
                  if (rows.length > 0) {
                    setGetNurseryFromEntry(rows._array);
                    setStatusForObser(true);
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
    if (Observation.trim() === '') {
      setError('Observation is required');
      return;
    }
    else
    {  
      if (data.some((item) => item.Observation === Observation)) {
        setError('Observation already exists');
      }
      else
      {
        setData([...data, { Observation }]);
        setObservations('');
        setError('')
      }
      
    } 
   
  };

  const addDataUpdate = () => {
    if (Observation.trim() === '') {
      setError('Observation is required');
      return;
    }
    else
    {  
      if (getNurseryFromEntry.some((item) => item.Observation === Observation)) {
        setError('Observation already exists');
      }
      else
      {
        setGetNurseryFromEntry([...getNurseryFromEntry, { Observation }]);
        setObservations('');
        setError('')
      }
      
    } 
   
  };

  const handleEditText = (index) => {
    if(Observation=='')
    {
      setError('Sorry Please Update Observation...')
    }
    else
    {
    const newArray = [...data];
    newArray[index] = {Observation};
    setData(newArray);
    setObservations('');
    setEditIndex(-1);
    if(error!=='')
    {
      setError('')
    }
    setEdit('')
    setEditText('')
  }
  };

  const handleEditTextUpdate = (index) => {
    if(Observation=='')
    {
      setError('Sorry Please Update Observation...')
    }
    else
    {
      
    const newArray = [...getNurseryFromEntry];
    newArray[index] = {Observation};
    setGetNurseryFromEntry(newArray);
    setObservations('');
    setEditIndex(-1);
    if(error!=='')
    {
      setError('')
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

  const deleteRowForUpdate=(index)=>
  {
    const newData = [...getNurseryFromEntry];
    newData.splice(index, 1);
    setGetNurseryFromEntry(newData);
  }
  
  let isSubmitHandled = false;

  const SubmitData=()=>
  {
    if(data.length <= 0)
  {
    setError('Please Enter Observation Details');
    return
  }
  else
  {
    let myNursery;
    let myDate;
    if(selectedNursery!==undefined)
    {
      myNursery=selectedNursery;
      myDate=nurDate;
    }
    else
    {
      myNursery=nursery;  
      myDate=nurseryDate.toISOString().substr(0, 10);
    }

    db.transaction(tx => {
      data.map((i)=>
      {
        tx.executeSql('INSERT INTO NurseryObservation (Nusery, Observation, Date) VALUES (?,?, ?)',
         [myNursery,i.Observation, myDate],
         (tx,result)=>
         {
            setSuccess('Data Saved Successfully');
            setTimeout(()=>
            {
              setSuccess('');
              setError('');
            },5000)
            setError('');
         },
         (tx,error)=>
         {
          setError('Sorry Data Not Saved Please Try Again');
          console.log(error)
         }
      )
    })
    })
  }
  if (!isSubmitHandled) {
    isSubmitHandled = true;

    setTimeout(() => {
      if (error !== '') {
        console.log('okay');
      } else {
        navigation.goBack();
      }

      // Reset the flag variable after handling the submit 
      isSubmitHandled = false;
    }, 100);
  }
  }

  const goBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      // Handle case when there is no previous screen
    }
  };



  const updateData=()=>
  {
    if(getNurseryFromEntry.length <= 0)
    {
      setError('Please Enter Observation Details');
    }
    else
    {
      let myNursery;
      let myDate;
      if(selectedNursery==undefined)
      {
        myNursery=nursery;
        myDate=nurseryDateForUpdate.toISOString().substr(0, 10);
      }
      else
      {
        myNursery=selectedNursery;
        myDate=nurDate
      }
      setError('');
      db.transaction(tx => {
        tx.executeSql(
          'DELETE FROM NurseryObservation WHERE  Nusery= ?',
          [myNursery],
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
              'INSERT INTO NurseryObservation (Nusery, Observation, Date) VALUES (?,?, ?)',
              [myNursery,i.Observation,myDate],
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
        if (!isSubmitHandled) {
          isSubmitHandled = true;
      
          setTimeout(() => {
            if (error !== '') {
              console.log('okay');
            } else {
              navigation.goBack();
            }
      
            // Reset the flag variable after handling the submit
            isSubmitHandled = false;
          }, 100);
        }
    }
   
  }



  const onPress=()=>
  {

    db.transaction(tx=>
      {
        tx.executeSql('SELECT * FROM NurseryObservation',
        [],
        (tx,result)=>
        {
          for(let i=0;i<result.rows.length;i++)
          {
            const {Nusery,Observation,Date}=result.rows.item(i);
            console.log(`Nusery:${Nusery},Observation:${Observation},Date:${Date}`);
          }
        }
        )
      })

 
  }



  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || nurseryDate;
    setShowPicker(false);
    setNurseryDate(currentDate);
  };

  const showDatePickerModal = () => {
    setShowPicker(true);
  };

  const handleDateChangeForUpdate = (event, selectedDate) => {
    const currentDate = selectedDate || nurseryDateForUpdate;
    setShowPicker(false);
    setNurseryDateForUpdate(currentDate);
  };


  if(loading)
  {
    return(
      <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
        <ActivityIndicator size={34}  color="blue"/>
      </View>
    )
  }
  


  if(getNurseryFromEntry.length>0||statusForObser)
  {
    
    return(
      <View style={{padding:16}}>
      <ScrollView style={styles.container}>
    {nursery!==undefined&&
        <View style={styles.container}>
        {renderLabel('Date')}
         <View style={[styles.dropdown,{justifyContent:'center'}]}>
         <TouchableOpacity
        onPress={showDatePickerModal}
         >
           <View style={{flexDirection:'row'}}>
         <Text style={{marginLeft:10,fontWeight:'bold'}} editable={false}>{nurseryDateForUpdate.toLocaleDateString()}</Text>
         <Ionicons name="ios-calendar" size={25}  color="#1b35ff" style={{position:'absolute',right:0,top:-3}}/>
         </View>
         </TouchableOpacity>
               {showPicker && (
           <DateTimePicker
             testID="DatePicker"
             minimumDate={new Date()}
             value={nurseryDateForUpdate}
             mode="date"
             display="spinner"
             onChange={handleDateChangeForUpdate}
           /> 
         )}    
      </View>
      </View>
         
               }
      
          <View style={{paddingTop:5}}>
      
            <View style={styles.HeadContainer}>
          <Text style={styles.ObservHead}>Nursery Observation Information</Text>
          </View>
          <View style={[styles.ObservDropdown,{justifyContent:'center',padding:7}]}>
              <TextInput 
              style={[styles.ObservInfo,{justifyContent:'center'}]}
              placeholder="Enter Your Observations"
              onChangeText={setObservations}
              value={Observation}
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
               
                <DataTable.Title><Text style={[styles.TableTitles,styles.content]}>Observation</Text></DataTable.Title>
          
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
               
                  <DataTable.Cell>
                <View style={[{justifyContent:'center',padding:7}]}>
              <TextInput 
      
              />
              </View>
                
                  </DataTable.Cell>
                  
      
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
                  setObservations('');
                  if(error!=='')
                  {
                    setError('');
                  }
                }} >
                  <MaterialIcons name="cancel" size={24} color="black" />
                  </TouchableOpacity>
                  </DataTable.Cell>
                  </View>
                  </>
                ) :
                (
                  <>
                  
                  <DataTable.Cell><Text>{item.Observation}</Text></DataTable.Cell>
      
                  <View  style={[styles.widthOfTableContent,styles.content]}>
                  <DataTable.Cell>
                    {filterSyncedData==undefined&&
                     <TouchableOpacity
                     onPress={()=>{
                       setEditIndex(index)
                        setEdit('Update');
                        setObservations(item.Observation)
                     }}
                     >
                     <FontAwesome name="edit" size={27} color="black" />
                     </TouchableOpacity>
                    }
              
                 </DataTable.Cell>
                 </View>
                 <View  style={[styles.widthOfTableContent,styles.content]}>
                 <DataTable.Cell>
                  {
                  filterSyncedData==undefined&&
                  <TouchableOpacity onPress={() => deleteRowForUpdate(index)} >
                  <AntDesign name="closesquare" size={24} color="red" />
                  </TouchableOpacity>
                  }
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
          {
            filterSyncedData==undefined&&
            <View style={{paddingLeft:10,paddingRight:10}}>
            <TouchableOpacity 
            onPress={updateData}
             style={styles.Submitbutton}>
             <FontAwesome name="file" size={24} color="white"  style={styles.fileSubmit}/>
                  <Text style={styles.SubmitbuttonText}>Update</Text>
                </TouchableOpacity>
                </View>      
          }
         
          </ScrollView>
          </View>
    )
  }


  return (
    <View style={{padding:16}}>
<ScrollView style={styles.container}>

    {selectedNursery==undefined?
  <View style={styles.container}>
  {renderLabel('Date')}
   <View style={[styles.dropdown,{justifyContent:'center'}]}>
   <TouchableOpacity
  onPress={showDatePickerModal}
   >
     <View style={{flexDirection:'row'}}>
   <Text style={{marginLeft:10,fontWeight:'bold'}} editable={false}>{nurseryDate.toLocaleDateString()}</Text>
   <Ionicons name="ios-calendar" size={25}  color="#1b35ff" style={{position:'absolute',right:0,top:-3}}/>
   </View>
   </TouchableOpacity>
         {showPicker && (
     <DateTimePicker
       testID="DatePicker"
       minimumDate={new Date()}
       value={nurseryDate}
       mode="date"
       display="spinner"
       onChange={handleDateChange}
     /> 
   )}    
</View>
</View>
  :  
  null
  }

   


    <View style={{paddingTop:5}}>

      <View style={styles.HeadContainer}>
    <Text style={styles.ObservHead}>Nursery Observation Information</Text>
    </View>
    <View style={[styles.ObservDropdown,{justifyContent:'center',padding:7}]}>
        <TextInput 
        style={[styles.ObservInfo,{justifyContent:'center'}]}
        placeholder="Enter Your Observations"
        onChangeText={setObservations}
        value={Observation}
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
        
          <DataTable.Title><Text style={[styles.TableTitles,styles.content]}>Observation</Text></DataTable.Title>
         

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
         
          {data.map((item, index) => 
           (
           
          <DataTable.Row key={index}>
            {editIndex === index ?
          (
            <>
         
            <DataTable.Cell>
          <View style={[{justifyContent:'center',padding:7}]}>
        <TextInput 
        
        />
        </View>
          
            </DataTable.Cell>
           
          

            <View style={[styles.widthOfTableContent]}>
            <DataTable.Cell>
              <TouchableOpacity
               onPress={() =>{ handleEditText(index)
              }}
              >
             <EvilIcons name="refresh" size={35} color="black" />
              </TouchableOpacity>
    
           </DataTable.Cell>
           </View>
           <View style={[styles.widthOfTableContent]}>
           <DataTable.Cell>
            <TouchableOpacity onPress={() =>{ setEditIndex(-1); setEdit('');  setEditText('');
            setObservations('');
            if(error!=='')
            {
              setError('');
            }
          }} >
            <MaterialIcons name="cancel" size={24} color="black" />
            </TouchableOpacity>
            </DataTable.Cell>
            </View>
            </>
          ) :
          (
            <>
        
            <DataTable.Cell><Text>{item.Observation}</Text></DataTable.Cell>
            

            {/* <View  style={[{width:'20%',marginLeft:15},styles.content]}>
            <DataTable.Cell><Text>{nurDate.toISOString().substr(0, 10)}</Text></DataTable.Cell>
            </View> */}

            <View  style={[styles.widthOfTableContent,styles.content]}>
            <DataTable.Cell>
              <TouchableOpacity
              onPress={()=>{
                setEditIndex(index)
                 setEdit('Update');
                 setObservations(item.Observation)
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

export default NurseryObservations;
