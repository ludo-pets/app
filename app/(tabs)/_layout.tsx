import React, { useEffect } from 'react'
import {
    House,
    Storefront,
    Joystick,
    Exam,
    UserCircle,
} from 'phosphor-react-native'
import { Route, Tabs, useRouter } from 'expo-router'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import Header from '@/components/Header'
import { usePathname } from 'expo-router'
import { useUserPetStore } from '@/stores/userPetStore'
import { NavigationState } from '@react-navigation/native'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'

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

export const unstable_settings = {
    initialRouteName: 'home',
}

export default function TabLayout() {
    const pathname = usePathname()

    const fetchUserAndPet = useUserPetStore((state) => state.fetchUserAndPetByEmail)
    const user = useUserPetStore((state) => state.user)

    useEffect(() => {
        const userId = 'ludopetsages@gmail.com'
        if (!user) {
            fetchUserAndPet(userId)
        }
    }, [fetchUserAndPet, user])

    const includeHeader = ['/store', '/quiz', '/minigames', '/profile']
    const router = useRouter()
    const headerTitles: Record<string, string> = {
        '/store': 'PetShop',
        '/quiz': 'Quiz',
        '/minigames': 'Minigames',
        '/profile': 'Profile',
    }

    const headerTitle = headerTitles[pathname] || ''

    const logout = () => {
        router.replace('/')
    }
    
    const logoutButton = (
        <TouchableOpacity onPress={logout}>
            <MaterialIcons
                name="exit-to-app"
                size={24}
                color="#5B5B5B"
            />
        </TouchableOpacity>
    )
    return (
        <>
            {includeHeader.includes(pathname) && (
                <Header
                    title={headerTitle}
                    coinsValue={pathname === '/store' ? user?.money : undefined}
                    backgroundColor="#CFE2A8"
                    rightComponent={pathname === '/profile' ? logoutButton : undefined}
                />
            )}
            <Tabs
                screenOptions={{
                    headerShown: false,
                    tabBarShowLabel: false,
                    tabBarStyle: getTabBarStyle(),
                    tabBarLabelPosition: 'beside-icon',
                }}
            >
                <Tabs.Screen
                    name="home"
                    options={{
                        title: 'Home',
                        tabBarIcon: ({ color, focused }) => (
                            <CustomTabIcon
                                name="home"
                                color="black"
                                focused={focused}
                                iconsSize={iconsSize}
                            />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="store"
                    options={{
                        title: 'Store',
                        tabBarIcon: ({ color, focused }) => (
                            <CustomTabIcon
                                name="store"
                                color="black"
                                focused={focused}
                                iconsSize={iconsSize}
                            />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="minigames"
                    options={{
                        title: 'Minigames',
                        tabBarIcon: ({ color, focused }) => (
                            <CustomTabIcon
                                name="minigame"
                                color="black"
                                focused={focused}
                                iconsSize={iconsSize}
                            />
                        ),
                    }}
                    listeners={({ navigation, route }) => ({
                        tabPress: (e) => {
                            const r = route as Route<string> & {
                                state?: NavigationState
                            }
                            const nestedState = r.state
                            const currentNested =
                                nestedState?.routes?.[nestedState.index ?? 0]
                                    ?.name ?? 'index'
                            if (currentNested !== 'index') {
                                e.preventDefault() // stop the normal tab change
                                navigation.navigate('minigames', {
                                    screen: 'index',
                                })
                            }
                        },
                    })}
                />
                <Tabs.Screen
                    name="quiz"
                    options={{
                        title: 'Quiz',
                        tabBarStyle: getTabBarStyle(pathname),
                        tabBarIcon: ({ color, focused }) => (
                            <CustomTabIcon
                                name="quiz"
                                color="black"
                                focused={focused}
                                iconsSize={iconsSize}
                            />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="profile"
                    options={{
                        title: 'Profile',
                        tabBarIcon: ({ color, focused }) => (
                            <CustomTabIcon
                                name="profile"
                                color="black"
                                focused={focused}
                                iconsSize={iconsSize}
                            />
                        ),
                    }}
                />
            </Tabs>
        </>
    )
}

function getTabBarStyle(pathname?: string) {
    const baseStyle = StyleSheet.create({
        default: {
            backgroundColor: '#fefefe',
            height: 80,
            paddingBottom: 16,
            paddingTop: 8,
        },
        hidden: {
            height: 0,
            overflow: 'hidden',
            backgroundColor: '#fefefe',
            paddingBottom: 16,
            paddingTop: 8,
        },
    })

    return pathname === '/quizGame' ? baseStyle.hidden : baseStyle.default
}

const styles = StyleSheet.create({
    focusedIconContainer: {
        backgroundColor: '#E8DEF8',
        borderRadius: 50,
        width: 60,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
})
