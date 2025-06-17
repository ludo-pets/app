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
import { SvgProps } from 'react-native-svg'

const { height, width } = Dimensions.get('window')

const DrinkItem = ({ setInteractingWithItem, update }: ItemProps) => {
    const pet = useUserPetStore((state) => state.pet)
    const [itemClicked, setItemClicked] = useState(false)

    const needsToDrink = () => {
        if (pet) {
            const { thirst } = calcPetMood(pet.wellBeing)
            return thirst < 12.5
        }
        return false
    }

    const [isThirsty, setIsThirsty] = useState(needsToDrink())
    const onPress = () => {
        setInteractingWithItem(true)
        setItemClicked(true)
        update('thirst')
        setIsThirsty(needsToDrink())
        setTimeout(() => {
            setItemClicked(false)
            setInteractingWithItem(false)
        }, 2000)
    }

    const petInfo = useUserPetStore((state) => state.pet)

    return (
        <View style={styles.cbox}>
            {isThirsty && (
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
                                  width: 236,
                                  height: 166,
                                  position: 'absolute',
                                  bottom: 0,
                                  left: 0,
                              }
                            : { width: '100%', height: '100%' }
                    }
                    source={
                        itemClicked
                            ? pet?.type == 'cat'
                                ? require('@/assets/images/pets/gato/gato-bebendo.png')
                                : require('@/assets/images/pets/cachorro/cachorro-bebendo.png')
                            : require('@/assets/images/homescreen/poteB.png')
                    }
                /> */}
                {itemClicked ? (
                    <>
                        {petInfo?.type === 'cat' ? (
                            <GenericIcon
                                Icon={() => (
                                    <Image
                                        source={require('@/assets/images/pets/gato/gato-bebendo.png')}
                                        style={{ width: 236, height: 166, position: 'absolute', bottom: 0, left: 0 }}
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
                                        source={require('@/assets/images/pets/cachorro/cachorro-bebendo.png')}
                                        style={{ width: 236, height: 166, position: 'absolute', bottom: 0, left: 0 }}
                                        resizeMode="contain"
                                    />
                                )}
                                fill={petInfo?.color || '#7D5D56'}
                                stroke={'#000'}
                            />
                        )}
                        <GenericIcon
                            Icon={() => (
                                <Image
                                    source={require('@/assets/images/homescreen/poteB.png')}
                                    style={{ width: '100%', height: '100%' }}
                                    resizeMode="contain"
                                />
                            )}
                            fill={petInfo?.color || '#7D5D56'}
                            stroke={'#000'}
                        />
                    </>
                ) : null}
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
