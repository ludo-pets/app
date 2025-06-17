import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

type NeedType = 'hunger' | 'thirst' | 'sleep' | 'clean' | 'fun';

const needsConfig = {
  hunger: {
    type: 'comida',
    maxTime: 216000, // em segundos (60 horas)
    notificationTitle: '🍽️ Seu pet está com fome!',
    notificationBody: 'Seu pet precisa ser alimentado.'
  },
  thirst: {
    type: 'água',
    maxTime: 216000, // em segundos (60 horas)
    notificationTitle: '💧 Seu pet está com sede!',
    notificationBody: 'Seu pet precisa beber água.'
  },
  sleep: {
    type: 'sono',
    maxTime: 216000, // em segundos (60 horas)
    notificationTitle: '😴 Seu pet está com sono!',
    notificationBody: 'Seu pet precisa descansar.'
  },
  clean: {
    type: 'limpeza',
    maxTime: 432000, // em segundos (120 horas)
    notificationTitle: '🧼 Seu pet está incomodado!',
    notificationBody: 'Limpe o banheiro do seu pet, para que ele siga feliz e saudável.'
  },
  fun: {
    type: 'brincadeira',
    maxTime: 43200, // em segundos (12 horas)
    notificationTitle: '🎮 Seu pet quer brincar!',
    notificationBody: 'Seu pet está entediado e quer brincar.'
  }
};

/**
 * Agenda uma notificação para ser enviada após o tempo máximo da necessidade
 * @param needType Tipo de necessidade do pet
 * @param hoursFromNow Número de horas para agendar a notificação (se não especificado, usa o tempo máximo da necessidade)
 * @param customTitle Título personalizado para a notificação
 * @param customBody Corpo personalizado para a notificação
 */
export const scheduleNeedNotification = async (
  needType: NeedType, 
  hoursFromNow?: number,
  customTitle?: string,
  customBody?: string
) => {
  if (Platform.OS === 'android' && !Device.isDevice) {
    console.log(`[Notificação Agendada Simulada]: ${customTitle || needsConfig[needType].notificationTitle}`);
    return;
  }

  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') return;

  // Calcula o tempo em segundos para a notificação
  const seconds = hoursFromNow 
    ? hoursFromNow * 3600 
    : needsConfig[needType].maxTime;

  // Agenda a notificação
  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title: customTitle || needsConfig[needType].notificationTitle,
      body: customBody || needsConfig[needType].notificationBody,
      data: { needType, url: '/pet-care' },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds,
    },
  });

  console.log(`Notificação agendada para ${needType} em ${seconds / 3600} horas (ID: ${notificationId})`);
  return notificationId;
};

/**
 * Cancela todas as notificações agendadas para uma necessidade específica
 * @param needType Tipo de necessidade do pet
 */
export const cancelNeedNotifications = async (needType?: NeedType) => {
  if (needType) {
    // Pega todas as notificações agendadas
    const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
    
    // Filtra as notificações pelo tipo de necessidade
    const notificationsToCancel = scheduledNotifications.filter(notification => 
      notification.content.data?.needType === needType
    );
    
    // Cancela cada notificação
    for (const notification of notificationsToCancel) {
      await Notifications.cancelScheduledNotificationAsync(notification.identifier);
    }
  } else {
    // Cancela todas as notificações se nenhum tipo for especificado
    await Notifications.cancelAllScheduledNotificationsAsync();
  }
};
