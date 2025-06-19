import { useEffect, useState } from 'react'
import { useNavigation, useFocusEffect } from '@react-navigation/native'

interface useConfirmeExitProps {
    onResume?: VoidFunction
    onPause?: VoidFunction
}

export function useConfirmExit({ onResume, onPause }: useConfirmeExitProps) {
    const navigation = useNavigation()
    const [modalVisible, setModalVisible] = useState(false)
    const [pendingAction, setPendingAction] = useState<any>(null)

    useFocusEffect(() => {
        const onBeforeRemove = (e: any) => {
            e.preventDefault()
            setModalVisible(true)
            setPendingAction(e.data.action)
            onPause?.()
        }

        const unsubscribe = navigation.addListener('beforeRemove', onBeforeRemove)

        return () => {
            unsubscribe()
        }
    })

    function onConfirm() {
        if (pendingAction) {
            navigation.dispatch(pendingAction)
            setPendingAction(null)
        }
        setModalVisible(false)
    }

    function onCancel() {
        setModalVisible(false)
        setPendingAction(null)
        onResume?.()
    }

    return {
        modalVisible,
        onConfirm,
        onCancel,
    }
}
