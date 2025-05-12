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

const FoodItem = ({ update }: ItemProps) => {
    const pet = useUserPetStore((state) => state.pet)
    
    const needsFood = () => {
        if (pet) {
            const mood = calcPetMood(pet.wellBeing)
            return mood < 12.5
        }
        return false
    }

    const onPress = () => {
        update('hunger')
    }

    return (
        <View style={styles.cbox}>
            {needsFood() && (
                <View style={styles.alertIcon}>
                    <Image src='assets\images\homescreen\icone_feedback.png'/>
                </View>
            )}
            <TouchableWithoutFeedback onPress={onPress}>
                <Image
                    style={{
                        width: `100%`,
                        height: `100%`,
                        resizeMode: `contain`,
                    }}
                    source={require('@/assets/images/homescreen/poteC.png')}
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
