import GameFlow from '@/components/minigames/flappyPet/GameFlow'
import { GameManagerProvider } from '@/provider/minigames/flappyPet/GameManagerProvider'
import { router } from 'expo-router'

export default function FlappyPetGame() {
    return (
        <GameManagerProvider>
            <GameFlow />
        </GameManagerProvider>
    )
}
