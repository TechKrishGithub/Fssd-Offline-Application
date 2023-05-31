import React from "react";
import { 
  View,
  Text,
  Image
} from "react-native";
import {
  DrawerItemList,
  createDrawerNavigator,
} from "@react-navigation/drawer";
import {
  SimpleLineIcons,
  MaterialIcons,
  MaterialCommunityIcons,
  AntDesign,
  Ionicons,
  Entypo
} from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Logo from "../assets/logo.jpg";
import top from "../assets/top.png"
import myLogo from "../assets/logo-removebg-preview.png"
import WiseLogo from "../assets/wise_logo.png";
import {
  NurseryAuditChecklist,
  NurseryObservations,
  CorrectiveAction,
  Logout,
  Dashboard,
  PinGeneration
} from "../pages/index";


const Drawer = createDrawerNavigator();
const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => {
        return (
          <SafeAreaView>
            <View
              style={{
                height: 210,
                width: "100%",                
                justifyContent: "center",
                alignItems: "center",
                borderBottomColor: "#f4f4f4",
                borderBottomWidth: 1,
              }}
            >
              <View style={{
                 justifyContent:'center',
                 alignItems:'center',
                 backgroundColor:'white',
                 borderWidth:2.5,
                 borderColor:'lightgray',
                 borderRadius:90,
                 height:140,
                 width:140,
                 marginLeft:-15
              }}>
              <Image
                source={myLogo}
                style={{
                  height: 120,
                  width: 120
                }}
              />
              </View>
              <Text
                 style={{
                  fontSize:12,
                  marginVertical: 6,
                  fontWeight: "bold",
                  color: "#156235"
                }}

              >
              REPUBLIC OF UGANDA
              </Text>
           
              <Text
                style={{
                  marginVertical: 6,
                  fontWeight: "bold",
                  color: "#156235"
                }}
              >
               Forestry Support Service Database
              </Text>
            </View>

            <DrawerItemList {...props} />
            <View
              style={{
                height: 90,
                width: "100%",
                justifyContent: "center",
                borderTopColor: "#f4f4f4",
                borderTopWidth: 1,
              }}
            >
              <Image
                source={WiseLogo}
                style={{
                  height:80,
                  width: 170,
                  marginLeft:15
                }}
              />
            </View>
          </SafeAreaView>
        );
      }}
      screenOptions={{
        drawerStyle: {
          backgroundColor: "#f7ffff",
          width: 280,
        },
        headerStyle: {
          backgroundColor: "#0D47A1",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        drawerLabelStyle: {
          color: "#111",
        },
      }}
    >

        <Drawer.Screen
        name="Dashboard"
        options={{
          drawerLabel: "Dashboard",
          title: "Dashboard",
          drawerIcon: () => (
            <Ionicons name="home" size={20} color="#808080" />
          ),
          headerTitleAlign:'center',
          headerTitle:()=>
          {
            return(
              <Text style={{color:'#fff',fontWeight:'bold',fontSize:17,marginRight:20}}>Dashboard</Text>
            )
           
          },
          headerRight: () => (
            <Image
              source={WiseLogo}
              style={{ width: 100, height: 50, marginRight: 10}}
            />
          ),
        
          // headerBackground:()=>(
          //   <Image
          //   source={top}
          //   style={{ width: '100%',height:'100%'}}
          // />
          // )
        }}
        component={Dashboard}
      />
      
      <Drawer.Screen
        name="Nursery Audit Checklist"
        options={{
          drawerLabel: "Nursery Audit",
          title: "Nursery Audit",
          drawerIcon: () => (
            <AntDesign name="appstore1"size={20} color="#808080" />
          ),
          headerTitleAlign:'center',
          headerTitle:()=>
          {
            return(
              <Text style={{color:'#fff',fontWeight:'bold',fontSize:17,marginRight:20}}>Nursery Audit</Text>
            )
           
          },
          headerRight: () => (
            <Image
              source={WiseLogo}
              style={{ width: 100, height: 50, marginRight: 10}}
            />
          ),
        
        }}
        component={NurseryAuditChecklist}
        
      />

      
      {/* <Drawer.Screen
        name="NurseryObservations"
        options={{
          drawerLabel: "NurseryObservations",
          title: "Nursery Observations",
          drawerIcon: () => (
            <MaterialCommunityIcons name="briefcase-search" size={20} color="#808080" />
          ),
          headerTitleAlign:'center',
          headerTitle:()=>
          {
            return(
    <Text style={{color:'#fff',fontWeight:'bold',fontSize:17,marginRight:20}}>Nursery Observations</Text>
    )
           
          },
          headerRight: () => (
            <Image
              source={WiseLogo}
              style={{ width: 100, height: 50, marginRight: 10}}
            />
          ),
        }}
        component={NurseryObservations}
      /> */}
    
      {/* <Drawer.Screen
        name="Corrective Action"
        options={{
          drawerLabel: "Corrective Action",
          title: "Corrective Action",
          drawerIcon: () => (
            <MaterialIcons
              name="local-attraction"
              size={20}
              color="#808080"
            />
          ),
          headerTitleAlign:'center',
          headerTitle:()=>
          {
            return(
              <Text style={{color:'#fff',fontWeight:'bold',fontSize:17,marginRight:20}}>Corrective Action</Text>
            )
           
          },
          headerRight: () => (
            <Image
              source={WiseLogo}
              style={{ width: 100, height: 50, marginRight: 10}}
            />
          ),
      
        }}
        component={CorrectiveAction}
      /> */}


      {/* <Drawer.Screen
        name="Waste Water Complaince"
        options={{
          drawerLabel: "Waste Water Complaince",
          title: "Waste Water Complaince",
          drawerIcon: () => (
            <MaterialCommunityIcons
              name="certificate"
              size={20}
              color="#808080"
            />
          ),
        }}
        component={WasteWaterComplaince}
      /> */}
      <Drawer.Screen
        name="Logout"
        options={{
          headerTitle:()=>
          {
            return(
              <Text style={{color:'#fff',fontWeight:'bold',fontSize:17,marginRight:20}}>Logout</Text>
            )
           
          },
          drawerLabel: "Logout",
          title: "Logout",
          drawerIcon: () => (
            <AntDesign name="logout"  size={20} color="#808080" />
          ),
        }}
        component={Logout}
      />
      
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
