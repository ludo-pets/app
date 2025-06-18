import { useEffect } from "react";
import {useNavigation} from "@react-navigation/native";
export function useConfirmExit() {
  const navigation = useNavigation();
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      console.log('beforeRemove event triggered');
    })

    return unsubscribe
  })
}