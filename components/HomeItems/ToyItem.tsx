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

const ToyItem = ({ update }: ItemProps) => {
    const pet = useUserPetStore((state) => state.pet)
    
    const needsToPlay = () => {
        if (pet) {
            const mood = calcPetMood(pet.wellBeing)
            return mood < 12.5
        }
        return false
    }

    const onPress = () => {
        update('fun')
    }

    return (
        <View style={styles.cbox}>
            {needsToPlay() && (
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
                    source={require('@/assets/images/homescreen/brinquedo.png')}
                />
            </TouchableWithoutFeedback>
        </View>
    )
}

export default ToyItem

const styles = StyleSheet.create({
    cbox: {
        width: '47%',
        height: '41.7%',
        position: 'absolute',
        bottom: Platform.OS === 'ios' ? height / 3.7 : height / 3.36,
        right: width / 1.99,
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
