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

const WcItem = ({ update, image }: ItemProps) => {
    const pet = useUserPetStore((state) => state.pet)

    const needsCleaning = () => {
        if (pet) {
            const { clean } = calcPetMood(pet.wellBeing)
            return clean < 6
        }
        return false
    }

    useEffect(() => {
        setIsDirty(needsCleaning())
    }, [pet])

    const [isDirty, setIsDirty] = useState(needsCleaning())
    const onPress = () => {
        update('clean')
        setIsDirty(needsCleaning())
    }

    return (
        <View style={styles.cbox}>
            {isDirty && (
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
                    style={{ width: `100%`, height: `100%`, resizeMode: 'contain' }}
                    source={{uri: image || require('@/assets/images/homescreen/caixa_de_areia.png')}}
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
        display: 'flex'
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
