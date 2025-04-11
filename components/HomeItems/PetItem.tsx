import { StyleSheet, View, Dimensions, Pressable } from 'react-native'
import Gato from '@/assets/images/pets/gato.svg'
import Cachorro from '@/assets/images/pets/cachorro.svg'
import { useUserPetStore } from '@/stores/userPetStore'
import { PetOption } from '../FormRegisterPet'
import GenericIcon from '../GenericIcon'

const { height, width } = Dimensions.get('window')

const PetItem = () => {
    const onPress = () => {
        console.log("don't touch the cat!")
    }

    const petInfo = useUserPetStore((state) => state.pet)

    const pets: PetOption[] = [
        {
            icon: petInfo?.type === 'cat' ? Gato : Cachorro,
            pet_type: petInfo?.type || 'cat',
        },
    ]

    return (
        <View style={styles.cbox}>
            <Pressable onPress={onPress}>
                <GenericIcon
                    Icon={pets[0].icon}
                    fill={petInfo?.color || '#7D5D56'}
                    stroke={'#000'}
                />
            </Pressable>
        </View>
    )
}

export default PetItem

const styles = StyleSheet.create({
    cbox: {
        width: '35%',
        height: '15%',
        position: 'absolute',
        bottom: height / 6,
        right: width / 11,
    },
})
