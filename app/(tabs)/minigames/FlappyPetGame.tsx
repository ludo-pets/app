import GameFlow from '@/components/minigames/flappyPet/GameFlow'
import { GameManagerProvider } from '@/contexts/minigames/flappyPet/GameManagerProvider'
import ConfirmExitModal from '@/components/ConfirmExitModal'
import { useConfirmExit } from '@/hooks/usePreventNavigationExit'
import { GameManagerContext } from '@/contexts/minigames/flappyPet/GameManagerProvider'
import {useContext } from "react";

export default function FlappyPetGame() {
  const gameManager = useContext(GameManagerContext)
  const isInGame = gameManager?.isInGame ?? false

  const { modalVisible, onConfirm, onCancel } = useConfirmExit(isInGame)

  return (
    <GameManagerProvider>
      <>
        <GameFlow />
        <ConfirmExitModal
          visible={modalVisible}
          onConfirm={onConfirm}
          onCancel={onCancel}
        />
      </>
    </GameManagerProvider>
  )
}
