import React  from "react";
import { 
  View, 
  Text,
  TextInput,
  ScrollView,
  Button,
  ActivityIndicator,
   TouchableOpacity ,
   LayoutAnimation,
   Alert,
   Modal,
   Image
  } from "react-native";
import {
  DropDownSearch,
  DropDown 
} from "../../components";
import DropDownForNormal from "../../components/DropdownForNormal";
import DropDownSearchForSpecies from "../../components/DropdownSearch/DropdownSearchForSpecies";
import styles from "./style";
import { 
  useState,
  useEffect 
} from "react";
import { Picker } from '@react-native-picker/picker';
import * as SQLite from 'expo-sqlite';
import {AccordianList} from "../../components";
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useFocusEffect } from '@react-navigation/native';
import { 
  EvilIcons,
  Ionicons ,
  AntDesign,
  MaterialCommunityIcons,
  MaterialIcons
} from '@expo/vector-icons';
import mapLogo from '../../assets/map.png';
import currentLocation from '../../assets/currentLocation.png'

import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import Icon from 'react-native-vector-icons/MaterialIcons';
import NurseryObservations from "../NurseryObservations";
import CorrectiveAction from "../CorrectiveAction";

import MapView,{Marker,Callout} from 'react-native-maps';
import { MultipleSelectList } from "react-native-dropdown-select-list";
import { useIsFocused } from '@react-navigation/native';
import * as Location from 'expo-location';
import DropDownForlatlon from "../../components/DropdownForlatlon";








const db = SQLite.openDatabase('mydb.Nursery');

