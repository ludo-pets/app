import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { House, Storefront, Joystick, Exam, UserCircle } from "@phosphor-icons/react";
import { View, StyleSheet } from 'react-native';

import HomeScreen from '@/app/(tabs)/Home';
import MiniGamesScreen from '@/app/(tabs)/MiniGames';
import ProfileScreen from '@/app/(tabs)/Profile';
import QuizScreen from '@/app/(tabs)/Quizzes';
import StoreScreen from '@/app/(tabs)/Store';

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
                tabBarIcon: ({ focused, color, size }) => {
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

                    const iconSize = 32;
                    const iconColor = 'black';

                    return (
                        <View style={focused ? styles.activeIconContainer : styles.inactiveIconContainer}>
                            <IconComponent color={iconColor} size={iconSize} weight="regular" /> {}
                        </View>
                    );
                },
                tabBarShowLabel: false,
                tabBarInactiveTintColor: 'gray',
                tabBarStyle: {
                    backgroundColor: '#f8f8f8',
                    height: 70,
                    paddingBottom: 10,
                    paddingTop: 10,
                },
                tabBarItemStyle: {
                    justifyContent: 'center',
                    padding: 0,
                    margin: 0,
                },
            })}
        >
            <Tab.Screen name={homeName} component={HomeScreen} />
            <Tab.Screen name={storeName} component={StoreScreen} />
            <Tab.Screen name={minigameName} component={MiniGamesScreen} />
            <Tab.Screen name={quizName} component={QuizScreen} />
            <Tab.Screen name={profileName} component={ProfileScreen} />
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    activeIconContainer: {
        backgroundColor: '#E8DEF8',
        borderRadius: 50,
        width: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inactiveIconContainer: {
    },
});
