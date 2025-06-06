import {
    Dimensions,
    Image,
    Animated,
    ImageSourcePropType,
    StyleSheet,
    Platform,
} from 'react-native'
import {
    PanGestureHandler,
    PanGestureHandlerGestureEvent,
    State,
} from 'react-native-gesture-handler'
import { Nail, NailProgress } from './types'
import { useRef, useState, useCallback } from 'react'
import Svg, { Circle } from 'react-native-svg'
import { Audio, AVPlaybackSource } from 'expo-av'
import { useFocusEffect } from '@react-navigation/native'

const { width, height } = Dimensions.get('window')

//trimmer
const trimmer_initial_position = { x: width / 4, y: height / 6 }
let trimmer_current_position = trimmer_initial_position
const openTrimmer = require('@/assets/images/minigames/nail-trimmer/trimmer-open.png')
const closeTrimmer = require('@/assets/images/minigames/nail-trimmer/trimmer-closed.png')
const trimmerSound: AVPlaybackSource = require('@/assets/images/minigames/nail-trimmer/trimmer-sound.mp3')
//paw
const pawSize = height / 2
const nailSize = pawSize / 6

const CUT_TIME = 1000
let entrou = true
let isNear = false
export type GameBoardProps = {
    addScore: () => void
    pawImage: ImageSourcePropType
    nailsSet: Nail[]
}
export default function GameBoard({
    addScore,
    pawImage,
    nailsSet,
}: GameBoardProps) {
    const [nails, setNails] = useState<Nail[]>(nailsSet)
    const [trimmer, setTrimmer] = useState(trimmer_initial_position)
    const [nailProgress, setNailProgress] = useState<NailProgress>({})
    const [isTrimming, setIsTrimming] = useState(false)
    const trimmerTimeout = useRef<{ [key: string]: NodeJS.Timeout | null }>({})
    const intervalRef = useRef<{ [key: string]: NodeJS.Timeout | null }>({})
    const yOffset = Platform.OS === 'ios' ? pawSize / 1.5 : pawSize / 3

    const playSound = async (s: AVPlaybackSource) => {
        const { sound } = await Audio.Sound.createAsync(s, {
            shouldPlay: true,
            isLooping: false,
        })
        await sound.playAsync()
    }

    const cleanup = () => {
        // Limpar timers
        Object.values(trimmerTimeout.current).forEach(timeout => {
            if (timeout) clearTimeout(timeout);
        });
        Object.values(intervalRef.current).forEach(interval => {
            if (interval) clearInterval(interval);
        });
        trimmerTimeout.current = {};
        intervalRef.current = {};

        // Resetar estados do jogo
        setNails(nailsSet); // <-- volta pro estado inicial
        setTrimmer(trimmer_initial_position);
        setNailProgress({});
        setIsTrimming(false);
        trimmer_current_position = trimmer_initial_position;
        entrou = true;
        isNear = false;
    };
    
    useFocusEffect(
        useCallback(() => {
            return () => {
                cleanup();
            };
        }, [])
    );

    const handleGesture = (e: PanGestureHandlerGestureEvent) => {
        setTrimmer({
            x: trimmer_current_position.x + e.nativeEvent.translationX,
            y: trimmer_current_position.y + e.nativeEvent.translationY,
        })

        nails.forEach((nail) => {
            if (nail.isTrimmed) return
            const nailX = nail.position.x
            const nailY = nail.position.y
            const nailCenterX =
                (width - pawSize) / 2 + nailX * pawSize + nailSize / 2
            const nailCenterY =
                height - pawSize + nailY * pawSize + nailSize / 2

            const trimmerCenterX = trimmer.x
            const trimmerCenterY = trimmer.y

            const distance = Math.sqrt(
                (nailCenterX - trimmerCenterX) ** 2 +
                    (nailCenterY - trimmerCenterY - yOffset) ** 2
            )

            isNear = distance < 40
            if (isNear) {
                if (!trimmerTimeout.current[nail.id] && entrou) {
                    entrou = false
                    let progress = 0
                    const intervalTIme = CUT_TIME / 100
                    const progressIncrement = 1
                    setNailProgress((prev) => ({
                        ...prev,
                        [nail.id]: progress,
                    }))

                    intervalRef.current[nail.id] = setInterval(() => {
                        progress += progressIncrement
                        setNailProgress((prev) => ({
                            ...prev,
                            [nail.id]: progress,
                        }))
                    }, intervalTIme)

                    trimmerTimeout.current[nail.id] = setTimeout(() => {
                        setIsTrimming(true)
                        setTimeout(() => {
                            setIsTrimming(false)
                        }, 200)
                        setNails((prevNails) =>
                            prevNails.map((prevNail) =>
                                prevNail.id === nail.id
                                    ? { ...prevNail, isTrimmed: true }
                                    : prevNail
                            )
                        )
                        playSound(trimmerSound)
                        addScore()
                        clearInterval(intervalRef.current[nail.id]!)
                        trimmerTimeout.current[nail.id] = null
                        setNailProgress((prev) => ({ ...prev, [nail.id]: 100 }))
                        entrou = true
                    }, CUT_TIME)
                }
            } else {
                if (trimmerTimeout.current[nail.id]) {
                    clearTimeout(trimmerTimeout.current[nail.id]!)
                    clearInterval(intervalRef.current[nail.id]!)
                    trimmerTimeout.current[nail.id] = null
                    setNailProgress((prev) => ({ ...prev, [nail.id]: 0 }))
                    entrou = true
                }
            }
        })
    }

    return (
        <Animated.View style={styles.mainBox}>
            <PanGestureHandler
                onGestureEvent={(e) => handleGesture(e)}
                onHandlerStateChange={(e: PanGestureHandlerGestureEvent) => {
                    if (e.nativeEvent.state == State.END)
                        trimmer_current_position = trimmer
                }}
            >
                <Animated.Image
                    source={isTrimming ? closeTrimmer : openTrimmer}
                    style={{
                        ...styles.trimmerImage,
                        zIndex: 4,
                        top: trimmer.y,
                        left: trimmer.x,
                    }}
                    resizeMode="contain"
                />
            </PanGestureHandler>

            <Animated.View style={styles.pawContainer}>
                <Animated.Image source={pawImage} style={styles.paw} />
                {nails.map(
                    (nail) =>
                        nail && (
                            <Animated.View
                                key={nail.id}
                                style={{
                                    position: 'absolute',
                                    width: nailSize,
                                    height: nailSize,
                                    top: pawSize * nail.position.y,
                                    left: pawSize * nail.position.x,
                                }}
                            >
                                <Animated.Image
                                    style={{
                                        transform:
                                            nail.id == 4
                                                ? [{ rotate: nail.rotation }]
                                                : undefined,
                                        width: nailSize,
                                        height: nailSize,
                                        resizeMode: 'contain',
                                    }}
                                    source={
                                        nail.isTrimmed
                                            ? require('@/assets/images/minigames/nail-trimmer/nail-short.png')
                                            : require('@/assets/images/minigames/nail-trimmer/nail-long.png')
                                    }
                                />
                                {nailProgress[nail.id] > 0 &&
                                    !nail.isTrimmed && (
                                        <Svg
                                            height={nailSize}
                                            width={nailSize}
                                            viewBox={`0 0 ${nailSize * 2} ${nailSize * 2}`}
                                            style={{
                                                position: 'absolute',
                                                overflow: 'visible',
                                                top: -nailSize / 2,
                                                left: 0,
                                                zIndex: 15,
                                            }}
                                        >
                                            <Circle
                                                cx={nailSize / 2}
                                                cy={nailSize / 2}
                                                r={(nailSize - 10) / 2}
                                                stroke="lightblue"
                                                strokeWidth="10"
                                                fill="none"
                                                strokeDasharray={
                                                    Math.PI * (nailSize + 10)
                                                }
                                                strokeDashoffset={
                                                    2 *
                                                        Math.PI *
                                                        ((nailSize - 10) / 2) -
                                                    (2 *
                                                        Math.PI *
                                                        ((nailSize - 10) / 2) *
                                                        nailProgress[nail.id]) /
                                                        100
                                                }
                                                strokeLinecap="round"
                                            />
                                        </Svg>
                                    )}
                            </Animated.View>
                        )
                )}
            </Animated.View>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    trimmerImage: {
        position: 'absolute',
        zIndex: 10,
    },
    paw: {
        position: 'absolute',
        width: pawSize / 2,
        height: pawSize / 2,
        bottom: 0,
        zIndex: 3,
    },
    pawContainer: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        width: pawSize,
        height: pawSize,
    },
    trimmerContainer: {
        zIndex: 5,
    },
    mainBox: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        margin: 0,
        padding: 0,
    },
})
