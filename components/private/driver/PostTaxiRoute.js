import React, { useState, useEffect } from 'react';
import { Text, View, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { ApiUrl } from '../../../helpers/ApiUrl';
import { Picker } from '@react-native-picker/picker';
import { DistrictsUrl } from '../../../helpers/DistrictsUrl';


export default function PostTaxiRoute({navigation, route}) {
  const {data} = route.params;
  const { token } = useSelector((state) => state.auth);
  
  // State variables
  const [showRouteTypeModal, setShowRouteTypeModal] = useState(true);
  const [isLongDistance, setIsLongDistance] = useState(null);
  const [routeName, setRouteName] = useState('');
  const [destinationArea, setDestinationArea] = useState('');
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [fare, setFare] = useState('');
  const [startLocationCoords, setStartLocationCoords] = useState(null);
  const [endLocationCoords, setEndLocationCoords] = useState(null);
  const [startLocSuggestions, setStartLocSuggestions] = useState([]);
  const [endLocSuggestions, setEndLocSuggestions] = useState([]);
  const[districts, setDistricts] = useState([])



useEffect(() => {
fetchDistricts()

}, [])



  const fetchDistricts = async() => {

    try {

      const response = await axios.get(`${DistrictsUrl}/api/districts_all`)

      console.log(response.data.districts)

      setDistricts(response.data.districts[0].districts)
      
    } catch (error) {
      console.log("Error fetching districts", error)
    }

  }


  
  if(!data) {
    return null;
  }

  // Modal for selecting route type
  const RouteTypeModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showRouteTypeModal}
      onRequestClose={() => setShowRouteTypeModal(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Route Type</Text>
          <Text style={styles.modalDescription}>
            Will this taxi operate outside the district or only locally?
          </Text>
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.localButton]}
              onPress={() => {
                setIsLongDistance(false);
                setShowRouteTypeModal(false);
              }}
            >
              <Text style={styles.buttonText}>Local Route</Text>
              <Text style={styles.buttonSubtext}>Within district operations</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.modalButton, styles.longDistanceButton]}
              onPress={() => {
                setIsLongDistance(true);
                setShowRouteTypeModal(false);
              }}
            >
              <Text style={styles.buttonText}>Long Distance</Text>
              <Text style={styles.buttonSubtext}>Outside district operations</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  // Search functionality
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
    } catch (error) {
      console.log('Error fetching search results:', error);
    }
  };
  
  const handleSelectResult = (result, locationType) => {
    if (!result || !result.areaName || !result.lat || !result.lon) {
      return;
    }
  
    if (locationType === 'start') {
      setStartLocation(result.areaName);
      setStartLocationCoords({
        lat: result.lat,
        lon: result.lon,
      });
      setStartLocSuggestions([]);
    } 
    else if (locationType === 'end') {
      setEndLocation(result.areaName);
      setEndLocationCoords({
        lat: result.lat,
        lon: result.lon,
      });
      setEndLocSuggestions([]);
    }
  };
  
  
  // Form submission handler
