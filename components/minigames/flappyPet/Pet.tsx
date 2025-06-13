import { gameConstants } from '@/constants/minigames/flappyPet/game'
import { Animated, StyleSheet, Image } from 'react-native'
import { useUserPetStore } from '@/stores/userPetStore'

interface PetProps {
    positionY: Animated.Value
    airPlaneDegree: Animated.Value
}
export default function Pet({ positionY, airPlaneDegree }: PetProps) {
    const airplane = {
        uri: 'https://projeto-ludo-pets.s3.us-east-1.amazonaws.com/assets/minigames/flappyPet/flappyPet/airPlane.png',
    }

    const cat = {
        uri: 'https://projeto-ludo-pets.s3.us-east-1.amazonaws.com/assets/pets/cat.png',
    }

    const dog = {
        uri: 'https://projeto-ludo-pets.s3.us-east-1.amazonaws.com/assets/pets/dog.png',
    }

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

    function renderPet(pet: 'cat' | 'dog' | undefined) {
        if (!pet) return null

        const petImage = pet === 'cat' ? cat : dog

        return (
            <Image
                source={petImage}
                style={styles.petImage}
                resizeMode="contain"
            />
        )
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
            {renderPet(animal)}
            <Image
                style={styles.airPlane}
                source={airplane}
                resizeMode="contain"
            />
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    petImage: {
        width: '50%',
        height: '50%',
        position: 'absolute',
        bottom: '38%',
        left: '20%',
        transform: [{ scaleX: -1 }, { rotate: '30deg' }],
    },
    petContainer: {
        width: gameConstants.petWidth,
        height: gameConstants.petHeight,
        minHeight: 80,
        minWidth: 80,
        position: 'absolute',
        zIndex: 4,
        borderRadius: '50%',
    },
    catPet: {
        width: '50%',
        height: '50%',
        position: 'absolute',
        bottom: '38%',
        left: '20%',
        transform: [{ scaleX: -1 }, { rotate: '40deg' }],
    },
    dogPet: {
        width: '50%',
        height: '50%',
        position: 'absolute',
        bottom: '48%',
        left: '25%',
        transform: [{ scaleX: -1 }, { rotate: '15deg' }],
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
