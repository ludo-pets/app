import {
    StyleSheet,
    View,
    Image,
    TouchableWithoutFeedback,
    Dimensions,
    Platform,
} from 'react-native'
import { InteractionTouch } from './InteractionTouch'
import ItemProps from '@/dtos/ItensProps'
import { useUserPetStore } from '@/stores/userPetStore'
import { calcPetMood } from '@/utils/moodCalculator'

const { height, width } = Dimensions.get('window')

const BedItem = ({ update }: ItemProps) => {

    const pet = useUserPetStore((state) => state.pet)
    
    const needsSleep = () => {
        if (pet) {
            const mood = calcPetMood(pet.wellBeing)
            return mood < 12.5
        }
        return false
    }

    const onPress = () => {
        update('sleep')
    }

    return (
        <View style={styles.cbox}>
            {needsSleep() && (
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
                    source={require('@/assets/images/homescreen/almofada.png')}
                />
            </TouchableWithoutFeedback>
        </View>
    )
}

export default BedItem

const styles = StyleSheet.create({
    cbox: {
        width: '44.2%',
        height: '15%',
        position: 'absolute',
        bottom: Platform.OS === 'ios' ? height / 4.0 : height / 3.33,
        left: width / 1.8,
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
