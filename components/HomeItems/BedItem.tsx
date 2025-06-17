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
import GenericIcon from '../GenericIcon'

const { height, width } = Dimensions.get('window')

const BedItem = ({ setInteractingWithItem, update }: ItemProps) => {
    const pet = useUserPetStore((state) => state.pet)
    const [itemClicked, setItemClicked] = useState(false)

    const needsSleep = () => {
        if (pet) {
            const { sleep } = calcPetMood(pet.wellBeing)
            return sleep < 12.5
        }
        return false
    }

    const [isSleepy, setIsSleepy] = useState(needsSleep())
    const onPress = () => {
        setInteractingWithItem(true)
        setItemClicked(true)
        update('sleep')
        setIsSleepy(needsSleep())
        setTimeout(() => {
            setItemClicked(false)
            setInteractingWithItem(false)
        }, 2000)
    }

    const petInfo = useUserPetStore((state) => state.pet)

    return (
        <View
            style={{
                width: itemClicked ? 210 : '44.2%',
                height: itemClicked ? 120 : '15%',
                position: 'absolute',
                bottom: Platform.OS === 'ios' ? height / 4.0 : height / 3.33,
                left: width / 1.8,
                justifyContent: 'center',
                alignItems: 'center',
                display: 'flex',
            }}
        >
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
                <View 
                    style={
                        itemClicked
                            ? { width: 210, height: 120 }
                            : { width: '100%', height: '100%' }
                    }
                >
                    {itemClicked ? (
                        // Quando clicado, usar SVG com GenericIcon
                        petInfo?.type === 'cat' ? (
                            <GenericIcon
                                Icon={() => (
                                    <Image
                                        source={
                                            require('@/assets/images/pets/gato/gato-dormindo.svg')
                                                .default
                                        }
                                        style={{ width: '100%', height: '100%' }}
                                        resizeMode="contain"
                                    />
                                )}
                                fill={petInfo?.color || '#7D5D56'}
                                stroke={'#000'}
                            />
                        ) : (
                            <GenericIcon
                                Icon={() => (
                                    <Image
                                        source={
                                            require('@/assets/images/pets/cachorro/cachorro-dormindo.svg')
                                                .default
                                        }
                                        style={{ width: '100%', height: '100%' }}
                                        resizeMode="contain"
                                    />
                                )}
                                fill={petInfo?.color || '#7D5D56'}
                                stroke={'#000'}
                            />
                        )
                    ) : (
                        // Quando não clicado, usar imagem PNG normal
                        <Image
                            style={{
                                width: '100%',
                                height: '100%',
                                resizeMode: 'contain',
                            }}
                            source={require('@/assets/images/homescreen/almofada.png')}
                        />
                    )}
                </View>
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
