import React, { useEffect } from 'react';
import 'react-native-gesture-handler';
import { StatusBar } from 'react-native'; // Added Platform to detect device platform
import { SafeAreaView } from 'react-native';
import { Provider } from 'react-redux';
import AppNavigator from './components/AppNavigator'; // Ensure the path is correct
import store from './redux/store';
import AuthProvider from './redux/slices/AuthProvider';
import { enableScreens } from 'react-native-screens';
import { SafeAreaProvider } from 'react-native-safe-area-context';



// Enable screens
enableScreens();




export default function App() {

 
 
  return (
    <Provider store={store}>
            <SafeAreaProvider>
            <StatusBar style="auto" />

      {/* <SafeAreaView style={{ flex: 1 }}> */}
          <AuthProvider>  
        <AppNavigator />
          </AuthProvider>  
        <StatusBar style="auto" />
      {/* </SafeAreaView> */}
      </SafeAreaProvider>

    </Provider>
  );
}

