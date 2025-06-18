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
import { useEffect } from 'react'

const { height, width } = Dimensions.get('window')

const BedItem = ({ update }: ItemProps) => {
    const pet = useUserPetStore((state) => state.pet)

  
    const needsSleep = () => {
        if (pet) {
            const {sleep} = calcPetMood(pet.wellBeing)
            return sleep < 12.5
        }
        return false
    }

      useEffect(() => {
        setIsSleepy(needsSleep())
    }, [pet])

    const [isSleepy, setIsSleepy] = useState(needsSleep())
    const onPress = () => {
        update('sleep')
        setIsSleepy(needsSleep())
    }

    return (
        <View style={styles.cbox}>
            {isSleepy && (
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
    },
    alertContainer: {
        position: 'absolute',
        top: 4,
        right: -2,
        width: 30,
        height: 30,
        zIndex: 1,
        backgroundColor: 'white',
        borderRadius: 30,
        padding: 2,
    },
})
