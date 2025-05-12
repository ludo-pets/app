import {
    StyleSheet,
    View,
    Image,
    TouchableWithoutFeedback,
    Dimensions,
} from 'react-native'
import { InteractionTouch } from './InteractionTouch'
import ItemProps from '@/dtos/ItensProps'
import { useUserPetStore } from '@/stores/userPetStore'
import { calcPetMood } from '@/utils/moodCalculator'

const { height, width } = Dimensions.get('window')

const DrinkItem = ({ update }: ItemProps) => {
    const pet = useUserPetStore((state) => state.pet)
    
    const needsToDrink = () => {
        if (pet) {
            const mood = calcPetMood(pet.wellBeing)
            return mood < 12.5
        }
        return false
    }

    const onPress = () => {
        update('thirst')
    }

    return (
        <View style={styles.cbox}>
            {needsToDrink() && (
                <View style={styles.alertIcon}>
                    <Image src='assets\images\homescreen\icone_feedback.png'/>
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
        //backgroundColor: 'blue',
    },
    alertIcon: {
        position: 'absolute',
        top: -10,
        right: -10,
        zIndex: 1,
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 2,
    },
})
