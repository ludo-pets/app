import { GameManagerContext } from '@/contexts/minigames/flappyPet/GameManagerProvider'
import { useContext } from 'react'

export default function useGameManager() {
    const context = useContext(GameManagerContext)
    if (!context) {
        throw new Error(
            'useGameManager must be used within a GameManagerProvider'
        )
    }
    return context
}
