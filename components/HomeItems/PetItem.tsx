import { StyleSheet, View, Dimensions, Pressable, Platform } from 'react-native'
import { useUserPetStore } from '@/stores/userPetStore'
import { PetOption } from '../FormRegisterPet'
import GenericIcon from '../GenericIcon'

const { height, width } = Dimensions.get('window')

const PetItem = () => {
    const onPress = () => {
        console.log("don't touch the cat!")
    }

    const petInfo = useUserPetStore((state) => state.pet)
    const cat = {
        uri: 'https://projeto-ludo-pets.s3.us-east-1.amazonaws.com/assets/pets/cat.png',
    }

    const dog = {
        uri: 'https://projeto-ludo-pets.s3.us-east-1.amazonaws.com/assets/pets/dog.png',
    }

    const pets: PetOption[] = [
        {
            icon: petInfo?.type === 'cat' ? cat : dog,
            pet_type: petInfo?.type || 'cat',
        },
    ]

    return (
        <View style={styles.cbox}>
            <Pressable onPress={onPress}>
                <GenericIcon
                    Icon={{
                        uri: 'https://projeto-ludo-pets.s3.us-east-1.amazonaws.com/assets/pets/cat.png',
                    }}
                    size={100}
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
        bottom: Platform.OS === 'ios' ? height / 8.0 : height / 6,
        right: width / 11,
    },
})
