import Header from '@/components/Header'
import { useUserPetStore } from '@/stores/userPetStore'
import { NavigationState } from '@react-navigation/native'
import { Route, Tabs, usePathname } from 'expo-router'
import {
    Exam,
    House,
    Joystick,
    Storefront,
    UserCircle,
} from 'phosphor-react-native'
import React, { useEffect } from 'react'
import {
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'
import Tooltip from 'react-native-walkthrough-tooltip'
import {
    useWalkthrough,
    WalkthroughProvider,
} from '@/contexts/WalkthroughContext'

const iconsSize = 32

const iconMap = {
    home: House,
    store: Storefront,
    minigame: Joystick,
    quiz: Exam,
    profile: UserCircle,
} as const

interface CustomTabIconWithTooltipProps {
    name: keyof typeof iconMap
    color: string
    focused: boolean
    iconsSize: number
    targetElementId: string
}

function CustomTabIconWithTooltip({
    name,
    color,
    focused,
    iconsSize,
    targetElementId,
}: CustomTabIconWithTooltipProps) {
    const IconComponent = iconMap[name] || House

    const walkthrough = useWalkthrough()
    if (!walkthrough) return null

    const {
        isActive: isWalkthroughGloballyActive,
        currentStep,
        next,
        skip,
    } = walkthrough

    const anchor = (
        <View
            style={focused ? styles.focusedIconContainer : styles.iconContainer}
        >
            <IconComponent color={color} size={iconsSize} weight="regular" />
        </View>
    )

    if (!isWalkthroughGloballyActive || !currentStep) {
        return anchor
    }
    const isCurrentWalkthroughTarget = currentStep.id === targetElementId

    if (!isCurrentWalkthroughTarget) {
        return anchor
    }

    const tooltipContent = (
        <View style={styles.tooltipContentContainer}>
            <Text style={styles.tooltipText}>{currentStep.content}</Text>
            <View style={styles.tooltipButtonsContainer}>
                <TouchableOpacity onPress={skip} style={styles.tooltipButton}>
                    <Text style={styles.tooltipButtonSkipText}>Pular Tudo</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={next} style={styles.tooltipButton}>
                    <Text style={styles.tooltipButtonNextText}>
                        {currentStep.isLastStep ? 'Concluir' : 'Próximo'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )

    return (
        <Tooltip
            isVisible
            content={tooltipContent}
            placement={currentStep.placement || 'top'}
            onClose={next}
            useInteractionManager
            topAdjustment={
                Platform.OS === 'android' ? -(StatusBar.currentHeight || 0) : 0
            }
        >
            {anchor}
        </Tooltip>
    )
}

export const unstable_settings = {
    initialRouteName: 'home',
}

export default function TabLayout() {
    const currentRoutePath = usePathname()
    const simplePathname = currentRoutePath.substring(1)

    const fetchUserAndPet = useUserPetStore((state) => state.fetchUserAndPet)
    const user = useUserPetStore((state) => state.user)

    useEffect(() => {
        const userId = 'ludopetsages@gmail.com'
        if (!user) {
            fetchUserAndPet(userId)
        }
    }, [fetchUserAndPet, user])

    const includeHeader = ['store', 'quiz', 'minigames', 'profile']

    const headerTitles: Record<string, string> = {
        store: 'PetShop',
        quiz: 'Quiz',
        minigames: 'Minigames',
        profile: 'Perfil',
    }

    const headerTitle = headerTitles[simplePathname] || ''

    return (
        <>
            <WalkthroughProvider>
                {includeHeader.includes(simplePathname) && (
                    <Header
                        title={headerTitle}
                        coinsValue={
                            simplePathname === 'store' ? user?.money : undefined
                        }
                        backgroundColor="#CFE2A8"
                    />
                )}

                <Tabs
                    screenOptions={{
                        headerShown: false,
                        tabBarShowLabel: false,
                        tabBarStyle: getTabBarStyle(currentRoutePath),
                        tabBarLabelPosition: 'beside-icon',
                    }}
                >
                    <Tabs.Screen
                        name="home"
                        options={{
                            title: 'Home',
                            tabBarIcon: ({ color, focused }) => (
                                <CustomTabIconWithTooltip
                                    name="home"
                                    color="black"
                                    focused={focused}
                                    iconsSize={iconsSize}
                                    targetElementId="tab_home"
                                />
                            ),
                        }}
                    />
                    <Tabs.Screen
                        name="store"
                        options={{
                            title: 'Store',
                            tabBarIcon: ({ color, focused }) => (
                                <CustomTabIconWithTooltip
                                    name="store"
                                    color="black"
                                    focused={focused}
                                    iconsSize={iconsSize}
                                    targetElementId="tab_store"
                                />
                            ),
                        }}
                    />
                    <Tabs.Screen
                        name="minigames"
                        options={{
                            title: 'Minigames',
                            tabBarIcon: ({ color, focused }) => (
                                <CustomTabIconWithTooltip
                                    name="minigame"
                                    color="black"
                                    focused={focused}
                                    iconsSize={iconsSize}
                                    targetElementId="tab_minigames"
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
                                    nestedState?.routes?.[
                                        nestedState.index ?? 0
                                    ]?.name ?? 'index'
                                if (currentNested !== 'index') {
                                    e.preventDefault()
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
                            tabBarIcon: ({ color, focused }) => (
                                <CustomTabIconWithTooltip
                                    name="quiz"
                                    color="black"
                                    focused={focused}
                                    iconsSize={iconsSize}
                                    targetElementId="tab_quiz"
                                />
                            ),
                        }}
                    />
                    <Tabs.Screen
                        name="profile"
                        options={{
                            title: 'Profile',
                            tabBarIcon: ({ color, focused }) => (
                                <CustomTabIconWithTooltip
                                    name="profile"
                                    color="black"
                                    focused={focused}
                                    iconsSize={iconsSize}
                                    targetElementId="tab_profile"
                                />
                            ),
                        }}
                    />
                </Tabs>
            </WalkthroughProvider>
        </>
    )
}

function getTabBarStyle(currentRoutePath?: string) {
    const baseStyle = StyleSheet.create({
        default: {
            backgroundColor: '#fefefe',
            height: 80,
            paddingBottom: 16,
            paddingTop: 8,
            borderTopWidth: 1,
            borderTopColor: '#e0e0e0',
        },
        hidden: {
            display: 'none',
        },
    })

    if (
        currentRoutePath?.startsWith('/minigames/') &&
        currentRoutePath !== '/minigames'
    ) {
        return baseStyle.hidden
    }
    return baseStyle.default
}

const styles = StyleSheet.create({
    iconContainer: {
        width: 60,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 16,
    },
    focusedIconContainer: {
        backgroundColor: '#E8DEF8',
        borderRadius: 16,
        width: 60,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tooltipContentContainer: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: 'white',
        borderRadius: 8,
        maxWidth: 300,
        alignSelf: 'center',
    },
    tooltipText: {
        color: '#333333',
        marginBottom: 16,
        textAlign: 'center',
        fontSize: 15,
        lineHeight: 20,
    },
    tooltipButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    tooltipButton: {
        paddingVertical: 6,
        paddingHorizontal: 12,
    },
    tooltipButtonSkipText: {
        color: '#555555',
        fontSize: 14,
    },
    tooltipButtonNextText: {
        color: '#007AFF',
        fontWeight: '600',
        fontSize: 14,
    },
})
