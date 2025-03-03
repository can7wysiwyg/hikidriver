import React, { useState } from 'react';
import { Text, View, TextInput, ActivityIndicator, TouchableOpacity, StyleSheet, ScrollView, Alert, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { ApiUrl } from '../../../helpers/ApiUrl';



export default function RouteStartLocation({route, navigation}) {
    const {data} = route.params
  const { token } = useSelector((state) => state.auth);
  const [startLocation, setStartLocation] = useState('');
  const [startLocationCoords, setStartLocationCoords] = useState(null);
  const [startLocSuggestions, setStartLocSuggestions] = useState([]);
   const [loading, setLoading] = useState(false); // State to handle the loader
  

  if(!data) {

    return ""
  }



  const handleSearch = async (query, locationType) => {
    if (!query.trim()) {
      if (locationType === 'start') {
        setStartLocSuggestions([]);
      } 
      return;
  

      
    }
  
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json`
      );
      const data = await response.json();
  
      const results = data.map((item) => ({
        areaName: item.display_name,
        lat: item.lat,
        lon: item.lon,
      }));

      if (locationType === 'start') {
        setStartLocSuggestions(results);
      } 
  
  
      
      handleSelectResult(results, locationType); // Select first result for now
    } catch (error) {
      console.log('Error fetching search results:', error);
      
    }
  };
  


  const handleSelectResult = (result, locationType) => {
    // Check if result is valid and contains the necessary properties
    if (!result || !result.areaName || !result.lat || !result.lon) {
    
      return;
    }
  
    // If the location is the start location
    if (locationType === 'start') {
      setStartLocation(result.areaName);
      setStartLocationCoords({
        lat: result.lat,
        lon: result.lon,
      });
    } 
    
     
  };
  

  
  // end search functionality


  const handleSubmit = async () => {
      
      if (!startLocation || !startLocationCoords) {
        Alert.alert('Missing start location');
        return;
      }


      const item = {
                startLocation: {
          placeName: startLocation,  // Correct field for location name
          coordinates: {
            type: 'Point',  // Correct type for geoJSON
            coordinates: [parseFloat(startLocationCoords.lon), parseFloat(startLocationCoords.lat)],  // Correct coordinates structure
          },
        
        
        },
      };
    

      setLoading(true); // Start the loader
    try {
       await axios.put(
        `${ApiUrl}/driver_route_update/${data}`,
        item,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      
      Alert.alert('Success', 'updated successfully');
      navigation.goBack()
    } catch (error) {
      console.log(
        'Error posting taxi route:',
    
      );
      Alert.alert(
        'Error',
         'Failed to update route name'
      );
    } finally {
      setLoading(false); // Stop the loader
    }



    }
    



  return (
    <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={[styles.container, { flexGrow: 1 }]}
          keyboardShouldPersistTaps="handled">
          <Text style={styles.header}>Update Your Taxi Starting Location  </Text>


          <View style={styles.formGroup}>
            <Text style={styles.label}>Start Location</Text>
            <TextInput
              style={styles.input}
              value={startLocation}
              onChangeText={(text) => {
                setStartLocation(text);
                handleSearch(text, 'start');  // Trigger search for start location
              }}
              placeholder="Enter the starting location"
            />
            {startLocSuggestions?.length > 0 && (
              <View style={styles.suggestionList}>
                {startLocSuggestions?.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      handleSelectResult(item, 'start'); // Handle suggestion selection for start
                      setStartLocSuggestions([]); // Clear suggestions after selection
                    }}
                  >
                    <Text
                      style={[
                        styles.suggestionItem,
                        index === startLocSuggestions?.length - 1 && styles.suggestionItemLast,
                      ]}
                    >
                      {item.areaName}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>



          <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleSubmit}
                    disabled={loading} // Disable the button while loading
                  >
                    {loading ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Icon name="send" size={20} color="#fff" />
                    )}
                    <Text style={styles.submitButtonText}>
                      {loading ? 'Submitting...' : 'Submit'}
                    </Text>
                  </TouchableOpacity>


          </ScrollView>
          </KeyboardAvoidingView>
    
  )
}




const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      padding: 20,
      backgroundColor: '#f9f9f9',
    },
    header: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#333',
      textAlign: 'center',
      marginBottom: 30,
    },
    formGroup: {
      marginBottom: 20,
    },
    label: {
      fontSize: 16,
      fontWeight: '600',
      color: '#555',
      marginBottom: 8,
    },
    input: {
      backgroundColor: '#fff',
      padding: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#ddd',
      fontSize: 16,
      color: '#333',
    },
    suggestionList: {
      marginTop: 8, // Add spacing below the input box
      backgroundColor: '#fff', // White background for better contrast
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 8,
      maxHeight: 150, // Limit height to prevent overflow
      overflow: 'hidden', // Clip suggestions if they exceed the container
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2, // For Android
    
    },
    suggestionItem: {
      padding: 12,
      fontSize: 16,
      color: '#333',
      borderBottomWidth: 1,
      borderBottomColor: '#eee', // Light border for item separation
    },
    suggestionItemLast: {
      borderBottomWidth: 0, // Remove bottom border for the last item
    },
    submitButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#3399ff',
      paddingVertical: 12,
      borderRadius: 8,
      marginTop: 20,
      justifyContent: 'center',
    },
    submitButtonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
      marginLeft: 10,
    },
  });
  
  
  