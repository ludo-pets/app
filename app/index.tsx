import { Image, View, StyleSheet, Pressable, Text } from 'react-native'
import { router } from 'expo-router'
import GoogleSigninButton from '@/components/GoogleSigninComponent'
import * as WebBrowser from 'expo-web-browser'

const route = () => {
    router.replace('/(tabs)/home')
}

WebBrowser.maybeCompleteAuthSession()

export default function RegisterPetPage() {
    return (
        <View style={styles.containerBox}>
            <View style={styles.mainContent}>
                <Image
                    style={styles.image}
                    source={require('@/assets/images/ludopets.png')}
                />
                <View style={styles.buttons}>
                    <GoogleSigninButton />
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
    image: {
        width: 256,
        height: 256,
        borderRadius: 200,
        // iOS shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        // Android shadow
        elevation: 80,
    },
})
