import NailTrimGame from '@/components/minigames/nail-trim-game'
import {
    StyleSheet,
    View,
    Text,
    FlatList,
    Dimensions,
    Image,
    TouchableHighlight,
    ImageSourcePropType,
} from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import Minigame from '@/dtos/Minigame'
import { fetchMinigames } from '@/services/fetchMinigames'

const { width, height } = Dimensions.get('window')

const imgRad = 16
const MINIGAMES = {
    NailTrimGame: 'NailTrimGame',
}
const minigameImages: { [key: string]: ImageSourcePropType } = {
    [MINIGAMES.NailTrimGame]: require('@/assets/images/minigames/minigame_icon_test.png'),
}
const minigameComponents: { [key: string]: JSX.Element } = {
    [MINIGAMES.NailTrimGame]: <NailTrimGame />,
}

export default function MinigameScreen() {
    const [showGame, setShowGame] = useState(false)
    const [currentGameCall, setCurrentGameCall] = useState<JSX.Element | null>(
        null
    )
    const [minigames, setMinigames] = useState<Minigame[]>([])
    useEffect(() => {
        loadMinigames()
    }, [])
    useFocusEffect(
        useCallback(() => {
            return () => setShowGame(false)
        }, [])
    )
    const loadMinigames = async () => {
        try {
            const fetchedMinigames = await fetchMinigames()
            setMinigames(fetchedMinigames)
        } catch (error: any) {
            setMinigames([])
        }
    }
    const onPress = (id: string) => {
        const aux: string = minigames.find(
            (dataItem) => dataItem.id === id
        )!.name

        setCurrentGameCall(minigameComponents[aux])
        if (aux != null) {
            setShowGame(true)
        }
    }

    return (
        <View style={styles.container}>
            {' '}
            {showGame ? (
                currentGameCall
            ) : (
                <FlatList
                    data={minigames}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <TouchableHighlight
                            underlayColor="#ebebeb"
                            onPress={() => onPress(item.id)}
                        >
                            <View style={styles.minigameBox}>
                                <View style={styles.imageDiv}>
                                    <View style={styles.picBox}>
                                        <Image
                                            resizeMode="cover"
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                borderRadius: imgRad,
                                            }}
                                            source={minigameImages[item.name]}
                                        />
                                    </View>
                                </View>

                                <View style={styles.textDiv}>
                                    <Text style={styles.title}>
                                        {item.name}
                                    </Text>
                                    <View style={styles.descDiv}>
                                        <Text style={styles.desc}>
                                            {item.description}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableHighlight>
                    )}
                />
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        color: '#5B5B5B',
    },
    desc: {
        fontSize: 15,
        fontWeight: '600',
        color: '#5B5B5B',
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
    minigameBox: {
        //backgroundColor: '#7bb8de',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 3,
        width: width * 1,
        height: height * 0.17,
    },
    imageDiv: {
        flex: 1,
        position: 'absolute',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    picBox: {
        backgroundColor: '#C0DFF3',
        justifyContent: 'center',
        alignItems: 'center',
        height: '86%',
        aspectRatio: 1,
        marginLeft: '2%',
        borderRadius: imgRad,
        padding: 5,
    },
    textDiv: {
        //backgroundColor: 'pink',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        position: 'absolute',
        left: '36%',
        width: '64%',
        height: '74%',
    },
    descDiv: {
        //backgroundColor: '#dcdde3',
        marginTop: '5.5%',
        width: '94%',
        height: '68%',
        borderRadius: 10,
    },
    playButton: {
        backgroundColor: 'lightgrey',
        justifyContent: 'center',
        alignItems: 'center',
        top: '18%',
        width: '20%',
        height: '44%',
        borderRadius: 9,
        //alignSelf: 'center',
    },
})
