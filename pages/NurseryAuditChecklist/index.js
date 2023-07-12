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

import MapView,{Marker,Callout} from 'react-native-maps';
import { MultipleSelectList } from "react-native-dropdown-select-list";
import { useIsFocused } from '@react-navigation/native';
import * as Location from 'expo-location';
import DropDownForlatlon from "../../components/DropdownForlatlon";




const db = SQLite.openDatabase('mydb.Nursery');

const NurseryAuditChecklist = (props) => {

  const apiKey = "AIzaSyC17cBFPSoqIroA3GqRMBgXAAJVYTU14TE";

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

  const [pickerDisabled,setPickerDisabled]=useState(false)


  const [nurObs,setNurObs]=useState(false);
  const [corrac,setCorrAc]=useState(false);

  const [downiconObj,setDownIconObj]=useState(true);
  const [downiconCorr,setDownIconCorr]=useState(true);


  const [upiconObj,setUpIconObj]=useState(false);
  const [upiconCorr,setUpIconCorr]=useState(false);

  const [phoneNumber,setPhoneNumber]=useState('');
 

  const [isFocus,setIsFocus]=useState(true);


  const [nurAudEntry,setNurAudEntry]=useState([]);

  const [nurAudEntryForShowObsCorr,setNurAudEntryForShowObsCorr]=useState([])

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

  const [isValidForPhn, setIsValidForPhn] = useState(true);

  const [nurAudAns,setNurAudAns]=useState([]);

  const [success,setSuccess]=useState('');

  const [disabledData,setDisabledData]=useState([]);


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

  const [latIfNotExist,setLatIfNotExist]=useState('');
  const [LonIfNotExist,setLonIfNotExist]=useState('');

  const [statusForObser,setStatusForObser]=useState([]);
  const [statusForCorr,setStatusForCorr]=useState([]);

  const [errorIfExistBasicDetails,setErrorIfExistBasicDetails]=useState('');

  useEffect(()=>
  {
    getNurseryDetails();
    getNurseryAuditDetails();
    getSpeciesDetails();
    createTableOfAudit();
    getNursery();
    getNurseryAuditEntry();
    getLocationAsync();
    checkForObservation();
      setTimeout(()=>
      {
        checkForObservation();
        getNurseryDetails();
        getNurseryAuditDetails();
        getSpeciesDetails();
        createTableOfAudit();
        getNursery();
        getLocationAsync();
        getNurseryAuditEntry();
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
     
  },[isFocused])


  useFocusEffect(
    React.useCallback(() => {
      getLocationAsync();
        getNurseryAuditEntry();
        getNurseryAuditDetails();
        checkForObservation();
      setTimeout(()=>
      {
        checkForObservation();
          getNurseryAuditEntry();
          getNurseryAuditDetails();
          console.log(selectedNursery)
          console.log(nurAudEntryForShowObsCorr.length)
      },300)
      return () => {
        console.log('Screen is unfocused');
      };
    }, [])
  );


  const checkForObservation=(e)=>
  {
    if(e)
    {

      db.transaction(tx=>
        {
          tx.executeSql(
            'SELECT * FROM NurseryObservation where Nusery=?',
            [e],
            (_, { rows }) => {
                setStatusForObser(rows._array);
            })
            tx.executeSql(
              'SELECT * FROM CorrectiveAction where Nursery=?',
              [e],
              (_, { rows }) => {
                
                  setStatusForCorr(rows._array);
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
           
              setStatusForObser(rows._array);
          })
          tx.executeSql(
            'SELECT * FROM CorrectiveAction where Nursery=?',
            [selectedNursery],
            (_, { rows }) => {
                setStatusForCorr(rows._array);
            })
      })
    }
  }



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
  const { latitude, longitude } = location.coords;
  setLatIfNotExist(latitude.toString());
  setLonIfNotExist(longitude.toString())
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
        tx.executeSql('create table if not exists NurseryAuditEntryDetails(id INTEGER PRIMARY KEY AUTOINCREMENT,nursery varchar,location varchar,SeedfromNationallyRecommendedSources varchar,HoldingCapacity varchar,BothRequisitesHaveBeenMet varchar,District varchar,species TEXT,date date,typeOfRepresentative TEXT,nameOfRepresentative Text,phonenumber varchar,Latitude varchar,Longitude varchar,Altitude varchar)')
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
      tx.executeSql(
        'SELECT * FROM NurseriesAfterClearingData',
        [],
        (_, { rows }) => {
            setDisabledData(rows._array);
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

  const getNurseryAuditEntry=(e)=>
  {
    if(e)
    {
      db.transaction(tx=>
        { 
          tx.executeSql('SELECT * FROM NurseryAuditEntryDetails where nursery=?',
          [e],
          (_,{ rows }) => {
            setNurAudEntryForShowObsCorr(rows._array);
        })
        tx.executeSql('SELECT * FROM NurseryAuditAnswers where nursery=?',
        [e],
        (_,{ rows }) => {
          setNurAudAns(rows._array);
      })
    })    
    }
    else
    {
      db.transaction(tx=>
        { 
          tx.executeSql('SELECT * FROM NurseryAuditEntryDetails where nursery=?',
          [selectedNursery],
          (_,{ rows }) => {
            setNurAudEntryForShowObsCorr(rows._array);
        })
        tx.executeSql('SELECT * FROM NurseryAuditAnswers where nursery=?',
        [selectedNursery],
        (_,{ rows }) => {
          setNurAudAns(rows._array);
      })
    })    
    }
    
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


  const SaveBasicDetails=()=>
  {
    Alert.alert(
      'Data Saved',
      'Do you want to Save Data Without Audit?',
      [
        { text: 'Yes', style: 'cancel', onPress: () => 
      {
        handleYes();
        setPickerDisabled(true);
      } },
        { text: 'No', onPress: () =>console.log('NoPressed') }
      ]
    );
  
  }

  const handleYes=()=>
  {
    const arrayString = JSON.stringify(namesArray);
    db.transaction(tx=>
      {
        tx.executeSql('SELECT nursery from NurseryAuditEntryDetails',[],
        (_, { rows }) => {
          // Get all values from the column and check if drillPip is exists
          const nurseryValues = rows._array.map((row) => row.nursery);
          if (nurseryValues.includes(selectedNursery)) {
            setErrorIfExistBasicDetails('Data Already Saved on this Nursery');
            setSuccess('');
          }
          else
          {
            tx.executeSql('INSERT INTO NurseryAuditEntryDetails(nursery,location,District,species,date,typeOfRepresentative,nameOfRepresentative,phonenumber,Latitude,Longitude,Altitude,SeedfromNationallyRecommendedSources,HoldingCapacity,BothRequisitesHaveBeenMet) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
            [selectedNursery,filter[0].Address,filter[0].district,arrayString,dateOfAudit.toLocaleDateString(),representative,representativeName,phoneNumber,latIfNotExist,LonIfNotExist,altitude,que1,que2,que3],
            (tx,result)=>
            {
              setErrorIfExistBasicDetails('');
              console.log('Data inserted into table successful')
              setSuccess('Data Saved Successfully....')
            },
            (error)=>console.log(error)
            )
          }

        })

      })
  }
   

    
  
 

  const onSelectedItemsChange = (selectedItems) => {
    setSelectedItems(selectedItems);
  };

  const renderCustomItem = ({ item, selectedItems, onPress }) => {
    const itemFontColor = selectedItems ? 'red' : 'blue'; // Change the colors as per your requirement
  
    return (
      <TouchableOpacity onPress={onPress}>
        <Text style={{ color: itemFontColor }}>{item.label}</Text>
      </TouchableOpacity>
    );
  };
  const selectedItemTextColor = '#FF0000';

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
       provider={Platform.OS === 'android' ? MapView.PROVIDER_GOOGLE : null}
      showsMyLocationButton={true}
      apiKey={apiKey}
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
    if(label=='Name of Representative'||label=='Catagory of Representative')
    {
      if (isFocus) {
        return (
          <Text style={[styles.label,{color:'blue'}]}>
          {label} <Text style={{color:'red'}}>*</Text>
          </Text>
        );
      }

    }
    else
    {
      if (isFocus) {
        return (
          <Text style={[styles.label,{color:'blue'}]}>
          {label}
          </Text>
        );
      }
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
    console.log(filter)
  }

  const mergeName=()=>
  {
      let fullName = '';
  
      if (firstName) {
        fullName += firstName;
      }
  
      if (middleName) {
        fullName += ' ' + middleName;
      }
  
      if (lastName) {
        fullName += ' ' + lastName;
      }
  
      setRepresentativeName(fullName)
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
  const filteredNursery=nurseryDetails.filter(item => !nurseryNames.includes(item.nurseryname));

  // const disabledNurseryNames = disabledData.map((item) => item.nursery);
  // const data = disabledNurseryNames.map((item) => ({
  //   ...item,
  //   disabled: filteredNursery.includes(item.nurseryname),
  // }));


  

  const validatePhoneNumber = (number) => {
    const regex = /^(\+256\s)?\d{9}$/; // Regex for 10 digits
    return regex.test(number);
  };

  return (
    <>
    <ScrollView>

    <View style={{ flex: 1, backgroundColor: "white", padding: 10 }}>

      
      <DropDownSearch
        placeholderText={"Select Nursery"}
        data={filteredNursery.length>0?filteredNursery:nurseryDetails}
        myData={disabledData}
        label={"Name Of Nursery"}
        maxHeight={250}
        handleChange={(e)=>{
          setIsselectedNursery(e);
          setSelectedItems([]);
          setRepresentative('0');
          setFirstName('');
          setLastName('');
          setMiddleName('');
          setRepresentativeName('');
          setPhoneNumber('');
          setisFocusAlt(false);
          setisFocusPhn(false);
          setAltitude('');
          setQue1('0');
          setQue2('0');
          getNurseryAuditEntry(e);
          setNurLoc('');
          getLocationAsync();
          setErrorIfExistBasicDetails('');
          setSuccess('');
          setPickerDisabled(false);
          checkForObservation(e);
        }}
        selectedValue={selectedNursery}
      />


       <DropDownForlatlon
      label={'Nursery Location'}
      placeholderText={'Nursery Location'}
      Location={filter?filter[0].Address:''}
      myValue={nurLoca}
      valueGet={(e)=>setNurLoc(e)}
      />

     <DropDown
      label={'District'}
      placeholderText={'District'}
      maxHeight={220}
      myValue={(e)=>setNurLoc(e)}
      Location={filter?filter[0].district:null}
      />

     <View style={[styles.container,{justifyContent:'center'}]}>

    <SectionedMultiSelect
        items={items}
        uniqueKey="id"
        subKey="children"
        selectText={selectedItems.length > 0 ? 'Raised Species *' : 'Raised Species *'}
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
      </View>
       
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
         <Picker.Item label='select' value='0' style={{fontSize:15,color:'grey'}}/>
        <Picker.Item label='Nursery Manager' value='Nursery Manager' style={{fontSize:15}}/>
        <Picker.Item label='Superviser' value='Superviser' style={{fontSize:15}}/>
        <Picker.Item label='Representative' value='Representative' style={{fontSize:15}}/>
       </Picker>
       </View>
        
      </View>

 
      <View style={styles.container}>
        {renderLabel('Name of Representative')}
      <View style={styles.nameOfRep}>
      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={text => setFirstName(text)}
        onBlur={mergeName}
      />
      <TextInput
        style={styles.input}
        placeholder="Middle Name"
        value={middleName}
        onChangeText={text => setMiddleName(text)}
        onBlur={mergeName}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={lastName}
        onChangeText={text =>
          { setLastName(text)
          }}
          onBlur={mergeName}
      />
      </View>
      </View>

      <View style={[styles.container]}>
       {renderLabel('Phone Number')}
       <View  style={[styles.dropdown,{fontSize:20,justifyContent:'center'} ]}>
          <TextInput
          value={phoneNumber}
          onChangeText={number=>
            {
              const formattedNumber = number.startsWith('+256') ? number : '+256' + number;
            setPhoneNumber(formattedNumber);
              setIsValidForPhn(validatePhoneNumber(formattedNumber));
            }
          }
          placeholder="+256XXXXXXXXX"
          keyboardType="numeric"
          onBlur={()=>{
            if(phoneNumber=='')
            {
              setisFocusPhn(false);
              setIsValidForPhn(true);
            }
            if(phoneNumber=='+256 '||phoneNumber=='+256')
            {
              setPhoneNumber('');
              setIsValidForPhn(true);
              console.log(representative)
            }
      
          }}
          maxLength={14}
          onFocus={() => setPhoneNumber('+256 ')}
          />
       </View>

      </View>

      {!isValidForPhn && (
        <View style={{paddingLeft:16,paddingTop:5}}>
        <Text style={{ color: 'red',fontSize:11 }}>Phone number itself is 9 numbers other than 256</Text>
        </View>
      )}

        <View style={styles.container}>
     {renderLabel('Latitude')}
      <View style={[styles.dropdown,{justifyContent:'center'}]}>
      <TextInput
        value={latIfNotExist}
        placeholder="Longitude"
        onChangeText={(text) => setLatIfNotExist(text)}
        keyboardType="numeric"
      />
      </View>
      </View>

      <View style={styles.container}>
     {renderLabel('Longitude')}
      <View style={[styles.dropdown,{justifyContent:'center'}]}>
      <TextInput
        value={LonIfNotExist}
        placeholder="Longitude"
        onChangeText={(text) => setLonIfNotExist(text)}
        keyboardType="numeric"
      />
      </View>
      </View>

          

     <View style={[styles.container]}>
       {renderLabelForAlt('Altitude(Meters)')}
       <View  style={[styles.dropdown,{justifyContent:'center'} ]}>
          <TextInput
          value={altitude}
          onChangeText={(e)=>setAltitude(e)}
          placeholder="Altitude(Meters)"
          placeholderTextColor={isFocusAlt?'transparent':'black'}
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



      <View style={styles.container}>
      {renderLabel('Is the Seed from Nationally recommended sources?')}

      <View style={[styles.dropdown]}>
      <Picker
      enabled={!pickerDisabled}
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
         <Picker.Item label='select' value='0' style={{fontSize:15,color:'grey'}}/>
        <Picker.Item label='Yes' value='Yes' style={{fontSize:15}}/>
        <Picker.Item label='No' value='No' style={{fontSize:15}}/>
       </Picker>
       </View>
      </View>
      <View style={styles.container}>
      {renderLabel('Has the holding capacity of 100,000 seedlings per season been achieved ?')}
      <View style={[styles.dropdown]}>
      <Picker
      enabled={!pickerDisabled}
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
         <Picker.Item label='select' value='0' style={{fontSize:15,color:'grey'}}/>
        <Picker.Item label='Yes' value='Yes' style={{fontSize:15}}/>
        <Picker.Item label='No' value='No' style={{fontSize:15}}/>
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
      
       {
        que1=='Yes' && que2=='Yes' ?
        selectedNursery!=null && namesArray.length>0 && representative!=='0' && representativeName.trim() !== ''? 
       <AccordianList navigation={navigation} data={nurseryAuditDetails} 
       nursery={selectedNursery}
       location={filter[0].Address==''?nurLoca:filter[0].Address}
       District={filter[0].district}
       species={namesArray}
       dateOfAudit={dateOfAudit.toLocaleDateString()}
       representative={representative}
       representativeName={representativeName}
       phonenumber={phoneNumber}
      latitude={latIfNotExist}
      longitude={LonIfNotExist}
      altitude={altitude}
       nurAudAns={nurAudAns}
       nurAudEntryForShowObsCorr={nurAudEntryForShowObsCorr}
       que1={que1}
       que2={que2}
       que3={que3}
       />
       
    :

    selectedNursery==null?
    <Text style={{color:'red'}}>Sorry Please select Nursery</Text>
    :
    namesArray.length<=0?
    <Text style={{color:'red'}}>Sorry Please Select Raised Species</Text>
    :
    representative=='0'?
    <Text style={{color:'red'}}>Sorry Please Select Catagory Of Representative</Text>
    :
    representativeName.trim() === ''?
    <Text style={{color:'red'}}>Sorry Please Enter Name of Representative</Text>
    :
    null
       :
       null
      }
      </View>

{
    que1=='Yes' && que2=='Yes' && selectedNursery!=null && nurAudAns.length>0?
    <View>
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
      <View style={{flexDirection:'row',alignItems:'center'}}>
      <MaterialCommunityIcons name="briefcase-search" size={18} color="#000" />
    <Text style={styles.NurObsText}>Nursery Observation</Text>
    {statusForObser.length>0 ? <AntDesign name="checkcircle" size={15} color="green" />:null}
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
      <View style={{flexDirection:'row',alignItems:'center'}}>
      <MaterialIcons name="local-attraction" size={18} color="#000"/>
    <Text style={styles.NurObsText}>CorrectiveAction</Text>
    {statusForCorr.length>0? <AntDesign name="checkcircle" size={15} color="green" />:null}
    </View>
    </TouchableOpacity>
    </View>
    </View>
    :
    null

}


     

{/* {errorIfExistBasicDetails?<Text style={{color:'red',paddingLeft:16,paddingBottom:5}}>{errorIfExistBasicDetails}</Text>:null}
{success?<Text style={{color:'green',paddingLeft:16,paddingBottom:5}}>{success}</Text>:null}

{que3=='No'||que3=='0'&& selectedNursery!=null && namesArray.length>0 && representative!=='0' && representativeName.trim() !== ''? 

<View style={{justifyContent:'center',alignItems:'center'}}>
 <TouchableOpacity style={{
  backgroundColor: '#4285F4',
  borderRadius: 5,
  padding: 10,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent:'center',
  width:'90%'
 }}
 onPress={SaveBasicDetails}
 >
 <Icon name="save" size={24} color="#FFF" />
 <Text style={{
   color: '#FFF',
   marginLeft: 5,
   fontSize: 16,
 }}>Save</Text>
</TouchableOpacity>
</View>
:
null
} */}






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
