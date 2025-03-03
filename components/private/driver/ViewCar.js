import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, TextInput, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { MaterialIcons, FontAwesome5, Ionicons, Entypo } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { useSelector } from 'react-redux';
import {ApiUrl} from "../../../helpers/ApiUrl"  

export default function ViewCar  ({navigation})  {

  const { token, user } = useSelector((state) => state.auth);

  // State for editable fields
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [carInfo, setCarInfo] = useState({})
  const [routes, setRoutes] = useState({});
  const [showRouteInput, setShowRouteInput] = useState(false);
  const [newRoutePoint, setNewRoutePoint] = useState('');



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
    // try {
    //   setIsLoading(true);
      // const response = await axios.put(
      //   `${ApiUrl}/driver_car_info_update/${user?._id}`,
      //   carInfo,
      //   {
      //     headers: {
      //       Authorization: `Bearer ${authToken}`,
      //     },
      //   }
      // );
      
    //   if (response.data.msg.includes("successfully")) {
    //     Alert.alert("Success", "Car information updated successfully");
    //     if (onUpdate) onUpdate();
    //     setIsEditing(false);
    //   } else {
    //     Alert.alert("Error", response.data.msg);
    //   }
    // } catch (error) {
    //   Alert.alert("Error", "Failed to update car information");
    //   console.error(error);
    // } finally {
    //   setIsLoading(false);
    // }
  };

  const handleUploadCarPhoto = async () => {
    // try {
      // const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      // if (permissionResult.granted === false) {
      //   Alert.alert("Permission Required", "You need to allow access to your photos");
      //   return;
      // }
      
      // const result = await ImagePicker.launchImageLibraryAsync({
      //   mediaTypes: ImagePicker.MediaTypeOptions.Images,
      //   allowsEditing: true,
      //   aspect: [4, 3],
      //   quality: 1,
      // });
      
      // if (!result.canceled) {
      //   setIsLoading(true);
        
      //   // Create form data
      //   const formData = new FormData();
      //   formData.append('driverCarPhoto', {
      //     uri: result.assets[0].uri,
      //     name: 'car_photo.jpg',
      //     type: 'image/jpeg',
      //   });
        
      //   const response = await axios.put(
      //     `${apiBaseUrl}/driver_car_photo_update/${driver.driverId}`,
      //     formData,
      //     {
      //       headers: {
      //         'Content-Type': 'multipart/form-data',
      //         Authorization: `Bearer ${authToken}`,
      //       },
      //     }
      //   );
        
      //   if (response.data.msg.includes("successfully")) {
      //     Alert.alert("Success", "Car photo updated successfully");
      //     if (onUpdate) onUpdate();
      //   } else {
      //     Alert.alert("Error", response.data.msg);
      //   }
      // }
    // } catch (error) {
    //   Alert.alert("Error", "Failed to upload car photo");
    //   console.error(error);
    // } finally {
    //   setIsLoading(false);
    // }
  };

  const handleUploadLicense = async () => {
    // Similar to car photo upload but for license
    Alert.alert("Feature", "License upload feature will be implemented here");
  };

  const addRoutePoint = () => {
    // if (newRoutePoint.trim()) {
    //   setRoutes([...routes, newRoutePoint.trim()]);
    //   setNewRoutePoint('');
    // }
  };

  const removeRoutePoint = (index) => {
    // const updatedRoutes = [...routes];
    // updatedRoutes.splice(index, 1);
    // setRoutes(updatedRoutes);
  };

  const toggleTaxiType = () => {
    // setCarInfo({
    //   ...carInfo,
    //   taxiType: carInfo.taxiType === 'shared' ? 'nonshared' : 'shared'
    // });
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
              showsVerticalScrollIndicator={false}>
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
              <Ionicons name="car-sport" size={20} color="#0066cc" />
            </View>
            {isEditing ? (
              <TextInput
                style={styles.inputField}
                value={carInfo.vehicleType}
                onChangeText={(text) => setCarInfo({...carInfo, vehicleType: text})}
                placeholder="Vehicle Type"
              />
            ) : (
              <Text style={styles.infoText}>{carInfo?.vehicleType || "Not specified"}</Text>
            )}
          </View>
          
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
                    {carInfo.taxiType === 'shared' ? 'Shared' : 'Non-shared'}
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
                  {carInfo.taxiType === 'shared' ? 'Shared' : 'Non-shared'}
                </Text>
              )}
            </View>
          </View>
          
          {/* License Info */}
            {/* <TouchableOpacity style={styles.licenseSection} onPress={handleUploadLicense}>
            <View style={styles.iconContainer}>
              <FontAwesome5 name="id-card-alt" size={20} color="#0066cc" />
            </View>
            <Text style={styles.licenseText}>
              {driver?.drivingLicence ? "Update Driving License" : "Upload Driving License"}
            </Text>
            <MaterialIcons name="upload-file" size={20} color="#0066cc" />
          </TouchableOpacity>
         */}
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
              {isEditing && (
                <TouchableOpacity onPress={() => setShowRouteInput(!showRouteInput)}>
                  <Ionicons name={showRouteInput ? "remove" : "add"} size={24} color="#0066cc" />
                </TouchableOpacity>
              )} 

            </View>
                       
            {isEditing && showRouteInput && (
              <View style={styles.routeInput}>
                <TextInput
                  style={styles.routeInputField}
                  value={newRoutePoint}
                  onChangeText={setNewRoutePoint}
                  placeholder="Add route point"
                />
                <TouchableOpacity style={styles.addButton} onPress={addRoutePoint}>
                  <Text style={styles.addButtonText}>Add</Text>
                </TouchableOpacity>
              </View>
            )}
             

            

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
    <Text style={{
      fontSize: 15,
      color: '#888',
      fontStyle: 'italic',
      marginTop: 8,
    }}>No routes available</Text>
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

const styles = StyleSheet.create({
  scrollViewContent: {
  flexGrow: 1
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    margin: 16,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  photoSection: {
    position: 'relative',
    height: 200,
  },
  carPhoto: {
    width: '100%',
    height: '100%',
  },
  photoEditButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsContainer: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  infoSection: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  iconContainer: {
    width: 36,
    height: 36,
    backgroundColor: '#f0f8ff',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  inputField: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    paddingHorizontal: 8,
    fontSize: 16,
  },
  taxiTypeContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  taxiTypeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  toggleText: {
    marginRight: 8,
    fontSize: 16,
    color: '#333',
  },
  taxiTypeText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
  },
  licenseSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  licenseText: {
    flex: 1,
    fontSize: 16,
    color: '#0066cc',
    marginLeft: 8,
  },
  saveButton: {
    backgroundColor: '#0066cc',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  routesSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  routeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  routeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  routeInput: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  routeInputField: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    paddingHorizontal: 8,
    marginRight: 8,
  },
  addButton: {
    backgroundColor: '#0066cc',
    borderRadius: 4,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  routePointsList: {
    marginTop: 8,
  },
  routePoint: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  routePointText: {
    flex: 1,
    fontSize: 15,
    color: '#444',
  },
  noRouteText: {
    fontSize: 15,
    color: '#888',
    fontStyle: 'italic',
    marginTop: 8,
  }
});