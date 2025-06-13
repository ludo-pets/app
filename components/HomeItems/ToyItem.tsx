import {
    StyleSheet,
    View,
    Image,
    TouchableWithoutFeedback,
    Dimensions,
    Platform,
} from 'react-native'
import ItemProps from '@/dtos/ItensProps'
import { useUserPetStore } from '@/stores/userPetStore'
import { calcPetMood } from '@/utils/moodCalculator'
import { useState } from 'react'

const { height, width } = Dimensions.get('window')

const ToyItem = ({ update }: ItemProps) => {
    const pet = useUserPetStore((state) => state.pet)

    const needsToPlay = () => {
        if (pet) {
            const { play } = calcPetMood(pet.wellBeing)
            return play < 6
        }
        return false
    }

    const [isPlayful, setIsPlayful] = useState(needsToPlay())
    const onPress = () => {
        update('fun')
        setIsPlayful(needsToPlay())
    }

    return (
        <View style={styles.cbox}>
            {isPlayful && (
                <View style={styles.alertContainer}>
                    <Image
                        source={{
                            uri: 'https://projeto-ludo-pets.s3.us-east-1.amazonaws.com/assets/homescreen/feedback_icon.png',
                        }}
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
                        resizeMode: `contain`,
                    }}
                    source={{
                        uri: 'https://projeto-ludo-pets.s3.us-east-1.amazonaws.com/assets/homescreen/scratcher.png',
                    }}
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
