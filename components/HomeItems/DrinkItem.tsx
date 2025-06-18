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
import { useEffect } from 'react'

const { height, width } = Dimensions.get('window')

const DrinkItem = ({ update }: ItemProps) => {
    const pet = useUserPetStore((state) => state.pet)
    
    const needsToDrink = () => {
        if (pet) {
            const {thirst} = calcPetMood(pet.wellBeing)
            return thirst < 12.5
        }
        return false
    }

    useEffect(() => {
        setIsThirsty(needsToDrink())
    }, [pet])

    const [isThirsty, setIsThirsty] = useState(needsToDrink())
    const onPress = () => {
        update('thirst')
        setIsThirsty(needsToDrink())
    }

    return (
        <View style={styles.cbox}>
            {isThirsty && (
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
                        width: `100%`,
                        height: `100%`,
                        resizeMode: 'contain',
                    }}
                    source={require('@/assets/images/homescreen/poteB.png')}
                />
            </TouchableWithoutFeedback>
        </View>
    )
}

export default DrinkItem

const styles = StyleSheet.create({
    cbox: {
        width: '27.5%',
        height: '9.02%',
        position: 'absolute',
        bottom: height / 9.963,
        right: width / 1.45,
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
    },
    alertContainer: {
        position: 'absolute',
        top: -10,
        right: -10,
        width: 30,
        height: 30,
        zIndex: 1,
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 2,
    },
})
