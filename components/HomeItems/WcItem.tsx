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

const WcItem = ({ update }: ItemProps) => {
    const pet = useUserPetStore((state) => state.pet)

    const needsCleaning = () => {
        if (pet) {
            const mood = calcPetMood(pet.wellBeing)
            return mood < 12.5
        }
        return false
    }

    const onPress = () => {
        update('clean')
    }

    return (
        <View style={styles.cbox}>
            {needsCleaning() && (
                <View style={styles.alertIcon}>
                    <Image src="assets\images\homescreen\icone_feedback.png" />
                </View>
            )}
            <TouchableWithoutFeedback onPress={onPress}>
                <Image
                    style={{ width: `100%`, height: `100%` }}
                    source={require('@/assets/images/homescreen/caixa_de_areia.png')}
                />
            </TouchableWithoutFeedback>
        </View>
    )
}

export default WcItem

const styles = StyleSheet.create({
    cbox: {
        width: '49%',
        height: '8%',
        position: 'absolute',
        bottom: height / 66,
        left: width / 1.96,
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
