

import React, { useState, useEffect } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  StyleSheet
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { ApiUrl } from '../../../helpers/ApiUrl';
 import { Picker } from '@react-native-picker/picker';
import { DistrictsUrl } from '../../../helpers/DistrictsUrl';




export default function RouteDestinationName({ route, navigation }) {
  const { data } = route.params;
  const { token } = useSelector((state) => state.auth);
  const [destinationArea, setDestinationArea] = useState('');
  const [loading, setLoading] = useState(false); 
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
    
    


  if (!data) {
    return '';
  }

  const handleSubmit = async () => {
    if (!destinationArea) {
      Alert.alert('Missing  field');
      return;
    }

    setLoading(true); // Start the loader
    try {
       await axios.put(
        `${ApiUrl}/driver_route_update/${data}`,
        { destinationArea },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      
      Alert.alert('Success', 'Updated successfully');
      navigation.goBack()
    } catch (error) {
      console.log(
        'Error posting taxi route:'
      );
      Alert.alert(
        'Error',
       'Failed to '
      );
    } finally {
      setLoading(false); // Stop the loader
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        <Text style={styles.header}>Update Destination Name</Text>

        <View style={styles.formGroup}>

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
      </View>
    </KeyboardAvoidingView>
  );
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


