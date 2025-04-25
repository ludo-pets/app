import React, { useEffect } from 'react'
import {
    House,
    Storefront,
    Joystick,
    Exam,
    UserCircle,
} from 'phosphor-react-native'
import { Tabs } from 'expo-router'
import { StyleSheet, View } from 'react-native'
import Header from '@/components/Header'
import { usePathname } from 'expo-router'
import { useUserPetStore } from '@/stores/userPetStore'

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

    const fetchUserAndPet = useUserPetStore((state) => state.fetchUserAndPet)
    const user = useUserPetStore((state) => state.user)

    useEffect(() => {
        const userId = 'ludopetsages@gmail.com'
        if (!user) {
            fetchUserAndPet(userId)
        }
    }, [fetchUserAndPet, user])

    const includeHeader = ['/store', '/quiz', '/minigames', '/profile']
    const includeBackBtn = ['/minigames', '/quiz']

    const headerTitles: Record<string, string> = {
        '/store': 'PetShop',
        '/quiz': 'Quiz',
        '/minigames': 'Minigames',
        '/profile': 'Profile',
    }

    const headerTitle = headerTitles[pathname] || ''

    return (
        <>
            {includeHeader.includes(pathname) && (
                <Header
                    title={headerTitle}
                    showBackButton={includeBackBtn.includes(pathname)}
                    coinsValue={pathname === '/store' ? user?.money : undefined}
                    backgroundColor="#CFE2A8"
                />
            )}
            <Tabs
                screenOptions={{
                    headerShown: false,
                    tabBarShowLabel: false,
                    tabBarStyle: {
                        backgroundColor: 'white',
                        height: 80,
                        paddingBottom: 16,
                        paddingTop: 8,
                    },
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
                />
                <Tabs.Screen
                    name="quiz"
                    options={{
                        title: 'Quiz',
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
