import NailTrimGame from "@/components/minigames/nail-trim-game";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();
export default function Router(){
    return (
        <NavigationContainer>
          <Stack.Navigator
          initialRouteName="minigame"
          >
            <Stack.Screen
              name="minigame"
              component={NailTrimGame}
              options={{title: 'Welcome'}}
            />

          </Stack.Navigator>
        </NavigationContainer>
      );
}