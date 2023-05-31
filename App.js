import "react-native-gesture-handler";
import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { DrawerNavigator } from "./routes/index";
import GWDetailsPage from "./pages/GroundWaterComplaince/NurseryAuditDetailsPage/index"
import UserInput from "./components/Userlogin";
import PinAccess from "./pages/PinAccess";
import PinGeneration from "./pages/PinGeneration";
import { CorrectiveAction, NurseryObservations } from "./pages";

import {
  SelfMonitoring,
  StandardsComplaince,
} from "./pages/GroundWaterComplaince/GWComplainceList";

// Prevent native splash screen from autohiding before App component declaration
SplashScreen.preventAutoHideAsync()
  .then((result) =>
    console.log(`SplashScreen.preventAutoHideAsync() succeeded: ${result}`)
  )
  .catch(console.warn); // it's good to explicitly catch and inspect any error

const Stack = createStackNavigator();

const DrawerStack = () => (
  <Stack.Navigator>
    <Stack.Screen
        name="UserLogin"
        component={UserInput}
        options={{ headerShown: false }}
        />
         <Stack.Screen name="UserInput" component={UserInput} />

         <Stack.Screen
        name="PinGeneration"
        component={PinGeneration}
        options={{ headerShown: false }}
        />
  

         <Stack.Screen
        name="PinAccess"
        component={PinAccess}
        options={{ headerShown: false }}
        />
    
    <Stack.Screen
     name="NurseryObservations"
     options={{headerShadown:false}}
     component={NurseryObservations}
    />
    <Stack.Screen
     name="CorrectiveAction"
     options={{headerShadown:false}}
     component={CorrectiveAction}
    />
    <Stack.Screen
      name="DrawerNavigator"
      component={DrawerNavigator}
      options={{ headerShown: false }}
    />
    <Stack.Screen name="Nursery Audit" component={GWDetailsPage} />
  </Stack.Navigator>
);

export default function App() {
  useEffect(() => {
    // Hides native splash screen after 2s
    setTimeout(async () => {
      await SplashScreen.hideAsync();
    }, 2000);
  }, []);
  return (
    <NavigationContainer>
      <DrawerStack />
    </NavigationContainer>
  );
}