const NurseryAuditChecklist = (props) => {
  const { navigation } = props;
  
  const isFocused = useIsFocused();
  const [refreshCount, setRefreshCount] = useState(0);

  const [visible,setVisible]=useState(false);

  const [selectedNursery, setIsselectedNursery] = useState(null);

  const [selectedItems, setSelectedItems] = useState([]);

  const [nurseryDetails,setNurseryDetails]=useState([]);
  const [nurseryAuditDetails,setNurseryAuditDetails]=useState([]);
  const [speciesDetails,setSpeciesDetails]=useState([]);
  const [selectedSpecies,setSelectedSpecies]=useState(null);


  const [nurObs,setNurObs]=useState(false);
  const [corrac,setCorrAc]=useState(false);

  const [downiconObj,setDownIconObj]=useState(true);
  const [downiconCorr,setDownIconCorr]=useState(true);


  const [upiconObj,setUpIconObj]=useState(false);
  const [upiconCorr,setUpIconCorr]=useState(false);

  const [phoneNumber,setPhoneNumber]=useState('');
 

  const [isFocus,setIsFocus]=useState(true);


  const [nurAudEntry,setNurAudEntry]=useState([]);

  const [nurLoca,setNurLoc]=useState('');
  const [representative,setRepresentative]=useState('0');
  const [representativeName,setRepresentativeName]=useState('');
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [altitude,setAltitude]=useState('');
  const [que1,setQue1]=useState('0');
  const [que2,setQue2]=useState('0');
  const [que3,setQue3]=useState('0');

  const [isFocusPhn,setisFocusPhn]=useState(false);
  const [isFocusAlt,setisFocusAlt]=useState(false);


  const [dateOfAudit, setDateOfAudit] = useState(new Date());
  const [showPicker,setShowPicker]=useState(false);


  const handleDateChange = date => {
    setDateOfAudit(date);
    setShowPicker(false);
  };

  const [loading,setLoading]=useState(true);
  const [dots, setDots] = useState('');

  const [latFromGps,setLatFromGps]=useState('');
  const[langFromGps,setLangFromGps]=useState('');

  useEffect(()=>
  {
    getNurseryDetails();
    getNurseryAuditDetails();
    getSpeciesDetails();
    createTableOfAudit();
    getNursery();
      setTimeout(()=>
      {
        getNurseryDetails();
        getNurseryAuditDetails();
        getSpeciesDetails();
        createTableOfAudit();
        getNursery();
      },1000)
      const interval = setInterval(() => {
        setDots((prevDots) => {
          if (prevDots.length === 5) {
            return '';
          } else {
            return prevDots + '.';
          }
        });
      }, 500);
      
      return () => {
        clearInterval(interval)
      };
     
  },[isFocused])


  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      
        setTimeout(()=>
        {
          getNursery();
          setLoading(false)
        },1000)
        const interval = setInterval(() => {
          setDots((prevDots) => {
            if (prevDots.length === 5) {
              return '';
            } else {
              return prevDots + '.';
            }
          });
        }, 500);
        
        return () => {
          clearInterval(interval)
        };
    }, [isFocused])
  );

  async function getLocationAsync() {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission to access location was denied');
      return;
    }
    else
    {
        // Location permission granted, now get the user's location
  let location = await Location.getCurrentPositionAsync({});
  setLatFromGps(location.coords.latitude);
  setLangFromGps(location.coords.longitude)
  // console.log('User location:', location.coords.latitude, location.coords.longitude);
    }
   
}
 
  const createTableOfAudit=()=>
  {
    db.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS NurseryAuditAnswers (id INTEGER PRIMARY KEY AUTOINCREMENT,nursery varchar, auditcriterionid varchar,question varchar,maxscore integer,comment varchar)',
      );
    });
    db.transaction(tx=>
      
      {
        tx.executeSql('create table if not exists NurseryAuditEntryDetails(id INTEGER PRIMARY KEY AUTOINCREMENT,nursery varchar,location varchar,species TEXT,date date,typeOfRepresentative TEXT,nameOfRepresentative Text,Latitude varchar,Longitude varchar,Altitude varchar)')
      })
  }


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

  const getNurseryAuditDetails=()=>
  {
    db.transaction(tx=>
      { 
          tx.executeSql(
              'SELECT * FROM NurseryAuditDetails',
              [],
              (_, { rows }) => {
                setNurseryAuditDetails(rows._array);
      })
  })     
  }

  const getSpeciesDetails=()=>
  {
    db.transaction(tx=>
      { 
          tx.executeSql(
              'SELECT * FROM SpeciesDetails',
              [],
              (_, { rows }) => {
                setSpeciesDetails(rows._array);
      })
  })     
  }


  const getNursery=()=>
  {
    const isTableEmpty = () => {
      return new Promise((resolve, reject) => {
        db.transaction((tx) => {
          tx.executeSql(
            'SELECT COUNT(*) as count FROM NurseryAuditEntryDetails',
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
    
    isTableEmpty()
      .then((empty) => {
       if(empty)
       {
        console.log('NurseryAuditEntryDetails null')
       }
       else
       {
        db.transaction(tx=>
          {
            tx.executeSql('SELECT * FROM NurseryAuditEntryDetails',
            [],
            (_,{ rows }) => {
              setNurAudEntry(rows._array)
            })
          }) 
       }
      })
   
  }


    
  
 

  const onSelectedItemsChange = (selectedItems) => {
    setSelectedItems(selectedItems);
  };

  // const renderCustomItem = ({ item, selectedItems, onPress }) => {
  //   const itemFontColor = selectedItems ? 'red' : 'blue'; // Change the colors as per your requirement
  
  //   return (
  //     <TouchableOpacity onPress={onPress}>
  //       <Text style={{ color: itemFontColor }}>{item.label}</Text>
  //     </TouchableOpacity>
  //   );
  // };
  // const selectedItemTextColor = '#FF0000';

  const [mapRegion,setMapRegion]=useState({
    latitude: 31.776685,
    longitude: 35.234491,
    latitudeDelta: 0.04,
    longitudeDelta: 0.05,
  });

  const [mapCoordinates,setMapCoordinates]=useState({
    latitude:'',
    longitude:''
  })

  const userLocation=async ()=>
  {
    let {status}=await Location.requestForegroundPermissionsAsync();
    if(status!=='granted')
    {
      setError('Permission to access location was denied');
    }
    else
    {
      let location=await Location.getCurrentPositionAsync();
      setMapRegion({
        latitude:location.coords.latitude,
        longitude:location.coords.longitude,
        latitudeDelta:0.0922,
        longitudeDelta:0.04221
    })
    setMapCoordinates({
      latitude:location.coords.latitude,
      longitude:location.coords.longitude
    })
    }
  }

  const getNewRegion=async (event)=>
  {
    const coordinate = event.nativeEvent.coordinate;
    setMapRegion(coordinate);
    setMapCoordinates(coordinate)
    console.log(coordinate);
  }


  if(visible)
  {
    return(
      <Modal visible={visible}>
      <MapView style={{ width: '100%',height: '90%'}} 
       region={mapRegion}
       onPress={getNewRegion}
       showsUserLocation={true}
      >
  
       <Marker coordinate={mapRegion}
       draggable
       onDragEnd={async (e)=>
      {
        const coordinate = e.nativeEvent.coordinate;
        setMapRegion(coordinate);
        console.log(coordinate);
        setMapCoordinates(coordinate)
      }}
       >
           
       <Callout>
        <Text>Location</Text>
       </Callout>
   
       </Marker>
      </MapView>

   <View style={{justifyContent:'center',alignItems:'center'}}>
      <TouchableOpacity
        onPress={userLocation}
        style={{flexDirection:'row'}}
      >
        <Text style={[styles.buttonText,{fontSize:15,color:'blue',margin:5}]}>Current Location</Text>
        <Image source={currentLocation} style={{height:30,width:30}}/>
      </TouchableOpacity>
      
      <TouchableOpacity
        onPress={()=>setVisible(false)}
        style={[styles.button,{justifyContent:'center',padding:10,margin:20}]}
      >
        <Text style={[styles.buttonText]}>submit</Text>
      </TouchableOpacity>

    </View>
      </Modal>
    )
   
  }



  if(loading)
  {
    return(
      <View style={styles.Indicator}>
      <View style={styles.containerForLoad}>
      <Text style={styles.text}>Loading</Text>
      <View style={{width:'10%'}}>
      <Text style={styles.dots}>{dots}</Text>
      </View>
      </View>
    </View>
    )
  }
   
  const renderLabel = (label) => {
    if (isFocus) {
      return (
        <Text style={[styles.label,{color:'blue'}]}>
        {label}
        </Text>
      );
    }
    return null;
  };

  const renderLabelForPhn = (label) => {
    if (isFocusPhn) {
      return (
        <Text style={[styles.label,{color:'blue'}]}>
        {label}
        </Text>
      );
    }
    return null;
  };

  const renderLabelForAlt = (label) => {
    if (isFocusAlt) {
      return (
        <Text style={[styles.label,{color:'blue'}]}>
        {label}
        </Text>
      );
    }
    return null;
  };
  
  const onPress=()=>
  {
    // console.log(selectedNursery,filter[0].Address,selectedItems,dateOfAudit,representative,representativeName,filter[0].Latitude,filter[0].Longitude,altitude,que1,que2,que3)
    console.log(namesArray)
  }

  const mergeName=()=>
  {
    const represent=firstName+' '+middleName+' '+lastName;
    setRepresentativeName(represent);
  }

  const items = [
    {
      name: 'species',
      id: 0,
      children: speciesDetails.map(species => ({
        name: species.speciesName,
        id: species.id,
      })),
    },
  ];


  const myItems = speciesDetails.map(item => ({ key: item.id.toString(), value: item.speciesName }));


  const namesArray = selectedItems.map((id) => {
    const obj = speciesDetails.find((o) => o.id === id);
    return obj ? obj.speciesName : '';
  });
   
  const customLayoutDropdown = (optionList) => (
    <View style={styles.dropdownContainer}>{optionList}</View>
  );


  const filter=selectedNursery?nurseryDetails.filter((v)=>v.nurseryname==selectedNursery):null;

  const nurseryNames = nurAudEntry.map(item => item.nursery);
  const filteredNursery=nurseryDetails.filter(item => !nurseryNames.includes(item.nurseryname))
  


  return (
    <>
   
    <ScrollView>

    <View style={{ flex: 1, backgroundColor: "white", padding: 10 }}>

{/* <Button
title="know"
onPress={()=>
{
  console.log(filteredNursery)
}}
/> */}
      
      <DropDownSearch
        placeholderText={"Select Nursery"}
        data={filteredNursery.length>0?filteredNursery:nurseryDetails}
        label={"Name Of Nursery"}
        maxHeight={250}
        handleChange={(e)=>{
          setIsselectedNursery(e);
          setSelectedItems([]);
          setRepresentative('0');
          setFirstName('');
          setLastName('');
          setMiddleName('');
          setPhoneNumber('');
          setisFocusAlt(false);
          setisFocusPhn(false);
          setAltitude('');
          setQue1('0');
          setQue2('0');
        }}
        selectedValue={selectedNursery}
      />

      <DropDown
      label={'Nursery Location'}
      placeholderText={'Nursery Location'}
      maxHeight={220}
      myValue={(e)=>setNurLoc(e)}
      Location={filter?filter[0].Address:null}
      />

     <DropDown
      label={'District'}
      placeholderText={'Nursery Location'}
      maxHeight={220}
      myValue={(e)=>setNurLoc(e)}
      Location={filter?filter[0].district:null}
      />

        <View style={[styles.container]}>
          <MultipleSelectList
          setSelected={(v)=>setSelectedItems(v)}
          searchPlaceholder="search Raised Species"
          placeholder="Select Raised Species"
          data={myItems}
          label="Raised Species"
          save="value"
          notFoundText="Raised Species Are not Found"
          badgeStyles={{backgroundColor:'black'}}
          badgeTextStyles={{fontWeight:'bold'}}
          labelStyles={{color:'blue'}}
          checkBoxStyles={{borderWidth:1,borderColor:'black'}}
          showRemoveAll={true}
            />
         </View>

     {/* <View style={[styles.container,{justifyContent:'center'}]}>

    <SectionedMultiSelect
        items={items}
        uniqueKey="id"
        subKey="children"
        selectText= {selectedItems.length > 0 ? 'Raised Species':'Raised Species'}
        // renderSelectText={() =>
        //  <Text style={[{paddingRight:'70%'},selectedItems.length > 0 ?{color:'blue'}:{color:'black'}]}>
        //   {selectedItems.length > 0 ? 'Your Species':'Select Species'}
        // </Text>}
        selectTextStyle={styles.selectText}
        selectedItemTextStyle={styles.selectedItemText}
        showDropDowns={true}
        readOnlyHeadings={true}
        IconRenderer={Icon}
        onSelectedItemsChange={onSelectedItemsChange}
        selectedItems={selectedItems}
        containerStyle={{ borderWidth: 1, borderColor: '#000' }}
        styles={styles.multiSelect} 
        animateDropDowns={true}
        showCancelButton={true}
        alwaysShowSelectText={true}
        highlightChildren={true}
        showRemoveAll={true}
        confirmText='ok'
        selectedIconComponent={
        <View style={{ 
          backgroundColor: 'blue',
           padding: 5,
           borderRadius: 5 }} />
      }
      customLayoutDropdown={customLayoutDropdown}
        searchPlaceholderText='Search Species.......'

      />
      </View> */}
       
      <View style={styles.container}>
     {renderLabel('Date Of Audit')}
      <View style={[styles.dropdown,{justifyContent:'center'}]}>
      <TouchableOpacity
      onPress={() => setShowPicker(true)}
      >
        <View style={{flexDirection:'row'}}>
      <Text style={{marginLeft:10,fontWeight:'bold'}} editable={false}>{dateOfAudit.toLocaleDateString()}</Text>
      <Ionicons name="ios-calendar" size={25}  color="#1b35ff" style={{position:'absolute',right:0,top:-3}}/>
      </View>
      </TouchableOpacity>
      <DateTimePickerModal
      isVisible={showPicker}
      mode="date"
      maximumDate={new Date()}
      date={dateOfAudit}
      onConfirm={handleDateChange}
      onCancel={() => setShowPicker(false)}
    />
  </View>
</View>



      <View style={styles.container}>
      {renderLabel('Catagory of Representative')}
      <View style={[styles.dropdown]}>
      <Picker
         selectedValue={representative}
         onValueChange={(itemValue) => setRepresentative(itemValue)}
         
       >
         <Picker.Item label='select' value='0' style={{fontSize:20,color:'grey'}}/>
        <Picker.Item label='Nursery Manager' value='Nursery Manager' style={{fontSize:20}}/>
        <Picker.Item label='Superviser' value='Superviser' style={{fontSize:20}}/>
        <Picker.Item label='Representative' value='Representative' style={{fontSize:20}}/>
       </Picker>
       </View>
        
      </View>

      {/* <DropDownForNormal
      label={'Name of Representative'}
      placeholderText={'Name of Representative'}
      maxHeight={220}
      myValue={(e)=>setRepresentativeName(e)}
      /> */}
 
      <View style={styles.container}>
        {renderLabel('Name of Representative')}
      <View style={styles.nameOfRep}>
      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={text => setFirstName(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Middle Name"
        value={middleName}
        onChangeText={text => setMiddleName(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={lastName}
        onChangeText={text => setLastName(text)}
        onBlur={mergeName}
      />
      </View>
      </View>

      <View style={[styles.container]}>
       {renderLabelForPhn('Phone Number')}
       <View  style={[styles.dropdown,{fontSize:20,justifyContent:'center'} ]}>
          <TextInput
          value={phoneNumber}
          onChangeText={e=>setPhoneNumber(e)}
          placeholder="Phone Number"
          placeholderTextColor={isFocusPhn?'white':'black'}
          keyboardType="numeric"
          onFocus={()=>setisFocusPhn(true)}
          onBlur={()=>{
            if(phoneNumber=='')
            {
              setisFocusPhn(false)
            }
          }}
          />
       </View>

      </View>

      {/* <DropDownForNormal
      label={'Phone Number'}
      placeholderText={'Phone Number'}
      maxHeight={220}
      takeValue={phoneNumber}
      myValue={(e)=>setPhoneNumber(e)}
      keyboardType={'numeric'}
      /> */}

      <View style={[{flexDirection:'row',paddingLeft:16}]}>
      <Image source={mapLogo} style={{height:30,width:30}}/>
       <TouchableOpacity style={styles.button} onPress={()=>setVisible(true)}>
       <Text style={styles.buttonText}>View Maps</Text>
       </TouchableOpacity>
     
      </View>

      <DropDownForlatlon
      label='Latitude'
      Location={mapCoordinates.latitude==''?filter?parseFloat(filter[0].Latitude).toFixed(2):null:parseFloat(mapCoordinates.latitude).toFixed(2)}
      />
       <DropDownForlatlon
      label='Longitude'
      Location={mapCoordinates.longitude==''?filter?parseFloat(filter[0].Longitude).toFixed(2):null:parseFloat(mapCoordinates.longitude).toFixed(2)}
      />


     {/* <DropDown
      label={'Latitude'}
      placeholderText={'Latitude'}
      maxHeight={220}
      Location={filter?parseFloat(filter[0].Latitude).toFixed(2):null}
      />

      <DropDown
      label={'Longitude '}
      placeholderText={'Longitude'}
      maxHeight={220}
      Location={filter?parseFloat(filter[0].Longitude).toFixed(2):null}
      /> */}
     

     <View style={[styles.container]}>
       {renderLabelForAlt('Altitude(Meters)')}
       <View  style={[styles.dropdown,{justifyContent:'center'} ]}>
          <TextInput
          value={altitude}
          onChangeText={(e)=>setAltitude(e)}
          placeholder="Altitude(Meters)"
          placeholderTextColor={isFocusAlt?'white':'black'}
          keyboardType="numeric"
          onFocus={()=>setisFocusAlt(true)}
          onBlur={()=>{
            if(altitude=='')
            {
              setisFocusAlt(false)
            }
          }}
          />
       </View>

      </View>


     {/* <DropDownForNormal
      label={'Altitude(Meters)'}
      placeholderText={'Altitude(Meters)'}
      maxHeight={220}
      takeValue={altitude}
      myValue={(e)=>setAltitude(e)}
      keyboardType={'numeric'}
      /> */}

      <View style={styles.container}>
      {renderLabel('Is the Seed from Nationally recommended sources?')}

      <View style={[styles.dropdown]}>
      <Picker
         selectedValue={que1}
         onValueChange={(itemValue) => {
          setQue1(itemValue);
          if (itemValue === 'Yes' && que2 === 'Yes') {
            setQue3('Yes')
  
          } else if (itemValue === 'No' && que2 === 'No') {
            setQue3('No')
            } 
            else if (itemValue === 'Yes' && que2 === 'No') {
            setQue3('No')
            }
             else if (itemValue === 'No' && que2 === 'Yes') {
            setQue3('No')
            } 
            else {
            setQue3('0')
           }
        }}
       >
         <Picker.Item label='select' value='0' style={{fontSize:20,color:'grey'}}/>
        <Picker.Item label='Yes' value='Yes' style={{fontSize:20}}/>
        <Picker.Item label='No' value='No' style={{fontSize:20}}/>
       </Picker>
       </View>
      </View>
      <View style={styles.container}>
      {renderLabel('Has the holding capacity of 100,000 seedlings per season been achieved ?')}
      <View style={[styles.dropdown]}>
      <Picker
         selectedValue={que2}
         onValueChange={(itemValue) => {
          setQue2(itemValue);
          if (que1 === 'Yes' && itemValue === 'Yes') {
            setQue3('Yes')
          
          } else if (que1 === 'No' && itemValue === 'No') {
            setQue3('No')
          
          } else if (que1 === 'Yes' && itemValue === 'No') {
            setQue3('No')
           
          } else if (que1 === 'No' && itemValue === 'Yes') {
            setQue3('No')
          } else {
            setQue3('0');
          }
        }}
         
       >
         <Picker.Item label='select' value='0' style={{fontSize:20,color:'grey'}}/>
        <Picker.Item label='Yes' value='Yes' style={{fontSize:20}}/>
        <Picker.Item label='No' value='No' style={{fontSize:20}}/>
       </Picker>
       </View>
      </View>
  

      <View style={[styles.container]}>
        <View style={[styles.dropdown,{flexDirection:'row',alignItems:'center'}]}>
        <Text style={{paddingRight:20,fontSize:15}}>Both pre-requisities have been met</Text>
      {que1=='Yes'&& que2=='Yes' ? <Text style={{fontSize:15}}>:{que3}</Text>:<Text style={{fontSize:15}}>:No</Text>}
      </View>
      </View>

      <View style={styles.container}>
      {/* {renderLabel('both pre-requisities have been met')}
      <View style={[styles.dropdown]}>
      <Picker
        
         selectedValue={que3}
         onValueChange={(itemValue) =>{setQue3(itemValue)}}
       >
         <Picker.Item label='select' value='0' style={{fontSize:20,color:'grey'}}/>
        <Picker.Item label='Yes' value='Yes' style={{fontSize:20}}/>
        <Picker.Item label='No' value='No' style={{fontSize:20}}/>
       </Picker>
       </View> */}
       {
        que1=='Yes' && que2=='Yes' ?
        selectedNursery!=null?
       <AccordianList navigation={navigation} data={nurseryAuditDetails} 
       nursery={selectedNursery}
       location={filter[0].Address}
       species={selectedItems}
       dateOfAudit={dateOfAudit.toLocaleDateString()}
       representative={representative}
       representativeName={representativeName}
       latitude={mapCoordinates.latitude==''?filter[0].Latitude:mapCoordinates.latitude}
       longitude={mapCoordinates.longitude==''?filter[0].Longitude:mapCoordinates.longitude}
       altitude={altitude}
       />
    :
    <Text style={{color:'red'}}>Sorry Please select Nursery</Text>
       :null
      }
      </View>


      <View style={[styles.container]}>
      <TouchableOpacity
      style={[styles.dropdown,{justifyContent:'center',borderWidth:0}]}
      onPress={()=>{
        if(selectedNursery!=undefined)
        {
          navigation.navigate('NurseryObservations',{selectedNursery:selectedNursery,nurDate:dateOfAudit.toISOString().substr(0, 10)});
        }
        else
        {
          Alert.alert('Warning','Please Select Nursery To Go Nursery Observation')
        }
        
      }}
      >
        <View style={{flexDirection:'row'}}>
        <MaterialCommunityIcons name="briefcase-search" size={20} color="#000" />
      <Text style={styles.NurObsText}>Nursery Observation</Text>
    
      </View>
      </TouchableOpacity>
      </View>


      <View style={[styles.container]}>
      <TouchableOpacity
      style={[styles.dropdown,{justifyContent:'center',borderWidth:0}]}
      onPress={()=>{
        if(selectedNursery!=undefined)
        {
          navigation.navigate('CorrectiveAction',{selectedNursery:selectedNursery});
        }
        else
        {
          Alert.alert('Warning','Please Select Nursery To Go CorrectiveAction')
        }
      }}
      >
        <View style={{flexDirection:'row'}}>
        <MaterialIcons name="local-attraction" size={20} color="#000" />
      <Text style={styles.NurObsText}>CorrectiveAction</Text>
     
      </View>
      </TouchableOpacity>
      </View>
      

      {/* <View style={[styles.container]}>
      <TouchableOpacity
      style={[styles.dropdown,{justifyContent:'center',borderWidth:0}]}
      onPress={()=>{
        downiconObj?setDownIconObj(false):setDownIconObj(true);
        upiconObj?setUpIconObj(false):setUpIconObj(true);
        nurObs?setNurObs(false):setNurObs(true);
      }}
      >
        <View style={{flexDirection:'row'}}>
        <MaterialCommunityIcons name="briefcase-search" size={20} color="#000" />
      <Text style={styles.NurObsText}>Nursery Observation</Text>
      {
        downiconObj &&
        <AntDesign name="downcircleo" size={20} color="#000" style={styles.downIcon}  />
      }
      {
        upiconObj &&
        <AntDesign name="upcircleo" size={20} color="#000" style={styles.downIcon} />
      }
    
      </View>
      </TouchableOpacity>
      </View>


      {
       nurObs?
       <NurseryObservations selectedNursery={selectedNursery} nurDate={dateOfAudit}/>
       :null
      } */}
      


      {/* <View style={[styles.container]}>
      <TouchableOpacity
      style={[styles.dropdown,{justifyContent:'center',borderWidth:0}]}
      onPress={()=>{
        downiconCorr?setDownIconCorr(false):setDownIconCorr(true);
        upiconCorr?setUpIconCorr(false):setUpIconCorr(true);
        corrac?setCorrAc(false):setCorrAc(true);
      }}
      >
        <View style={{flexDirection:'row'}}>
        <MaterialIcons name="local-attraction" size={20} color="#000" />
      <Text style={styles.NurObsText}>CorrectiveAction</Text>
      {
        downiconCorr &&
        <AntDesign name="downcircleo" size={20} color="#000" style={styles.downIcon}  />
      }
      {
        upiconCorr &&
        <AntDesign name="upcircleo" size={20} color="#000" style={styles.downIcon} />
      }
    
      </View>
      </TouchableOpacity>
      </View>
      {
        corrac &&
        <CorrectiveAction selectedNursery={selectedNursery}/>
      } */}
     
            </View>
  
            </ScrollView>
            </>
  );
};

export default NurseryAuditChecklist;
