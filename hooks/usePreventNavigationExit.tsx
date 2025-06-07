import { useEffect, useState, useContext } from 'react'
import { useNavigation } from '@react-navigation/native'

interface useConfirmeExitProps {
    onResume: VoidFunction
    onPause: VoidFunction
}

export function useConfirmExit({ onResume, onPause }: useConfirmeExitProps) {
    const navigation = useNavigation()
    const [modalVisible, setModalVisible] = useState(false)
    const [pendingAction, setPendingAction] = useState<any>(null)

    useEffect(() => {
        const unsubscribe = navigation.addListener('beforeRemove', (e) => {
            e.preventDefault()
            setModalVisible(true)
            setPendingAction(e.data.action)
            onPause()
        })

        return unsubscribe
    }, [navigation])

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
        onResume()
    }

    return {
        modalVisible,
        onConfirm,
        onCancel,
    }
}
