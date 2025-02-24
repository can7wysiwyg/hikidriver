import React, { useEffect } from 'react';
import { Alert, Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';
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

    // Request notification permission for iOS
    messaging()
      .requestPermission()
      .then((authStatus) => {
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;
        if (enabled) {
          console.log('Notification permission granted:', authStatus);
        }
      });

    // Get the FCM token for push notifications
    messaging()
      .getToken()
      .then((fcmToken) => {
        
        // Determine the device platform
        const devicePlatform = Platform.OS; // 'ios', 'android', or 'web'

        // Send token and platform to your backend
        saveFCMToken(fcmToken, devicePlatform, token);
      })
      .catch((error) => {
        console.log('Error getting FCM token:', error);
      });

    // Foreground notification handler
    const unsubscribeForeground = messaging().onMessage(async (remoteMessage) => {
      
      // Get the title which contains the user object
      const notificationTitle =   remoteMessage.notification?.title || 'Notification'
      const notificationBody = remoteMessage.notification?.body || 'You have a new message!';
    
      Alert.alert(
        notificationTitle, // Title
        `${notificationBody}`, // Message
        [{ text: 'OK', onPress: () => console.log('Alert dismissed') }] // Alert button
      );
    

    });

    // Background notification handler
    const unsubscribeNotificationOpenedApp = messaging().onNotificationOpenedApp(
      (remoteMessage) => {
        // console.log('Notification caused app to open from background:', remoteMessage);
        // Alert.alert('App opened from background', JSON.stringify(remoteMessage));

        const notificationTitle =   remoteMessage.notification?.title || 'Notification'
        const notificationBody = remoteMessage.notification?.body || 'You have a new message!';
      
        Alert.alert(
          notificationTitle, // Title
          `${notificationBody}`, // Message
          [{ text: 'OK', onPress: () => console.log('Alert dismissed') }] // Alert button
        );
  
      }
    );

    // App was launched by tapping on a notification
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      const notificationTitle =   remoteMessage.notification?.title || 'Notification'
      const notificationBody = remoteMessage.notification?.body || 'You have a new message!';
    
      Alert.alert(
        notificationTitle, // Title
        `${notificationBody}`, // Message
        [{ text: 'OK', onPress: () => console.log('Alert dismissed') }] // Alert button
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
        `${ApiUrl}/update-fcm-token`, // Replace with your actual backend API URL
        {
          fcmToken,
          devicePlatform,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Use the token from Redux
          },
        }
      );
      console.log('FCM token saved successfully:');
    } catch (error) {
      console.error('Error saving FCM token to backend:', error);
    }
  };

  return null; // This component doesn't render anything
};

export default FCMHandler;
