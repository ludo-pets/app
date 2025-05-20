import { gameConstants } from '@/constants/game'
import { Animated, StyleSheet, Image } from 'react-native'
import { useUserPetStore } from '@/stores/userPetStore'
import Gato from '@/assets/images/pets/gato.svg'
import Cachorro from '@/assets/images/pets/cachorro.svg'

interface PetProps {
    positionY: Animated.Value
    airPlaneDegree: Animated.Value
}

export default function Pet({ positionY, airPlaneDegree }: PetProps) {
    //images
    const airplane = require('@/assets/images/minigames/flappyPet/airPlane.png')

    const animal = useUserPetStore((state) => state.pet?.type)
    const color = useUserPetStore((state) => state.pet?.color)

    const interpolatedAirPlaneDegree = airPlaneDegree.interpolate({
        inputRange: [
            gameConstants.airPlaneDegreeDown,
            gameConstants.airPlaneDegreeUp,
        ],
        outputRange: [
            `${gameConstants.airPlaneDegreeUp}deg`,
            `${gameConstants.airPlaneDegreeDown}deg`,
        ],
        extrapolate: 'clamp',
    })

    const renderPet = () => {
        if (animal === 'cat') {
            return (
                <Gato
                    width="80%"
                    height="80%"
                    fill={color}
                    style={styles.pet}
                />
            )
        }
        if (animal === 'dog') {
            return (
                <Cachorro
                    width="80%"
                    height="80%"
                    fill={color}
                    style={styles.pet}
                />
            )
        }
        return null
    }

    return (
        <Animated.View
            style={[
                styles.petContainer,
                {
                    transform: [
                        { translateY: positionY },
                        { rotate: interpolatedAirPlaneDegree },
                    ],
                },
            ]}
        >
            {renderPet()}
            <Image
                style={styles.airPlane}
                source={airplane}
                resizeMode="contain"
            />
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    petContainer: {
        width: gameConstants.petWidth,
        height: gameConstants.petHeight,
        minHeight: 80,
        minWidth: 80,
        position: 'absolute',
        bottom: 100,
        left: 50,
        zIndex: 4,
    },
    pet: {
        width: '80%',
        height: '80%',
        position: 'absolute',
        bottom: '30%',
        left: '10%',
        zIndex: 4,
        transform: [{ scaleX: -1 }, { rotate: '25deg' }],
    },

    airPlane: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        bottom: 0,
        left: 0,
        transform: [{ scaleX: -1 }],
    },
})
