import {
    Image,
    View,
    StyleSheet,
    Pressable,
    Text,
    Platform,
    StatusBar,
    TouchableOpacity,
} from 'react-native'
import { FormRegisterPet } from '../components/FormRegisterPet'
import { useRouter } from 'expo-router'

export default function RegisterPetPage() {
    const router = useRouter()

    return (
        <View style={styles.containerBox}>
            <View style={styles.mainContent}>
                <Image source={require('@/assets/images/logo.png')} />
                <FormRegisterPet />
                <Pressable
                    onPress={() => {
                        router.push('/home')
                    }}
                >
                    <Text style={styles.link}>Já tenho um pet</Text>
                </Pressable>
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
})
