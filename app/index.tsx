import { Image, View, StyleSheet, Pressable, Text } from 'react-native'
import { FormRegisterPet } from '../components/FormRegisterPet'
import { router, useRouter } from 'expo-router'
import GoogleSigninButton from '@/components/GoogleSigninComponent'
import * as WebBrowser from 'expo-web-browser'

const route = () => {
    router.replace('/(tabs)/home')
}

export default function RegisterPetPage() {
    WebBrowser.maybeCompleteAuthSession()

    return (
        <View style={styles.containerBox}>
            <View style={styles.mainContent}>
                <Image source={require('@/assets/images/logo.png')} />
                <View style={styles.buttons}>
                    <GoogleSigninButton />
                    <Pressable onPress={route}>
                        <Text>Permanecer Desconectado</Text>
                    </Pressable>
                </View>
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
        backgroundColor: '#FEFEFE',
    },
    link: {
        fontSize: 16,
        fontWeight: '300',
        color: '#5B5B5B',
        textDecorationLine: 'underline',
    },
    mainContent: {
        height: '100%',
        width: '100%',
        maxHeight: 650,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    buttons: {
        alignItems: 'center',
        gap: 10,
    },
})
