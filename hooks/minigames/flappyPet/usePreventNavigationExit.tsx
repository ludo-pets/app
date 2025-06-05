import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";

export function useConfirmExit() {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [pendingAction, setPendingAction] = useState<any>(null); // guardamos a ação de navegação pendente

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      e.preventDefault();
      setModalVisible(true);
      setPendingAction(e.data.action); 
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
