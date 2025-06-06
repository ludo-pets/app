import {
    Image,
    View,
    StyleSheet,
    Pressable,
    Text,
    Platform,
} from 'react-native'
import { FormRegisterPet } from '../components/FormRegisterPet'
import { useRouter } from 'expo-router'
import * as Notifications from 'expo-notifications'
import { useEffect } from 'react'
import * as Device from 'expo-device'

export default function RegisterPetPage() {
    const router = useRouter()

    // Configuração do canal de notificação para Android, apagar depois
    useEffect(() => {
        if (Platform.OS === 'android') {
            Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.HIGH,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            })
        }
    }, [])

    // Função para enviar notificações, apagar depois
    async function schedulePushNotification() {
        if (Platform.OS === 'android' && !Device.isDevice) {
          alert('Notificação simulada no emulador - veja a aba "Logcat"');
          console.log("Notificação seria exibida em um dispositivo real");
          return;
        }
      
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== 'granted') {
          alert('Permissão para notificações não concedida!');
          return;
        }
      
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Teste de Notificação",
            body: 'Esta é uma notificação de teste!',
            data: { url: '/some-route' },
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds: 2,
        },
        });
      }

    return (
        <View style={styles.containerBox}>
            <View style={styles.mainContent}>
                <Image source={require('@/assets/images/logo.png')} />
                <FormRegisterPet />
                {/* usando esse para testar as notificações sem precisar esperar/ter pet/etc (apagar depois) */}
                {/* <Pressable
                    onPress={async () => {
                        await schedulePushNotification()
                    }}
                >
                    <Text>Teste Notificação</Text>
                </Pressable> */}
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
