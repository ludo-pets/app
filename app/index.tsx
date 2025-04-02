import { Route } from "expo-router";
import Minigame from "./minigame";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import NailTrimGame from "@/components/minigames/nail-trim-game";

const Stack = createNativeStackNavigator();
export default function App(){
     return (

             <Stack.Navigator
             initialRouteName="minigame"
             >
               <Stack.Screen
                 name="minigame"
                 component={NailTrimGame}
                 options={{title: 'Welcome'}}
               />
   
             </Stack.Navigator>
         );
}