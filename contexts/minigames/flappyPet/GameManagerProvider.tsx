import { createContext, ReactNode, useState } from 'react'

type GameManagerType = {
    isGameIdle: boolean
    setGameIdle: (value: boolean) => void
    isGameOver: boolean
    setGameOver: (value: boolean) => void
    score: number
    setGameScore: (value: number) => void
    incrementScore: () => void
    coins: number
    resetGame: () => void
    setFallingAnimation: (value: boolean) => void
    isFallingAnimation: boolean
}

export const GameManagerContext = createContext<GameManagerType | null>(null)
interface GameManagerProviderProps {
    children: ReactNode
}
export function GameManagerProvider({ children }: GameManagerProviderProps) {
    const [isGameIdle, setIsGameIdle] = useState(true)
    const [isGameOver, setIsGameOver] = useState(false)
    const [score, setScore] = useState(0)
    const [coins, setCoins] = useState(0)
    const [isFallingAnimation, setIsFallingAnimation] = useState(false)

    const setGameIdle = (value: boolean) => setIsGameIdle(value)
    const setGameOver = (value: boolean) => setIsGameOver(value)
    const setGameScore = (value: number) => setScore(value)
    const setFallingAnimation = (value: boolean) => setIsFallingAnimation(value)

    const incrementScore = () =>
        setScore((prev) => {
            if (prev % 5 === 0 && prev !== 0) {
                setCoins((prev) => prev + 1)
            }
            return prev + 1
        })

    const resetGame = () => {
        setIsGameIdle(true)
        setIsGameOver(false)
        setScore(0)
        setCoins(0)
    }

    const value = {
        isGameIdle,
        setGameIdle,
        isGameOver,
        setGameOver,
        score,
        setGameScore,
        incrementScore,
        coins,
        resetGame,
        setFallingAnimation,
        isFallingAnimation,
    }
    return (
        <GameManagerContext.Provider value={value}>
            {children}
        </GameManagerContext.Provider>
    )
}
