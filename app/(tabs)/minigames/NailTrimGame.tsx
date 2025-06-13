import { useEffect, useState } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { Dimensions, StyleSheet } from 'react-native'

import StartGameDialog from '../../../components/minigames/nail-trim-game/StatGameDialog'
import EndGameDialog from '../../../components/minigames/nail-trim-game/EndGameDialog'
import GameBoard from '../../../components/minigames/nail-trim-game/GameBoard'
import { petSet } from '@/components/minigames/nail-trim-game/PetSets'

import { useUserPetStore } from '@/stores/userPetStore'
import { useRouter } from 'expo-router'
import { useMinigameStore } from '@/stores/minigameStore'

const { width } = Dimensions.get('window');


export default function NailTrimGame() {
    const [started, setStarted] = useState(false)
    const [ended, setEnded] = useState(false)
    const [score, setScore] = useState(0)
    const [gameKey, setGameKey] = useState(0)
    const user = useUserPetStore((state) => state.user)
    const pet = useUserPetStore((state) => state.pet)
    const userUpdate = useUserPetStore((state) => state.updateUser)
    const router = useRouter()
    const { minigame, fetchMinigame } = useMinigameStore()
    const minigameId = 'UUorkjz1g8ZCRDNTK3k2'

    const addScore = () => {
        setScore(score + 1)
    }

    useEffect(() => {
        if (score >= 4) setEnded(true)
    }, [score])

    useEffect(() => {
        if (!minigame) {
            fetchMinigame(minigameId)
        }
    }, [minigame, minigameId, fetchMinigame])

    const endGame = async () => {
        if (user && minigame) {
            await userUpdate(user.id, {
                money: user.money + minigame.givenMoney,
            })
            setGameKey(gameKey + 1)
            setStarted(false)
            setEnded(false)
            setScore(0)
            router.push('/home')
        }
    }
    useEffect(()=>{}, [pet]);
    return (
        <GestureHandlerRootView style={styles['game-container']}>
            {!started && <StartGameDialog startGame={setStarted} />}

            {ended && minigame && (
                <EndGameDialog
                    endGame={endGame}
                    givenMoney={minigame.givenMoney}
                />
            )}
            {/* {pet && (
                <GameBoard
                    key={gameKey}
                    pawImage={petSet[pet.type].pawImage}
                    addScore={addScore}
                    nailsSet={petSet[pet.type].nailSet}
                    nailLong={petSet[pet.type].nailLongImage}
                    nailShort={ petSet[pet.type].nailShortImage }
                />
            )} */}
            {/*para testes, apagar dps*/}
             {pet && (
                <GameBoard
                    key={gameKey}
                    pawImage={petSet["dog"].pawImage}
                    addScore={addScore}
                    nailsSet={petSet["dog"].nailSet}
                    nailLong={petSet["dog"].nailLongImage}
                    nailShort={ petSet["dog"].nailShortImage }
                />
            )}
        </GestureHandlerRootView>
    )
}

const styles = StyleSheet.create({
    'game-container': {
        backgroundColor: '#fff',
        boxSizing: 'content-box',
        height: '100%',
        width: width,
        padding: 0,
        margin: 0,
        position: 'relative',
    },
    header: {
        width: '100%',
        display: 'flex',
        boxShadow: '0 0 0px 4px rgba(0,0,0,0.2)',
        color: '#5B5B5B',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingRight: 10,
        paddingLeft: 10,
        position: 'relative',
    },
    icon: {
        width: width / 10,
        height: width / 10,
        flexGrow: 1,
        opacity: 0.6,
        position: 'absolute',
        left: width / 20,
    },
    title: {
        flexGrow: 50,
        textAlign: 'center',
    },
})
