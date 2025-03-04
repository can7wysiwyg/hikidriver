import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Image,  TouchableOpacity, TextInput, Alert, ActivityIndicator, ScrollView, RefreshControl,
} from 'react-native';
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { useSelector } from 'react-redux';
import {ApiUrl} from "../../../helpers/ApiUrl"  
import { styles } from './viewCarStyles';


export default function ViewCar  ({navigation})  {

  const { token, user } = useSelector((state) => state.auth);

  // State for editable fields
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [carInfo, setCarInfo] = useState({})
  const [routes, setRoutes] = useState({});
 
  const onRefresh = useCallback( async() => {
    setRefreshing(true);
    fetchTaxi()
    fetchRoute()
    
   
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);


useEffect(() => {
  fetchTaxi()
  fetchRoute()
}, [])

const fetchTaxi = async() => {

  try {
   
    setIsLoading(true);

    const response = await fetch(`${ApiUrl}/single_driver/${user?._id}`, {
      method: 'GET',
     })
     if (!response.ok) {
      throw new Error(`Failed to fetch driver data: ${response.statusText}`);
    }

    const fetchedData = await response.json();

    setCarInfo(fetchedData)

    
  } catch (error) {
      
      console.log("failed to fetch car info", error);
     } finally {
      
       setIsLoading(false);
     }

}


const fetchRoute = async() => {
  try {
   
    setIsLoading(true)
    const response = await axios.get(`${ApiUrl}/driver_see_my_routes/${user?._id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    setRoutes(response.data)
    
  } catch (error) {
      
    console.log("failed to fetch route info", error);
   } finally {
  
     setIsLoading(false);
   }

} 



  const handleUpdateCarInfo = async () => {
    try {
      setIsLoading(true);
      const response = await axios.put(
        `${ApiUrl}/driver_car_info_update/${user?._id}`,
        carInfo,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (response.data.msg.includes("successfully")) {
        Alert.alert("Success", "Car information updated successfully");

        await fetchTaxi()
    
        setIsEditing(false);
      } else {
        Alert.alert("Error", response.data.msg);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to update car information");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadCarPhoto = async () => {
     try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert("Permission Required", "You need to allow access to your photos");
        return;
      }
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      
      if (!result.canceled) {
        setIsLoading(true);
        
        // Create form data
        const formData = new FormData();
        formData.append('driverCarPhoto', {
          uri: result.assets[0].uri,
          name: 'car_photo.jpg',
          type: 'image/jpeg',
        });
        
        const response = await axios.put(
          `${ApiUrl}/driver_car_photo_update/${user?._id}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        if (response.data.msg.includes("successfully")) {
          Alert.alert("Success", "Car photo updated successfully");

          await fetchTaxi()
          
        } else {
          Alert.alert("Error", response.data.msg);
        }
      }
    } catch (error) {
      Alert.alert("Error", "Failed to upload car photo");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadLicense = async () => {


    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert("Permission Required", "You need to allow access to your photos");
        return;
      }
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      
      if (!result.canceled) {
        setIsLoading(true);
        
        // Create form data
        const formData = new FormData();
        formData.append('drivingLicence', {
          uri: result.assets[0].uri,
          name: 'licence_photo.jpg',
          type: 'image/jpeg',
        });
        
        const response = await axios.put(
          `${ApiUrl}/driver_licence_update/${user?._id}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        if (response.data.msg.includes("successfully")) {
          Alert.alert("Success", "Car photo updated successfully");

          await fetchTaxi()
          
        } else {
          Alert.alert("Error", response.data.msg);
        }
      }
    } catch (error) {
      Alert.alert("Error", "Failed to upload car photo");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
    

  };

  
  const toggleTaxiType = () => {
    setCarInfo({
      ...carInfo,
      taxiType: carInfo.taxiType === 'shared' ? 'non-shared' : 'shared'
    });
  };

  const toggleVehicleType = () => {
    setCarInfo({
      ...carInfo,
      vehicleType: carInfo.vehicleType === 'taxi' ? 'bus' : 'taxi'
    });
  };

  


  if(!carInfo) {
    return(<>
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
    
    </>)
  }

  return (
    <ScrollView
    contentContainerStyle={styles.scrollViewContent}
              showsVerticalScrollIndicator={false}
              
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={['#3E7BFA']}
                  tintColor="#3E7BFA"
                />
              }   
              >
    <View style={styles.container}>
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#0066cc" />
        </View>
      )}
      
      {/* Car Photo Section */}
      <View style={styles.photoSection}>
        <Image 
          source={{uri: carInfo?.driverCarPhoto }}
          style={styles.carPhoto}
          resizeMode="cover"
        />
        <TouchableOpacity style={styles.photoEditButton} onPress={handleUploadCarPhoto}>
          <MaterialIcons name="edit" size={24} color="white" />
        </TouchableOpacity>
      </View>


      {/* id or driving licence */}
      <View style={{margin: 12}}>

      <View style={styles.photoSection}>
        <Image 
          source={{uri: carInfo?.drivingLicence }}
          style={styles.carPhoto}
          resizeMode="cover"
        />
        <TouchableOpacity style={styles.photoEditButton} onPress={handleUploadLicense}>
          <MaterialIcons name="edit" size={24} color="white" />
        </TouchableOpacity>
      </View>

      </View>

      {/* end */}
      
      {/* Car Details Section */}
      <View style={styles.detailsContainer}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Vehicle Details</Text>
          <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
            <MaterialIcons name={isEditing ? "check" : "edit"} size={24} color="#0066cc" />
          </TouchableOpacity>
        </View>
        
        {/* Car Info */}
        <View style={styles.infoSection}>
         
          <View style={styles.infoRow}>
  <View style={styles.iconContainer}>
    <MaterialIcons 
      name={carInfo.vehicleType === 'taxi' ? 'local-taxi' : 'directions-bus'} 
      size={20} 
      color="#0066cc" 
    />
  </View>
  <View style={styles.taxiTypeContainer}>
    <Text style={styles.infoText}>Vehicle Type:</Text>
    {isEditing ? (
      <TouchableOpacity style={styles.taxiTypeToggle} onPress={toggleVehicleType}>
        <Text style={styles.toggleText}>
          {carInfo.vehicleType === 'taxi' ? 'Taxi' : 'Bus'}
        </Text>
        <FontAwesome5 
          name={carInfo.vehicleType === 'taxi' ? 'toggle-on' : 'toggle-off'} 
          size={20} 
          color={carInfo.vehicleType === 'taxi' ? "#0066cc" : "#888"}
        />
      </TouchableOpacity>
    ) : (
      <Text style={[
        styles.taxiTypeText, 
        {color: carInfo.vehicleType === 'taxi' ? "#0066cc" : "#888"}
      ]}>
        {carInfo.vehicleType === 'taxi' ? 'Taxi' : 'Bus'}
      </Text>
    )}
  </View>
</View>

          
          {/* end */}

          
          <View style={styles.infoRow}>
            <View style={styles.iconContainer}>
              <FontAwesome5 name="id-card" size={20} color="#0066cc" />
            </View>
            {isEditing ? (
              <TextInput
                style={styles.inputField}
                value={carInfo.driverCarPlate}
                onChangeText={(text) => setCarInfo({...carInfo, driverCarPlate: text})}
                placeholder="License Plate"
              />
            ) : (
              <Text style={styles.infoText}>{carInfo.driverCarPlate || "Not specified"}</Text>
            )}
          </View>
          
          <View style={styles.infoRow}>
            <View style={styles.iconContainer}>
              <Ionicons name="people" size={20} color="#0066cc" />
            </View>
            {isEditing ? (
              <TextInput
                style={styles.inputField}
                value={String(carInfo.driverCarCapacity)}
                onChangeText={(text) => setCarInfo({...carInfo, driverCarCapacity: text})}
                placeholder="Capacity"
                keyboardType="numeric"
              />
            ) : (
              <Text style={styles.infoText}>Capacity: {carInfo.driverCarCapacity || "Not specified"}</Text>
            )}
          </View>
          
          <View style={styles.infoRow}>
            <View style={styles.iconContainer}>
              <MaterialIcons name="route" size={20} color="#0066cc" />
            </View>
            <View style={styles.taxiTypeContainer}>
              <Text style={styles.infoText}>Taxi Type:</Text>
              {isEditing ? (
                <TouchableOpacity style={styles.taxiTypeToggle} onPress={toggleTaxiType}>
                  <Text style={styles.toggleText}>
                    {carInfo.taxiType === 'shared' ? 'shared' : 'non-shared'}
                  </Text>
                  <FontAwesome5 
                    name={carInfo.taxiType === 'shared' ? 'toggle-on' : 'toggle-off'} 
                    size={20} 
                    color={carInfo.taxiType === 'shared' ? "#0066cc" : "#888"}
                  />
                </TouchableOpacity>
              ) : (
                <Text style={[
                  styles.taxiTypeText, 
                  {color: carInfo.taxiType === 'shared' ? "#0066cc" : "#888"}
                ]}>
                  {carInfo.taxiType === 'shared' ? 'shared' : 'non-shared'}
                </Text>
              )}
            </View>
          </View>
          
          
        </View>
         
        
         {isEditing && (
          <TouchableOpacity style={styles.saveButton} onPress={handleUpdateCarInfo}>
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        )} 
        
                   {carInfo.taxiType === 'shared' && (
          <View style={styles.routesSection}>
            <View style={styles.routeHeader}>
              <Text style={styles.routeTitle}>Taxi Route</Text>
              
            </View>
                       
            

<View style={{
  marginTop: 8, 
}}>
  {routes.length > 0 ? (
    routes.map((route, index) => (
      <View key={index} style={{
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
      }}>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 8,
        }}>
          <Text style={{
            fontSize: 16,
            fontWeight: '600',
            color: '#333',
          }}>{route.routeName}</Text>
          <Text style={{
            fontSize: 16,
            fontWeight: '600',
            color: '#0047AB',
          }}>MWK {route.fare.toLocaleString()}</Text>
        </View>
        
        <View style={{
          marginVertical: 12,
          borderLeftWidth: 2,
          borderLeftColor: '#ddd',
          paddingLeft: 10,
        }}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 12,
          }}>
            <View style={{
              width: 10,
              height: 10,
              borderRadius: 5,
              backgroundColor: '#0047AB',
              marginRight: 8,
            }} />
            <Text style={{
              fontSize: 15,
              color: '#444',
            }}>{route.startLocation.placeName}</Text>
          </View>
          
          <View style={{
            height: 20,
            borderLeftWidth: 1,
            borderLeftColor: '#999',
            marginLeft: 5,
          }} />
          
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
            <View style={{
              width: 10,
              height: 10,
              borderRadius: 5,
              backgroundColor: '#E53E3E',
              marginRight: 8,
            }} />
            <Text style={{
              fontSize: 15,
              color: '#444',
            }}>{route.endLocation.placeName}</Text>
          </View>
        </View>
        
        <TouchableOpacity
          style={{
            backgroundColor: '#f0f7ff',
            borderWidth: 1,
            borderColor: '#0047AB',
            borderRadius: 4,
            paddingVertical: 8,
            paddingHorizontal: 12,
            alignItems: 'center',
            marginTop: 8,
          }}
          onPress={() => navigation.navigate("RouteUpdateList", { data: route._id })}
        >
          <Text style={{
            color: '#0047AB',
            fontWeight: '500',
          }}>Update Route</Text>
        </TouchableOpacity>
      </View>
    ))
  ) : (
    
<TouchableOpacity
          style={{
            backgroundColor: '#f0f7ff',
            borderWidth: 1,
            borderColor: '#0047AB',
            borderRadius: 4,
            paddingVertical: 8,
            paddingHorizontal: 12,
            alignItems: 'center',
            marginTop: 8,
          }}
           onPress={() => navigation.navigate("PostTaxiRoute", { data: carInfo?.driverId })}
        >
          <Text style={{
            color: '#0047AB',
            fontWeight: '500',
          }}>Post Route</Text>
        </TouchableOpacity>


  )}
</View>



{/* end */}

          </View>




        )}



      </View> 
    </View>

    </ScrollView>
  );
};

