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
import GenericIcon from '../GenericIcon'

const { height, width } = Dimensions.get('window')

const WcItem = ({ setInteractingWithItem, update }: ItemProps) => {
    const pet = useUserPetStore((state) => state.pet)
    const [itemClicked, setItemClicked] = useState(false)

    const needsCleaning = () => {
        if (pet) {
            const { clean } = calcPetMood(pet.wellBeing)
            return clean < 6
        }
        return false
    }

    const [isDirty, setIsDirty] = useState(needsCleaning())
    const onPress = () => {
        setInteractingWithItem(true)
        setItemClicked(true)
        update('clean')
        setIsDirty(needsCleaning())
        setTimeout(() => {
            setItemClicked(false)
            setInteractingWithItem(false)
        }, 2000)
    }

    const petInfo = useUserPetStore((state) => state.pet)

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
                {/* <Image
                    style={
                        itemClicked
                            ? {
                                  width: 226,
                                  height: 172,
                                  position: 'absolute',
                                  bottom: 0,
                                  right: 0,
                              }
                            : { width: '100%', height: '100%' }
                    }
                    source={
                        pet?.type === 'cat'
                            ? itemClicked
                                ? require('@/assets/images/pets/gato/gato-banheiro.png')
                                : require('@/assets/images/homescreen/caixa_de_areia.png')
                            : itemClicked
                            ? require('@/assets/images/pets/cachorro/cachorro-banheiro.png')
                            : require('@/assets/images/homescreen/wc-cachorro.png')
                    }
                /> */}
                {itemClicked ? (
                    petInfo?.type === 'cat' ? (
                        <GenericIcon
                            Icon={() => (
                                <Image
                                    source={require('@/assets/images/pets/gato/gato-banheiro.png')}
                                    style={{
                                        width: 270,
                                        height: 305,
                                        position: 'absolute',
                                        bottom: 16,
                                        left: -14,
                                    }}
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
                                    source={require('@/assets/images/pets/cachorro/cachorro-banheiro.png')}
                                    style={{
                                        width: 270,
                                        height: 305,
                                        position: 'absolute',
                                        bottom: 16,
                                        left: -14,
                                    }}
                                    resizeMode="contain"
                                />
                            )}
                            fill={petInfo?.color || '#7D5D56'}
                            stroke={'#000'}
                        />
                    )
                ) : petInfo?.type === 'cat' ? (
                    <GenericIcon
                        Icon={() => (
                            <Image
                                source={require('@/assets/images/homescreen/caixa_de_areia.png')}
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
                                source={require('@/assets/images/homescreen/wc-cachorro.png')}
                                style={{ width: '100%', height: '100%' }}
                                resizeMode="contain"
                            />
                        )}
                        fill={petInfo?.color || '#7D5D56'}
                        stroke={'#000'}
                    />
                )}
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
