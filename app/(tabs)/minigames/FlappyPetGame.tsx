import GameFlow from '@/components/minigames/flappyPet/GameFlow'
import { GameManagerProvider } from '@/contexts/minigames/flappyPet/GameManagerProvider'
import { useConfirmExit } from '@/hooks/useConfirmExit';

export default function FlappyPetGame() {
    useConfirmExit();
    console.log('FlappyPetGame component rendered');
    return (
        <GameManagerProvider>
            <GameFlow />
        </GameManagerProvider>
    )
}
