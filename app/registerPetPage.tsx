import { Image, View, StyleSheet } from 'react-native'
import { FormRegisterPet } from '../components/FormRegisterPet'

export default function registerPetPage() {
    return (
        <View style={styles.containerBox}>
            <View style={styles.mainContent}>
                <Image source={require('../assets/images/logo.png')} />
                <FormRegisterPet />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    containerBox: {
        flex: 1,
        paddingHorizontal: 17,
        paddingVertical: 20,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },

    mainContent: {
        height: '100%',
        width: '100%',
        maxHeight: 650,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
})
