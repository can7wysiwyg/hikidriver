import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { app } from './firebase';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

// Function to request permissions and set up notifications
export async function registerForPushNotificationsAsync() {
  if (!Device.isDevice) {
    console.log("Must use physical device for Push Notifications");
    return;
  }

  // First check if Firebase is initialized
  if (!app) {
    console.log("Firebase not initialized. Please ensure firebase.initializeApp() is called first.");
    return;
  }

  // For Expo notifications
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log("Failed to get push token for push notification!");
    return;
  }

  // Use Firebase messaging token for production app
  let token;
  try {
    // Get Firebase Cloud Messaging token
    token = await messaging().getToken();
    console.log("Firebase Cloud Messaging Token:", token);
  } catch (error) {
    console.error("Error getting FCM token:", error);
    
    // Fall back to Expo push token if FCM fails
    const expoPushToken = await Notifications.getExpoPushTokenAsync();
    token = expoPushToken.data;
    console.log("Falling back to Expo Push Token:", token);
  }

  return token;
}

// For Android: Configure notification channel
if (Platform.OS === 'android') {
  Notifications.setNotificationChannelAsync('default', {
    name: 'Default',
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#FF231F7C',
  });
}

// Handle incoming notifications
export function setupNotificationListeners(onNotificationReceived) {
  // For Expo notifications
  const subscription = Notifications.addNotificationReceivedListener(notification => {
    if (onNotificationReceived) {
      onNotificationReceived(notification);
    }
  });

  // For Firebase notifications when app is in foreground
  const unsubscribeForeground = messaging().onMessage(async remoteMessage => {
    if (onNotificationReceived) {
      onNotificationReceived({
        request: {
          content: {
            title: remoteMessage.notification?.title,
            body: remoteMessage.notification?.body,
            data: remoteMessage.data
          }
        }
      });
    }
  });

  return () => {
    subscription.remove();
    unsubscribeForeground();
  };
}