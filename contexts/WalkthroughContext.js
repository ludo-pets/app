import React, {
    createContext,
    useState,
    useEffect,
    useContext,
    useCallback,
} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRouter, usePathname, useRootNavigationState } from 'expo-router'

const ASYNC_STORAGE_KEY = 'appGlobalWalkthroughCompleted_v1'

export const WALKTHROUGH_STEPS_CONFIG = [
    {
        id: 'tab_home',
        screenName: 'home',
        content:
            'Bem-vindo! Esta é a aba inicial, cada objeto corresponde a um comando para cuidar do seu pet.',
        placement: 'top',
    },
    {
        id: 'tab_store',
        screenName: 'store',
        content: 'Leve seu pet à PetShop para adquirir ração e cosméticos.',
        placement: 'top',
    },
    {
        id: 'tab_minigames',
        screenName: 'minigames',
        content: 'Divirta-se com os minigames!.',
        placement: 'top',
    },
    {
        id: 'tab_quiz',
        screenName: 'quiz',
        content: 'Aprenda a cuidar do seu pet com os quizzes.',
        placement: 'top',
    },
    {
        id: 'tab_profile',
        screenName: 'profile',
        content: 'Edite seu perfil e preferências do app.',
        placement: 'top',
        isLastStep: true,
    },
]

const WalkthroughContext = createContext(null)

export const WalkthroughProvider = ({ children }) => {
    const [isActive, setIsActive] = useState(false)
    const [currentStepIndex, setCurrentStepIndex] = useState(0)
    const [hasCheckedStorage, setHasCheckedStorage] = useState(false)
    const [isNavReady, setIsNavReady] = useState(false)

    const router = useRouter()
    const currentPathname = usePathname()
    const rootNavState = useRootNavigationState()

    // Effect 1: Determine navigation readiness
    useEffect(() => {
        if (rootNavState?.key) {
            setIsNavReady(true)
        } else {
            setIsNavReady(false)
        }
    }, [rootNavState?.key])

    const [needsWalkthrough, setNeedsWalkthrough] = useState(false)

    useEffect(() => {
        const checkStorageStatus = async () => {
            try {
                const completed = await AsyncStorage.getItem(ASYNC_STORAGE_KEY)
                // const completed = null // TEST ONLY
                if (completed === null) {
                    setNeedsWalkthrough(true)
                } else {
                    setIsActive(false)
                }
            } catch (err) {
                console.error('[WalkthroughProvider] AsyncStorage error', err)
                setIsActive(false)
            } finally {
                setHasCheckedStorage(true)
            }
        }
        checkStorageStatus()
    }, [])

    useEffect(() => {
        if (
            needsWalkthrough &&
            hasCheckedStorage &&
            currentPathname === '/home'
        ) {
            setIsActive(true)
            setCurrentStepIndex(0)
        }
    }, [needsWalkthrough, hasCheckedStorage, currentPathname])

    useEffect(() => {
        if (isActive && hasCheckedStorage && isNavReady) {
            if (
                WALKTHROUGH_STEPS_CONFIG.length > 0 &&
                currentStepIndex < WALKTHROUGH_STEPS_CONFIG.length
            ) {
                const currentStepConfig =
                    WALKTHROUGH_STEPS_CONFIG[currentStepIndex]
                const targetScreenPath = `/${currentStepConfig.screenName}`

                if (currentPathname !== targetScreenPath) {
                    router.replace(targetScreenPath)
                    return
                }
            }
        }
    }, [
        isActive,
        hasCheckedStorage,
        isNavReady,
        currentStepIndex,
        router,
        currentPathname,
    ])

    const completeWalkthrough = useCallback(async (skipped = false) => {
        setIsActive(false)
        try {
            await AsyncStorage.setItem(ASYNC_STORAGE_KEY, 'true')
        } catch (e) {
            console.error(
                '[WalkthroughProvider] Failed to save walkthrough status to AsyncStorage',
                e
            )
        }
    }, [])

    const next = useCallback(() => {
        const currentStepConfig = WALKTHROUGH_STEPS_CONFIG[currentStepIndex]
        if (currentStepConfig?.isLastStep) {
            completeWalkthrough()
            return
        }

        const nextIdx = currentStepIndex + 1
        if (nextIdx < WALKTHROUGH_STEPS_CONFIG.length) {
            setCurrentStepIndex(nextIdx)
        } else {
            completeWalkthrough()
        }
    }, [currentStepIndex, completeWalkthrough])

    const skip = useCallback(() => {
        completeWalkthrough(true)
    }, [completeWalkthrough])

    const value = {
        isActive,
        currentStep:
            isActive && WALKTHROUGH_STEPS_CONFIG[currentStepIndex]
                ? WALKTHROUGH_STEPS_CONFIG[currentStepIndex]
                : null,
        next,
        skip,
        hasCheckedStorage,
    }

    if (!hasCheckedStorage) {
        return null
    }
    return (
        <WalkthroughContext.Provider value={value}>
            {children}
        </WalkthroughContext.Provider>
    )
}

export const useWalkthrough = () => {
    const context = useContext(WalkthroughContext)
    if (context === null) {
        throw new Error(
            'useWalkthrough must be used within a WalkthroughProvider'
        )
    }
    return context
}
