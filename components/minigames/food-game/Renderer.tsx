import {
    View,
    StyleSheet,
    Image,
    Text,
    Animated,
    ViewStyle,
    PanResponder,
} from 'react-native'
import { useCharacter } from './Character'
import { GameManagerType } from './GameManager'
import { useGameConfig } from './GameConfig'
import { useEffect, useRef, useState } from 'react'

const playerImage = {
    uri: 'https://projeto-ludo-pets.s3.us-east-1.amazonaws.com/assets/minigames/food-game/open_mouth_cat.png',
}
const heart = {
    uri: 'https://projeto-ludo-pets.s3.us-east-1.amazonaws.com/assets/minigames/food-game/heart.png',
}
const coinIcon = {
    uri: 'https://projeto-ludo-pets.s3.us-east-1.amazonaws.com/assets/profile/pet_coin.png',
}

const Renderer = ({ gameManager }: { gameManager: GameManagerType }) => {
    const {
        characterPosition,
        setCharacterPosition,
        score,
        lifes,
        foods,
        coins,
        checkCollisions,
    } = gameManager
    const { Item } = useCharacter({
        playerImage,
        characterPosition,
    })
    const { config } = useGameConfig()

    // Efeito de brilho no gato (incompleto)
    const [catEffect, setCatEffect] = useState<null | 'good' | 'bad'>(null)
    const effectTimeout = useRef<NodeJS.Timeout | null>(null)

    const foodStyle: ViewStyle = {
        position: 'absolute',
        width: config.FOOD_SIZE,
        height: config.FOOD_SIZE,
    }

    function triggerCatEffect(type: string) {
        if (type === 'good' || type === 'bad') {
            //Interage colisão das comidas no gatos
            //A ideia era setar uma animação que exibe particulas de brilho ao gato comer uma comida
            // setCatEffect(type);
            // if (effectTimeout.current) clearTimeout(effectTimeout.current);
            // effectTimeout.current = setTimeout(() => setCatEffect(null), 350);
        }
    }

    useEffect(() => {
        checkCollisions(triggerCatEffect)
    }, [foods, characterPosition, checkCollisions])

    // PanResponder para movimentação do player
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: (event) => {
                const touchX = event.nativeEvent.locationX
                let newPosition = touchX - config.CHARACTER_WIDTH / 2
                if (newPosition < 0) newPosition = 0

                if (newPosition > config.SCREEN_WIDTH - config.CHARACTER_WIDTH)
                    newPosition = config.SCREEN_WIDTH - config.CHARACTER_WIDTH

                setCharacterPosition(newPosition)
            },
            onPanResponderMove: (event, gestureState) => {
                let newPosition =
                    gestureState.moveX - config.CHARACTER_WIDTH / 2

                if (newPosition < 0) newPosition = 0

                if (newPosition > config.SCREEN_WIDTH - config.CHARACTER_WIDTH)
                    newPosition = config.SCREEN_WIDTH - config.CHARACTER_WIDTH

                setCharacterPosition(newPosition)
            },
            onPanResponderRelease: () => {},
        })
    ).current

    return (
        <View style={styles.gameContainer} {...panResponder.panHandlers}>
            <View style={styles.piso}></View>

            <View style={styles.statsContainer}>
                <View>
                    <Text style={styles.scoreText}>Pontos: {score}</Text>
                    <View style={styles.coinsContainer}>
                        <Image
                            source={coinIcon}
                            resizeMode="contain"
                            style={styles.coinImage}
                        />
                        <Text style={styles.coinValue}>{coins}</Text>
                    </View>
                </View>

                <View>
                    {/* Lifes aqui */}
                    <View style={styles.lifesContainer}>
                        {Array.from({ length: lifes }).map((_, index) => (
                            <View style={styles.lifeBox} key={index}>
                                <Image
                                    source={heart}
                                    resizeMode="contain"
                                    style={styles.lifeImage}
                                />
                            </View>
                        ))}
                    </View>
                </View>
            </View>

            {foods.map((food) => (
                <Animated.View
                    key={food.id}
                    style={[
                        foodStyle,
                        {
                            left: food.x,
                            transform: [{ translateY: food.y }],
                        },
                    ]}
                >
                    <Image
                        source={food.image}
                        style={styles.foodImage}
                        resizeMode="contain"
                    />
                </Animated.View>
            ))}

            {catEffect && (
                <Animated.View
                    style={[
                        styles.catEffect,
                        // catEffect === 'good' ? styles.catEffectGood : (catEffect === "bad" ? styles.catEffectBad : ''),
                    ]}
                />
            )}

            {Item}
        </View>
    )
}

export default Renderer

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#87CEEB',
        width: '100%',
    },
    gameContainer: {
        flex: 1,
    },

    foodImage: {
        width: '100%',
        height: '100%',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    scoreText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },

    healthBar: {
        height: '100%',
        backgroundColor: '#4CAF50',
    },

    piso: {
        width: '100%',
        height: 40,
        position: 'absolute',
        backgroundColor: '#b6e683',
        bottom: 0,
    },
    lifesContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginRight: 10,
    },
    lifeImage: {
        width: '100%',
        height: '100%',
    },

    lifeBox: {
        width: 30,
        height: 30,
        marginLeft: 5,
    },

    coinsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    coinImage: {
        width: 20,
        height: 20,
        marginRight: 5,
    },

    coinValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },

    catEffect: {
        position: 'absolute',
        left: '50%',
        bottom: 60,
        width: 90,
        height: 90,
        marginLeft: -45,
        borderRadius: 45,
        opacity: 0.7,
        zIndex: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 10,
    },
    catEffectGood: {
        backgroundColor: '#7CFC98',
        borderWidth: 2,
        borderColor: '#00ff00',
    },
    catEffectBad: {
        backgroundColor: '#ff6b6b',
        borderWidth: 2,
        borderColor: '#ff0000',
    },
})
