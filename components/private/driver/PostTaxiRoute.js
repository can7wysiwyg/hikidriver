import React, { useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { ApiUrl } from '../../../helpers/ApiUrl';


export default function PostTaxiRoute({navigation, route}) {
  const {data} = route.params
  const { token } = useSelector((state) => state.auth);
  const [routeName, setRouteName] = useState('');
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [fare, setFare] = useState('');
  const [startLocationCoords, setStartLocationCoords] = useState(null);
 const [endLocationCoords, setEndLocationCoords] = useState(null);
 const [startLocSuggestions, setStartLocSuggestions] = useState([]);
 const[endLocSuggestions, setEndLocSuggestions] = useState([]) 
 const [searchResults, setSearchResults] = useState([]); // To store search results
const [searchQuery, setSearchQuery] = useState(''); // For search bar input
const[areaname, setAreaName] = useState([])


  if(!data) {

    return ""
  }


  // search functionality

  const handleSearch = async (query, locationType) => {
    if (!query.trim()) {
      if (locationType === 'start') {
        setStartLocSuggestions([]);
      } else if (locationType === 'end') {
        setEndLocSuggestions([]);
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
      } else if (locationType === 'end') {
        setEndLocSuggestions(results);
      }
  
  
      setSearchResults(results);
      // setStartLocSuggestions(results, locationType || []);
      // setEndLocSuggestions(results, LocationType || [])
      handleSelectResult(results, locationType); // Select first result for now
    } catch (error) {
      console.log('Error fetching search results:', error);
      setSearchResults([]);
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
    // If the location is the end location
    else if (locationType === 'end') {
      setEndLocation(result.areaName);
      setEndLocationCoords({
        lat: result.lat,
        lon: result.lon,
      });
    }
    
    setSearchQuery(result.areaName); // Update search bar with selected location
    
    setSearchResults([]); 
  };
  

  
  // end search functionality


  
  // Function to handle form submission
  
  const handleSubmit = async () => {
    if (!routeName) {
      Alert.alert('Missing route name field');
      return;
    }
  
    if (!startLocation || !startLocationCoords) {
      Alert.alert('Missing start location');
      return;
    }
  
    if (!endLocation || !endLocationCoords) {
      Alert.alert('Missing end location');
      return;
    }
  
    if (!fare) {
      Alert.alert('Missing fare route');
      return;
    }
  
    // Prepare the item with the corrected structure
    const item = {
      taxiId: data,
      fare,
      routeName,
      startLocation: {
        placeName: startLocation,  // Correct field for location name
        coordinates: {
          type: 'Point',  // Correct type for geoJSON
          coordinates: [parseFloat(startLocationCoords.lon), parseFloat(startLocationCoords.lat)],  // Correct coordinates structure
        },
      },
      endLocation: {
        placeName: endLocation,  // Correct field for location name
        coordinates: {
          type: 'Point',  // Correct type for geoJSON
          coordinates: [parseFloat(endLocationCoords.lon), parseFloat(endLocationCoords.lat)],  // Correct coordinates structure
        },
      },
    };
  
    
  
    try {
       await axios.post(`${ApiUrl}/driver/routes`, item, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      navigation.goBack()
    } catch (error) {
      console.log('Error posting taxi route:', error.response ? error.response.data : error);
    }
  };
  
  

  return (
    <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
    <ScrollView
      contentContainerStyle={[styles.container, { flexGrow: 1 }]}
      keyboardShouldPersistTaps="handled">
      <Text style={styles.header}>Post Your Taxi/Bus Route</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Route Name</Text>
        <TextInput
          style={styles.input}
          value={routeName}
          onChangeText={setRouteName}
          placeholder="Enter the route name"
        />
      </View>
      
 
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

<View style={styles.formGroup}>
  <Text style={styles.label}>End Location</Text>
  <TextInput
    style={styles.input}
    value={endLocation}
    onChangeText={(text) => {
      setEndLocation(text);
      handleSearch(text, 'end');  // Trigger search for end location
    }}
    placeholder="Enter the destination"
  />
  {endLocSuggestions?.length > 0 && (
    <View style={styles.suggestionList}>
      {endLocSuggestions?.map((item, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => {
            handleSelectResult(item, 'end'); // Handle suggestion selection for end
            setEndLocSuggestions([]); // Clear suggestions after selection
          }}
        >
          <Text
            style={[
              styles.suggestionItem,
              index === endLocSuggestions?.length - 1 && styles.suggestionItemLast,
            ]}
          >
            {item.areaName}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  )}
</View>


      
       <View style={styles.formGroup}>
        <Text style={styles.label}>Fare (MWK)</Text>
        <TextInput
          style={styles.input}
          value={fare}
          onChangeText={setFare}
          placeholder="Enter the fare amount"
          keyboardType="numeric"
        />
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Icon name="send" size={20} color="#fff" />
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity> 


     





    </ScrollView>
  </KeyboardAvoidingView>
);
};



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


