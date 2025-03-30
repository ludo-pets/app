import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import {
    House,
    Storefront,
    Joystick,
    Exam,
    UserCircle,
} from 'phosphor-react-native'
import { View, StyleSheet } from 'react-native'

const DummyScreen = () => <View style={styles.dummyScreen} />

const homeName = 'Home'
const minigameName = 'Minigames'
const profileName = 'Profile'
const quizName = 'Quiz'
const storeName = 'Store'

const Tab = createBottomTabNavigator()

const iconsSize = 32

const iconMap = {
    home: House,
    store: Storefront,
    minigame: Joystick,
    quiz: Exam,
    profile: UserCircle,
} as const

interface Props {
    name: string
    color: string
    focused: boolean
    iconsSize: number
}

function CustomTabIcon({ name, color, focused, iconsSize }: Props) {
    const IconComponent = iconMap[name as keyof typeof iconMap] || House
    return (
        <View style={focused ? styles.focusedIconContainer : {}}>
            <IconComponent color={color} size={iconsSize} weight="regular" />
        </View>
    )
}

export default function Navbar() {
    return (
        <Tab.Navigator
            initialRouteName={homeName}
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarShowLabel: false,
                tabBarInactiveTintColor: 'gray',
                tabBarStyle: styles.tabBar,
                tabBarItemStyle: styles.tabBarItem,
            })}
        >
            <Tab.Screen
                name={homeName}
                component={DummyScreen}
                options={{
                    tabBarIcon: ({ color, focused }) => (
                        <CustomTabIcon
                            name="home"
                            color={color}
                            focused={focused}
                            iconsSize={iconsSize}
                        />
                    ),
                    tabBarLabelPosition: 'below-icon',
                    tabBarLabelStyle: {
                        fontSize: 12,
                    },
                    tabBarLabel: 'Home',
                }}
            />
            <Tab.Screen
                name={storeName}
                component={DummyScreen}
                options={{
                    tabBarIcon: ({ color, focused }) => (
                        <CustomTabIcon
                            name="store"
                            color="black"
                            focused={focused}
                            iconsSize={iconsSize}
                        />
                    ),
                    tabBarLabelPosition: 'below-icon',
                    tabBarLabelStyle: {
                        fontSize: 12,
                    },
                    tabBarLabel: 'Home',
                }}
            />
            <Tab.Screen
                name={minigameName}
                component={DummyScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <CustomTabIcon
                            name="minigames"
                            color="black"
                            focused={focused}
                            iconsSize={iconsSize}
                        />
                    ),
                    tabBarLabelPosition: 'below-icon',
                    tabBarLabelStyle: {
                        fontSize: 12,
                    },
                    tabBarLabel: 'Home',
                }}
            />
            <Tab.Screen
                name={quizName}
                component={DummyScreen}
                options={{
                    tabBarIcon: ({ color, focused }) => (
                        <CustomTabIcon
                            name="quiz"
                            color="black"
                            focused={focused}
                            iconsSize={iconsSize}
                        />
                    ),
                    tabBarLabelPosition: 'below-icon',
                    tabBarLabelStyle: {
                        fontSize: 12,
                    },
                    tabBarLabel: 'Home',
                }}
            />
            <Tab.Screen
                name={profileName}
                component={DummyScreen}
                options={{
                    tabBarIcon: ({ color, focused }) => (
                        <CustomTabIcon
                            name="profile"
                            color="black"
                            focused={focused}
                            iconsSize={iconsSize}
                        />
                    ),
                    tabBarLabelPosition: 'below-icon',
                    tabBarLabelStyle: {
                        fontSize: 12,
                    },
                    tabBarLabel: 'Home',
                }}
            />
        </Tab.Navigator>
    )
}

const styles = StyleSheet.create({
    dummyScreen: {
        flex: 1,
        backgroundColor: 'white',
    },
    focusedIconContainer: {
        backgroundColor: '#E8DEF8',
        borderRadius: 50,
        width: 60,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabBar: {
        backgroundColor: '#f3f4f6',
        height: 50,
        paddingVertical: 8,
    },
    tabBarItem: {
        justifyContent: 'center',
        marginTop: 5,
    },
})
