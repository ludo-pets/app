import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { House, Storefront, Joystick, Exam, UserCircle } from "phosphor-react-native";
import { View, StyleSheet } from 'react-native';

const DummyScreen = () => <View style={styles.dummyScreen} />;

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
                headerShown: false,
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
                        <View style={focused ? styles.focusedIconContainer : {}}>
                            <IconComponent color="black" size={32} weight="regular" />
                        </View>
                    );
                },
                tabBarShowLabel: false,
                tabBarInactiveTintColor: 'gray',
                tabBarStyle: styles.tabBar,
                tabBarItemStyle: styles.tabBarItem,
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

const styles = StyleSheet.create({
    dummyScreen: {
        flex: 1,
        backgroundColor: 'white'
    },
    focusedIconContainer: {
        backgroundColor: '#e9d5ff',
        borderRadius: 50,
        width: 60,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center'
    },
    tabBar: {
        backgroundColor: '#f3f4f6',
        height: 50,
        paddingVertical: 8,
    },
    tabBarItem: {
        justifyContent: 'center',
        marginTop: 5
    }
});