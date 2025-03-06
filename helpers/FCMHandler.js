import React, { useEffect } from 'react';
import { Alert, Platform } from 'react-native';
import { getApp } from '@react-native-firebase/app';
import { getMessaging, getToken, onMessage, onNotificationOpenedApp, AuthorizationStatus } from '@react-native-firebase/messaging';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { ApiUrl } from './ApiUrl';

const FCMHandler = () => {
  // Access the user token from Redux state
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!token) {
      console.warn('User is not authenticated. Skipping FCM setup.');
      return;
    }

    const setupNotifications = async () => {
      try {
        // Get the Firebase app instance
        const app = getApp();
        const messagingInstance = getMessaging(app);
        
        // Request notification permission
        const authStatus = await messagingInstance.requestPermission();
        const enabled =
          authStatus === AuthorizationStatus.AUTHORIZED ||
          authStatus === AuthorizationStatus.PROVISIONAL;
        
        if (enabled) {
          console.log('Notification permission granted:', authStatus);
          
          // Get the FCM token
          const fcmToken = await getToken(messagingInstance);
          console.log('FCM Token:', fcmToken);
          
          // Determine the device platform
          const devicePlatform = Platform.OS;
          
          // Send token and platform to your backend
          await saveFCMToken(fcmToken, devicePlatform, token);
        } else {
          console.log('Notification permission denied');
        }
      } catch (error) {
        console.error('Error setting up notifications:', error);
      }
    };
    
    setupNotifications();

    // Get the Firebase app instance for listeners
    const app = getApp();
    const messagingInstance = getMessaging(app);

    // Foreground notification handler
    const unsubscribeForeground = onMessage(messagingInstance, async (remoteMessage) => {
      const notificationTitle = remoteMessage.notification?.title || 'Notification';
      const notificationBody = remoteMessage.notification?.body || 'You have a new message!';
    
      Alert.alert(
        notificationTitle,
        notificationBody,
        [{ text: 'OK', onPress: () => console.log('Alert dismissed') }]
      );
    });

    // Background notification handler
    const unsubscribeNotificationOpenedApp = onNotificationOpenedApp(messagingInstance,
      (remoteMessage) => {
        const notificationTitle = remoteMessage.notification?.title || 'Notification';
        const notificationBody = remoteMessage.notification?.body || 'You have a new message!';
      
        Alert.alert(
          notificationTitle,
          notificationBody,
          [{ text: 'OK', onPress: () => console.log('Alert dismissed') }]
        );
      }
    );

    // App was launched by tapping on a notification
    messagingInstance.setBackgroundMessageHandler(async (remoteMessage) => {
      const notificationTitle = remoteMessage.notification?.title || 'Notification';
      const notificationBody = remoteMessage.notification?.body || 'You have a new message!';
    
      Alert.alert(
        notificationTitle,
        notificationBody,
        [{ text: 'OK', onPress: () => console.log('Alert dismissed') }]
      );
    });

    // Cleanup listeners on unmount
    return () => {
      unsubscribeForeground();
      unsubscribeNotificationOpenedApp();
    };
  }, [token]);

  // Function to send the FCM token and device platform to the backend
  const saveFCMToken = async (fcmToken, devicePlatform, token) => {
    try {
      await axios.post(
        `${ApiUrl}/update-fcm-token`,
        {
          fcmToken,
          devicePlatform,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('FCM token saved successfully');
    } catch (error) {
      console.error('Error saving FCM token to backend:', error);
    }
  };

  return null; // This component doesn't render anything
};

export default FCMHandler;