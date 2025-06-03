import {
    StyleSheet,
    View,
    Image,
    TouchableWithoutFeedback,
    Dimensions,
} from 'react-native'
import ItemProps from '@/dtos/ItensProps'
import { useUserPetStore } from '@/stores/userPetStore'
import { calcPetMood } from '@/utils/moodCalculator'
import { useState } from 'react'

const { height, width } = Dimensions.get('window')

const FoodItem = ({ setInteractingWithItem, update }: ItemProps) => {
    const pet = useUserPetStore((state) => state.pet)
    const [itemClicked, setItemClicked] = useState(false)

    const needsFood = () => {
        if (pet) {
            const { hunger } = calcPetMood(pet.wellBeing)
            return hunger < 12.5
        }
        return false
    }

    const [isHungry, setIsHungry] = useState(needsFood())
    const onPress = () => {
        setInteractingWithItem(true)
        setItemClicked(true)
        update('hunger')
        setIsHungry(needsFood())
        setTimeout(() => {
            setItemClicked(false)
            setInteractingWithItem(false)
        }, 2000)
    }

    return (
        <View style={styles.cbox}>
            {isHungry && (
                <View style={styles.alertContainer}>
                    <Image
                        source={require('@/assets/images/homescreen/icone_feedback.png')}
                        style={{
                            width: '100%',
                            height: '100%',
                            resizeMode: 'contain',
                        }}
                    />
                </View>
            )}
            <TouchableWithoutFeedback onPress={onPress}>
                <Image
                    style={{
                        width: '100%',
                        height: '100%',
                        resizeMode: 'contain',
                    }}
                    source={
                        itemClicked
                            ? pet?.type == 'cat'
                                ? require('@/assets/images/pets/gato-comendo.svg')
                                : require('@/assets/images/pets/cachorro-comendo.svg')
                            : require('@/assets/images/homescreen/poteC.png')
                    }
                />
            </TouchableWithoutFeedback>
        </View>
    )
}

export default FoodItem

const styles = StyleSheet.create({
    cbox: {
        width: '26.5%',
        height: '9%',
        position: 'absolute',
        bottom: height / 5.25,
        right: width / 1.45,
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
    },
    alertContainer: {
        position: 'absolute',
        top: -8,
        right: -4,
        width: 30,
        height: 30,
        zIndex: 1,
        backgroundColor: 'white',
        borderRadius: 30,
        padding: 2,
    },
})
