import { Pressable, StyleSheet, View, Image } from 'react-native'

interface PetOptionFormRegisterPetProps {
    Icon: { uri: string }
    onSelect?: VoidFunction
    selected: boolean
    color: string
    onlyPet?: boolean
}

export function PetOptionFormRegisterPet({
    Icon,
    onSelect,
    selected,
    color,
    onlyPet = true,
}: PetOptionFormRegisterPetProps) {
    return (
        <Pressable
            style={[
                onlyPet ? styles.petBox : styles.petBoxProfile,
                selected && styles.petBoxActive,
            ]}
            onPress={onSelect}
        >
            <View style={styles.imageContainer}>
                <Image
                    source={Icon}
                    style={{ width: '100%', height: '100%' }}
                    resizeMode="contain"
                />
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    petBox: {
        width: '40%',
        aspectRatio: 1,
        backgroundColor: '#B6E683',
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 10,
        padding: 5,
    },
    petBoxProfile: {
        width: '50%',
        aspectRatio: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    petBoxActive: {
        borderWidth: 5,
        borderColor: '#80BEE7',
        borderStyle: 'solid',
        padding: 0,
    },
    imageContainer: {
        width: '90%',
        aspectRatio: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
})
