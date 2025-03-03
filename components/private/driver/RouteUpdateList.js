import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';

export default function RouteUpdateList({ navigation, route }) {
  const {data} = route.params
  const [scale] = useState(new Animated.Value(1));


  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 1.1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <View style={styles.container}>

    
      <Animated.View style={[styles.buttonContainer, { transform: [{ scale }] }]}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#FF9800' }]}
          onPress={() => { handlePress(); navigation.navigate('RouteName', {data: data}); }}
        >
        
          <Text style={styles.buttonText}>Update Route Name</Text>
        </TouchableOpacity>
      </Animated.View>

    
      <Animated.View style={[styles.buttonContainer, { transform: [{ scale }] }]}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#9C27B0' }]}
          onPress={() => { handlePress(); navigation.navigate('RoutePrice', {data: data}); }}
        >
          
          <Text style={styles.buttonText}>Update Route Price</Text>
        </TouchableOpacity>
      </Animated.View>

    
      <Animated.View style={[styles.buttonContainer, { transform: [{ scale }] }]}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#2196F3' }]}
          onPress={() => { handlePress(); navigation.navigate('RouteStartLocation', {data: data}); }}
        >
        
          <Text style={styles.buttonText}>Update Your Start Location</Text>
        </TouchableOpacity>
      </Animated.View>


      <Animated.View style={[styles.buttonContainer, { transform: [{ scale }] }]}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#FF6F61' }]}
          onPress={() => { handlePress(); navigation.navigate('RouteEndLocation', {data: data}); }}
        >
          
          <Text style={styles.buttonText}>Update Your Route Ending Location</Text>
        </TouchableOpacity>
      </Animated.View>

      
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  buttonContainer: {
    marginBottom: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    width: '100%',
    maxWidth: 300,
    elevation: 5,  // Shadow for Android
    shadowColor: '#000',  // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#fff',
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
