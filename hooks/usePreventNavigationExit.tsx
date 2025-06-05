import { useEffect, useState, useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import { GameManagerContext } from "@/contexts/minigames/flappyPet/GameManagerProvider";

export function useConfirmExit() {
  const navigation = useNavigation();
  const gameManager = useContext(GameManagerContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [pendingAction, setPendingAction] = useState<any>(null); // guardamos a ação de navegação pendente

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      e.preventDefault();
      setModalVisible(true);
      setPendingAction(e.data.action); 
      gameManager?.setGameIdle(true);
    });

    return unsubscribe;
  }, [navigation]);

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
  }

  return {
    modalVisible,
    onConfirm,
    onCancel,
  };
}
