import Renderer from '@/components/minigames/flappyPet/Renderer'
import StartGameDialog from '@/components/minigames/flappyPet/StatGameDialog'
import { useNavigation } from 'expo-router'
import { useLayoutEffect, useState } from 'react'
import { Pressable, Text } from 'react-native'

// export type gameStateType = 'playing' | 'gameOver' | 'paused'
export default function FlappyPetGame() {
    // const [isPau, setGameState] = useState<gameStateType>('paused')
    const [isGameIdle, setIsGameIdle] = useState(true)

    // if (!isGameIdle) {
    //     setIsGameIdle(true)
    // }
    // if (isGameIdle) {
    //     // setIsGameIdle(false)
    // }
    //esconder taskbar
    const navigation = useNavigation()
    useLayoutEffect(() => {
        navigation.getParent()?.setOptions({
            tabBarStyle: { display: 'none' },
        })

        return () => {
            navigation.getParent()?.setOptions({
                tabBarStyle: undefined,
            })
        }
    }, [navigation])

    return (
        <>
            {/* {isGameIdle && (
                <StartGameDialog
                    startGame={() => {
                        setIsGameIdle(false)
                    }}
                />
            )} */}
            <Pressable onPress={() => setIsGameIdle(!isGameIdle)}>
                <Text>teste</Text>
            </Pressable>
            <Renderer isPaused={isGameIdle} />
        </>
    )
}
