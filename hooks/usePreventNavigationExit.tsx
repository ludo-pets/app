import { useEffect, useState, useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import { GameManagerContext } from "@/contexts/minigames/flappyPet/GameManagerProvider";
import { useGameManager } from "@/components/minigames/food-game/GameManager";



export function useConfirmExit() {
  const navigation = useNavigation();
  const gameManagerFlappy = useContext(GameManagerContext);
  const gameManagerFood = useGameManager();
  const [modalVisible, setModalVisible] = useState(false);
  const [pendingAction, setPendingAction] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      e.preventDefault();
      setModalVisible(true);
      setPendingAction(e.data.action); 
      gameManagerFlappy?.setGameIdle(true);
      gameManagerFood?.setPaused(true);
    });

    return unsubscribe;
  }, [navigation, gameManagerFlappy,gameManagerFood ]);

  function onConfirm() {
    if (pendingAction) {
      navigation.dispatch(pendingAction); 
      setPendingAction(null);
    }
    setModalVisible(false);
  }

  function onCancel() {
    setModalVisible(false); 
    setPendingAction(null);
    gameManagerFlappy?.setGameIdle(false);
    gameManagerFood?.setPaused(false);
  }

  return {
    modalVisible,
    onConfirm,
    onCancel,
  };
}
