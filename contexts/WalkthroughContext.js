import React, {
    createContext,
    useState,
    useEffect,
    useContext,
    useCallback,
} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { router, usePathname } from 'expo-router'

const ASYNC_STORAGE_KEY = 'appWalkthroughTooltip_v0'

export const WALKTHROUGH_STEPS_CONFIG = [
    {
        id: 'tab_home',
        screenName: 'home',
        content:
            'Bem‑vindo! Esta é a aba inicial, cuide do seu pet clicando nos respectivos ícones.',
        placement: 'top',
    },
    {
        id: 'tab_store',
        screenName: 'store',
        content: 'Visite a Pet Shop para comprar itens ao seu pet.',
        placement: 'top',
    },
    {
        id: 'tab_minigames',
        screenName: 'minigames',
        content:
            'Divirta‑se com os minigames! Você pode acessá‑los por este ícone.',
        placement: 'top',
    },
    {
        id: 'tab_quiz',
        screenName: 'quiz',
        content: 'Aprenda a cuidar do seu pet com os Quizzes.',
        placement: 'top',
    },
    {
        id: 'tab_profile',
        screenName: 'profile',
        content: 'Configure seu perfil.',
        placement: 'top',
        isLastStep: true,
    },
]

const WalkthroughContext = createContext(null)

export const WalkthroughProvider = ({ children }) => {
    const [isActive, setIsActive] = useState(false)
    const [currentStepIndex, setCurrentStepIndex] = useState(0)
    const [hasCheckedStorage, setHasCheckedStorage] = useState(false)

    const currentPathname = usePathname()

    useEffect(() => {
        let cancelled = false

        ;(async () => {
            try {
                const completed = await AsyncStorage.getItem(ASYNC_STORAGE_KEY)
                if (cancelled) return

                if (completed === null) {
                    setIsActive((prev) => (prev ? prev : true))
                    setCurrentStepIndex((prev) => (prev === 0 ? prev : 0))

                    const firstStepPath = `/${WALKTHROUGH_STEPS_CONFIG[0].screenName}`
                    if (
                        currentPathname !== firstStepPath &&
                        currentPathname != '/'
                    ) {
                        router.replace(firstStepPath)
                    }
                } else {
                    setIsActive(false)
                }
            } catch (e) {
                console.log('Walkthrough: Failed to load status', e)
                setIsActive(false)
            } finally {
                if (!cancelled) setHasCheckedStorage(true)
            }
        })()

        return () => {
            cancelled = true
        }
    }, [])

    const completeWalkthrough = useCallback(async () => {
        setIsActive(false)
        setCurrentStepIndex(0)
        try {
            await AsyncStorage.setItem(ASYNC_STORAGE_KEY, 'true')
        } catch (e) {
            console.log('Walkthrough: Failed to save status', e)
        }
    }, [])

    const next = useCallback(() => {
        const currentStep = WALKTHROUGH_STEPS_CONFIG[currentStepIndex]

        if (currentStep?.isLastStep) {
            completeWalkthrough()
            return
        }

        const nextIdx = currentStepIndex + 1
        if (nextIdx < WALKTHROUGH_STEPS_CONFIG.length) {
            const nextStep = WALKTHROUGH_STEPS_CONFIG[nextIdx]
            setCurrentStepIndex(nextIdx)

            const nextScreenPath = `/${nextStep.screenName}`
            if (currentPathname !== nextScreenPath) {
                router.navigate(nextScreenPath)
            }
        } else {
            completeWalkthrough()
        }
    }, [currentStepIndex, currentPathname, completeWalkthrough])

    const skip = useCallback(() => {
        completeWalkthrough()
    }, [completeWalkthrough])

    const contextValue = React.useMemo(
        () => ({
            isActive,
            isCompleted: !isActive && hasCheckedStorage,
            currentStep:
                isActive && WALKTHROUGH_STEPS_CONFIG[currentStepIndex]
                    ? WALKTHROUGH_STEPS_CONFIG[currentStepIndex]
                    : null,
            next,
            skip,
            hasCheckedStorage,
        }),
        [isActive, currentStepIndex, next, skip, hasCheckedStorage]
    )

    if (!hasCheckedStorage) return null

    return (
        <WalkthroughContext.Provider value={contextValue}>
            {children}
        </WalkthroughContext.Provider>
    )
}

export const useWalkthrough = () => {
    const ctx = useContext(WalkthroughContext)
    if (ctx === null) {
        throw new Error(
            'useWalkthrough must be used within a WalkthroughProvider'
        )
    }
    return ctx
}
