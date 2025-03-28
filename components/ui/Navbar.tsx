import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { House, Storefront, Joystick, Exam, UserCircle } from "phosphor-react-native";
import { View } from 'react-native';
import tw from 'twrnc';

const DummyScreen = () => <View style={tw`flex-1 bg-white`} />;


const homeName = 'Home';
const minigameName = 'Minigames';
const profileName = 'Profile';
const quizName = 'Quiz';
const storeName = 'Store';

const Tab = createBottomTabNavigator();

export default function Navbar() {
    return (
        <Tab.Navigator
            initialRouteName={homeName}
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused }) => {
                    let IconComponent;

                    switch (route.name) {
                        case homeName:
                            IconComponent = House;
                            break;
                        case minigameName:
                            IconComponent = Joystick;
                            break;
                        case profileName:
                            IconComponent = UserCircle;
                            break;
                        case quizName:
                            IconComponent = Exam;
                            break;
                        case storeName:
                            IconComponent = Storefront;
                            break;
                        default:
                            IconComponent = House;
                    }

                    return (
                        <View style={tw`${focused ? 'bg-purple-200 rounded-full w-15 h-8 flex items-center justify-center' : ''}`}>
                            <IconComponent color="black" size={32} weight="regular" />
                        </View>
                    );
                },
                tabBarShowLabel: false,
                tabBarInactiveTintColor: 'gray',
                tabBarStyle: tw`bg-gray-100 h-15 py-2`,
                tabBarItemStyle: tw`flex justify-center`,
            })}
        >
            <Tab.Screen name={homeName} component={DummyScreen} />
            <Tab.Screen name={storeName} component={DummyScreen} />
            <Tab.Screen name={minigameName} component={DummyScreen} />
            <Tab.Screen name={quizName} component={DummyScreen} />
            <Tab.Screen name={profileName} component={DummyScreen} />
        </Tab.Navigator>
    );
}