const handleSubmit = async () => {
  // Validate common fields
  
  
  if (!fare) {
    Alert.alert('Missing fare amount');
    return;
  }
  
  let item = {
    taxiId: data,
    routeName,
    fare: parseFloat(fare),
    isLongDistance
  };
  
  // Validate and add fields based on route type
  if (isLongDistance) {
    // Long distance route requires destination area
    if (!destinationArea) {
      Alert.alert('Missing destination area');
      return;
    }
    
    // Add long distance specific fields
    item = {
      taxiId: data,
      fare: parseFloat(fare),
      destinationArea,
      isLongDistance
    };
  } else {
    // Local route requires specific locations with coordinates
    if (!startLocation || !startLocationCoords) {
      Alert.alert('Missing start location');
      return;
    }
  
    if (!endLocation || !endLocationCoords) {
      Alert.alert('Missing end location');
      return;
    }
    
    // Add local route specific fields
    item = { 
      ...item,
      startLocation: {
        placeName: startLocation,
        coordinates: {
          type: 'Point',
          coordinates: [parseFloat(startLocationCoords.lon), parseFloat(startLocationCoords.lat)],
        },
      },
      endLocation: {
        placeName: endLocation,
        coordinates: {
          type: 'Point',
          coordinates: [parseFloat(endLocationCoords.lon), parseFloat(endLocationCoords.lat)],
        },
      },
    };
  }

  try {
    await axios.post(`${ApiUrl}/driver/routes`, item, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    Alert.alert('Success', 'Route created successfully!', [
      { text: 'OK', onPress: () => navigation.goBack() }
    ]);
  } catch (error) {
    console.log('Error posting taxi route:', error.response ? error.response.data : error);
    Alert.alert('Error', error.response?.data?.message || 'Failed to create route');
  }
};



  // Render the form based on route type selected
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Route Type Selection Modal */}
      <RouteTypeModal />
      
      {isLongDistance !== null && (
  <ScrollView
    contentContainerStyle={[styles.container, { flexGrow: 1 }]}
    keyboardShouldPersistTaps="handled"
  >
    <View style={styles.routeTypeIndicator}>
      <Text style={styles.routeTypeText}>
        {isLongDistance ? 'Long Distance Route' : 'Local Route'}
      </Text>
      <TouchableOpacity 
        style={styles.changeButton}
        onPress={() => setShowRouteTypeModal(true)}
      >
        <Text style={styles.changeButtonText}>Change</Text>
      </TouchableOpacity>
    </View>

    <Text style={styles.header}>Post Your Taxi/Bus Route</Text>

    
    {isLongDistance ? (
      // LONG DISTANCE FIELDS - Only destination area
      <View style={styles.formGroup}>
        <Text style={styles.label}>Destination Area</Text>
        
        <Picker
         selectedValue={destinationArea}
         style={styles.input}
         onValueChange={(itemValue) => setDestinationArea(itemValue)}
        >

          {
            districts?.map((item) => (
              <Picker.Item label={item.districtName} value={item.districtName} key={item._id} />
            ))
          }


        </Picker>


      </View>
    ) : (
      // LOCAL ROUTE FIELDS - Start and end location with search
      <>

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
              handleSearch(text, 'start');
            }}
            placeholder="Enter the starting location"
          />
          {startLocSuggestions.length > 0 && (
            <View style={styles.suggestionList}>
              {startLocSuggestions.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleSelectResult(item, 'start')}
                >
                  <Text
                    style={[
                      styles.suggestionItem,
                      index === startLocSuggestions.length - 1 && styles.suggestionItemLast,
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
              handleSearch(text, 'end');
            }}
            placeholder="Enter the destination"
          />
          {endLocSuggestions.length > 0 && (
            <View style={styles.suggestionList}>
              {endLocSuggestions.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleSelectResult(item, 'end')}
                >
                  <Text
                    style={[
                      styles.suggestionItem,
                      index === endLocSuggestions.length - 1 && styles.suggestionItemLast,
                    ]}
                  >
                    {item.areaName}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </>
    )}
    
    {/* Fare field for both route types */}
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
)}
    </KeyboardAvoidingView>
  );
}

// Add these new styles to your existing styles
const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    padding: 14,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  suggestionList: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginTop: 4,
    maxHeight: 150,
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  suggestionItemLast: {
    borderBottomWidth: 0,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  modalDescription: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#555',
  },
  modalButtons: {
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  modalButton: {
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 10,
  },
  localButton: {
    backgroundColor: '#5C6BC0',
  },
  longDistanceButton: {
    backgroundColor: '#26A69A',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonSubtext: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
    opacity: 0.8,
  },
  routeTypeIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  routeTypeText: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#333',
  },
  changeButton: {
    backgroundColor: '#666',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  changeButtonText: {
    color: '#fff',
    fontSize: 12,
  },
});