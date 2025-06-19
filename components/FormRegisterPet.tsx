import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Pressable,
    Alert,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
} from 'react-native'
import { PetOptionFormRegisterPet } from './PetOptionFormRegisterPet'
import { useState } from 'react'
import Gato from '@/assets/images/pets/gato.svg'
import Cachorro from '@/assets/images/pets/cachorro.svg'
import { SvgProps } from 'react-native-svg'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useUserPetStore } from '@/stores/userPetStore'
import { addPet } from '@/services/petService'
import { createUser, getUserWithPetByEmail } from '@/services/userService'
import { updateUser } from '@/services/userService'

export type PetOption = {
    id?: number
    icon: React.FC<SvgProps>
    pet_type: 'cat' | 'dog'
}

type ColorOption = {
    id: number
    color: string
}

export const petsTypes: PetOption[] = [
    {
        id: 1,
        icon: Gato,
        pet_type: 'cat',
    },
    {
        id: 2,
        icon: Cachorro,
        pet_type: 'dog',
    },
]

export const colorsOptions: ColorOption[] = [
    { id: 1, color: '#7D5D56' },
    { id: 2, color: '#BEBEBE' },
    { id: 3, color: '#F4EDE1' },
    { id: 4, color: '#FFD997' },
]

type FormRegisterPetRouteParams = {
    userId: string
    email: string
}

export function FormRegisterPet() {
    const route = useRoute()
    const { userId, email } = (route.params as FormRegisterPetRouteParams) || {}
    const navigation = useNavigation()

    const [selectedPet, setSelectedPet] = useState<PetOption>(petsTypes[0])
    const [selectedColorPet, setSelectedColorPet] = useState<ColorOption>(
        colorsOptions[0]
    )
    const [petName, setPetName] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(false)

    // Make the handler async to use await
    async function handlerSubmitForm() {
        if (!petName.trim()) {
            Alert.alert(
                'Oops!',
                'Parece que você esqueceu de preencher alguma informação. Confira todos os campos.',
                [{ text: 'OK' }]
            )
            return
        }
        setIsLoading(true)

        const petDataToCreate = {
            name: petName.trim(),
            color: selectedColorPet.color,
            type: selectedPet.pet_type,
        }

        const newPet = await addPet({
            name: petName.trim(),
            color: selectedColorPet.color,
            type: selectedPet.pet_type,
        })

        if (!newPet) {
            console.error('Failed to create pet.')
            setIsLoading(false)
            return
        }

        let user = await getUserWithPetByEmail(email)
        if (!user) {
            user = await createUser({
                id: userId,
                email: email,
                newPetId: newPet.id,
            })
            await updateUser(user.id, { pet: newPet.id })
        }

        if (user) {
            await useUserPetStore
            .getState()
            .fetchUserAndPetByEmail(email)
    }

    navigation.navigate('(tabs)' as never)
    }

    function handlerChangePetName(newName: string) {
        const newNameFormated = newName.replace(/[^a-zA-Z\s]/g, '')
        setPetName(newNameFormated)
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.formBox}
        >
            {/* Pet Type Selection */}
            <View style={styles.optionBox}>
                {petsTypes.map((pet) => (
                    <PetOptionFormRegisterPet
                        key={pet.id}
                        Icon={pet.icon}
                        selected={pet.id === selectedPet?.id}
                        onSelect={() => setSelectedPet(pet)}
                        color={selectedColorPet?.color || '#FFD997'}
                    />
                ))}
            </View>

            {/* Pet Name Input */}
            <TextInput
                style={[styles.inputBox, isLoading && styles.disabledInput]}
                placeholder="Escolha um nome ..."
                placeholderTextColor={'#79747E'}
                onChangeText={handlerChangePetName}
                value={petName}
                editable={!isLoading}
            />

            <View style={styles.colorOptionBox}>
                {colorsOptions.map((color) => {
                    const colorSelected = color.id === selectedColorPet?.id
                    return (
                        <Pressable
                            key={color.id}
                            style={[
                                { backgroundColor: color.color },
                                styles.colorOption,
                                colorSelected && styles.colorOptionActive,
                                isLoading && styles.disabledInput,
                            ]}
                            onPress={() => {
                                if (!isLoading) {
                                    setSelectedColorPet(color)
                                }
                            }}
                            disabled={isLoading}
                        />
                    )
                })}
            </View>

            <TouchableOpacity
                onPress={handlerSubmitForm}
                style={[
                    styles.submitButtom,
                    isLoading && styles.submitButtonDisabled,
                ]}
                disabled={isLoading}
            >
                {isLoading ? (
                    <ActivityIndicator size="small" color="#FFF" />
                ) : (
                    <Text style={styles.submitButtonText}>Avançar</Text> 
                )}
            </TouchableOpacity>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    formBox: {
        paddingHorizontal: 25,
        paddingVertical: 19,
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        maxWidth: 400,
    },
    optionBox: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '100%',
        marginBottom: 20,
    },
    inputBox: {
        width: '100%',
        paddingHorizontal: 16,
        paddingVertical: 8,
        height: 40,
        borderWidth: 1,
        borderColor: '#D9D0E3',
        borderRadius: 8,
        borderStyle: 'solid',
        marginBottom: 20,
        backgroundColor: '#FFF',
    },
    colorOptionBox: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 15,
        marginBottom: 30,
    },
    colorOption: {
        width: 32,
        height: 32,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        borderRadius: 5,
        elevation: 5,
    },
    colorOptionActive: {
        borderWidth: 3,
        borderColor: '#80BEE7',
        borderStyle: 'solid',
    },
    submitButtom: {
        paddingHorizontal: 24,
        paddingVertical: 10,
        minWidth: 113,
        height: 48,
        backgroundColor: '#FFAFD4',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        elevation: 3,
    },
    submitButtonText: {
        fontWeight: 'bold',
        lineHeight: 24,
        fontSize: 16,
        color: '#FFF',
    },
    disabledInput: {
        opacity: 0.6,
        backgroundColor: '#E0E0E0',
    },
    submitButtonDisabled: {
        backgroundColor: '#E0A0C0',
        opacity: 0.7,
    },
})
