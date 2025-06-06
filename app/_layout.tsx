import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

type PetNeeds = {
  lastFed: number;
  lastDrank: number;
  lastSlept: number;
  lastCleaned: number;
  lastPlayed: number;
};

export default function RootLayout() {
  useEffect(() => {
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    startPetMonitoring();
  }, []);

  const startPetMonitoring = async () => {
    const interval = setInterval(async () => {
      const petNeeds = await loadPetData();
      if (petNeeds) {
        await checkPetNeedsAndNotify(petNeeds);
      }
    }, 60000); // Verifica a cada 1 minuto

    return () => clearInterval(interval);
  };

  const loadPetData = async (): Promise<PetNeeds | null> => {
    try {
      const savedData = await AsyncStorage.getItem('petNeeds');
      return savedData ? JSON.parse(savedData) : null;
    } catch (error) {
      console.error('Erro ao carregar dados do pet:', error);
      return null;
    }
  };
  const checkPetNeedsAndNotify = async (petNeeds: PetNeeds) => {
    const nowInSeconds = Math.floor(Date.now() / 1000);
    const needsConfig = [
      { type: 'comida', lastTime: petNeeds.lastFed, maxTime: 216000 },
      { type: 'água', lastTime: petNeeds.lastDrank, maxTime: 216000 },
      { type: 'sono', lastTime: petNeeds.lastSlept, maxTime: 216000 },
      { type: 'limpeza', lastTime: petNeeds.lastCleaned, maxTime: 432000 },
      { type: 'brincadeira', lastTime: petNeeds.lastPlayed, maxTime: 43200 },
    ];

    for (const need of needsConfig) {
      const timeSinceLast = nowInSeconds - need.lastTime;
      if (timeSinceLast > need.maxTime) {
        await sendNotification(
          `🐾 Seu pet precisa de ${need.type}!`,
          `Está há ${Math.floor(timeSinceLast / 3600)} horas sem ${need.type}.`
        );
      }
    }
  };

  const sendNotification = async (title: string, body: string) => {
    if (Platform.OS === 'android' && !Device.isDevice) {
      console.log(`[Notificação Simulada]: ${title} - ${body}`);
      return;
    }

    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') return;

    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: { url: '/pet-care' },
      },
      trigger: {
                  type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
                  seconds: 2,
              },
    });
  };

  return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fefefe' }}>
            <Stack>
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="quizSummary" options={{ headerShown: false }} />
                <Stack.Screen
                    name="quizGame"
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
        </SafeAreaView>
    )
}
