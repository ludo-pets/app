import { useEffect } from "react";
import ConfirmExitModal from '@/components/ConfirmExitModal';
import { GameManagerContext, GameManagerProvider } from "@/contexts/minigames/flappyPet/GameManagerProvider";
import {useNavigation} from "@react-navigation/native";
import GameFlow from "@/components/minigames/flappyPet/GameFlow";
export function useConfirmExit() {
  const navigation = useNavigation();
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      console.log('beforeRemove event triggered');
    })

    return unsubscribe
  })
}
