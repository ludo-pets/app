import GameFlow from '@/components/minigames/flappyPet/GameFlow'
import { GameManagerProvider } from '@/contexts/minigames/flappyPet/GameManagerProvider'

export default function FlappyPetGame() {
    return (
        <GameManagerProvider>
            <GameFlow />
        </GameManagerProvider>
    )
}
