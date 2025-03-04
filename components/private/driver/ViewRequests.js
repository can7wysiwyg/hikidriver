import React, { useCallback, useState, useEffect } from 'react';
import { 
  Text, 
  View, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  RefreshControl,
  Alert
} from 'react-native';
import { 
  MaterialIcons, 
  FontAwesome5, 
  Ionicons, 
  MaterialCommunityIcons 
} from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { ApiUrl } from '../../../helpers/ApiUrl';
import axios from 'axios';


export default function ViewRequests() {
  const { token, user } = useSelector((state) => state.auth);
  const [passengers, setPassengers] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const [carInfo, setCarInfo] = useState({})

  useEffect(() => {
    fetchPassengers();
    fetchTaxi()
  }, []);

  const fetchPassengers = async() => {
    try {
      setRefreshing(true);
      const response = await fetch(`${ApiUrl}/show_boarded_taxi_to_owner/${user?._id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const fetchedData = await response.json();
      setPassengers(fetchedData.passengers);
    } catch (error) {
      console.log("Error while fetching passengers", error);
      Alert.alert("Error", "Failed to fetch passengers. Please try again.");
    } finally {
      setRefreshing(false);
    }
  };


  const fetchTaxi = async() => {
  
    try {
     
    
  
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
        
         
       }
  
  }
  

  const onRefresh = useCallback(() => {
    fetchPassengers();
    fetchTaxi()
  }, []);

  const handleDeboardPassenger = async (bookingId) => {
    try {
      const response = await fetch(`${ApiUrl}/deboard_passenger/${bookingId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const result = await response.json();
      
      if (result.success) {
        Alert.alert("Success", "Passenger deboarded successfully");
        fetchPassengers(); // Refresh the list
      } else {
        Alert.alert("Error", result.message || "Failed to deboard passenger");
      }
    } catch (error) {
      console.log("Error while deboarding passenger", error);
      Alert.alert("Error", "Failed to deboard passenger. Please try again.");
    }
  };



  const deboardSharedPassenger = async(userId) => {

let driverId = carInfo.driverId


    try {
      const response = await axios.delete(
        `${ApiUrl}/de_board_from_shared_taxi/${userId}/${driverId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
    
        if (response.data.msg) {
          Alert.alert("Success", "Passenger deboarded successfully");
          fetchPassengers(); 
        } else {
          Alert.alert("Error", "Failed to deboard passenger");
        }
      } catch (error) {
        console.log("Error while deboarding shared passenger", error);
        Alert.alert("Error", "Failed to deboard passenger. Please try again.");
      }


  }

  // Shared taxi UI rendering
  const renderSharedTaxiItem = ({ item }) => (
    <View style={styles.bookingItem}>
      <View style={styles.bookingInfo}>
        <View style={styles.locationRow}>
          <MaterialIcons name="location-on" size={20} color="#e74c3c" />
          <Text style={styles.locationText}>From: {item.pickUpLocation}</Text>
        </View>
        <View style={styles.locationRow}>
          <MaterialIcons name="location-searching" size={20} color="#3498db" />
          <Text style={styles.locationText}>To: {item.dropoff}</Text>
        </View>
        <View style={styles.codeRow}>
          <FontAwesome5 name="ticket-alt" size={18} color="#9b59b6" />
          <Text style={styles.codeText}>Code: {item.confirmationCode}</Text>
        </View>
      </View>
      <TouchableOpacity 
        style={styles.deboardButton}
        onPress={() => deboardSharedPassenger(item?.userId)}
      >
        <Text style={styles.deboardButtonText}>Deboard</Text>
      </TouchableOpacity>
    </View>
  );

  // Header component for shared taxi
  const renderSharedTaxiHeader = () => (
    <View style={styles.taxiInfoContainer}>
      <View style={styles.taxiInfoHeader}>
        <MaterialCommunityIcons name="taxi" size={24} color="#f39c12" />
        <Text style={styles.taxiCapacityText}>
          Capacity: {passengers.taxiCapacity} seats
        </Text>
      </View>
      <Text style={styles.bookingsHeader}>
        Passengers ({passengers.bookings?.length || 0})
      </Text>
    </View>
  );

  // Non-shared taxi UI rendering
  const renderNonSharedTaxi = () => (
    <View style={styles.nonSharedContainer}>
      <View style={styles.requestCard}>
        <View style={styles.requestHeader}>
          <MaterialCommunityIcons name="taxi" size={24} color="#f39c12" />
          <Text style={styles.requestTitle}>Taxi Request</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{passengers.rideStatus}</Text>
          </View>
        </View>

        <View style={styles.requestDetails}>
          <View style={styles.detailRow}>
            <MaterialIcons name="location-on" size={20} color="#e74c3c" />
            <View style={styles.locationDetail}>
              <Text style={styles.locationLabel}>Pickup</Text>
              <Text style={styles.locationValue}>{passengers.pickupLocation}</Text>
            </View>
          </View>
          
          <View style={styles.locationConnector}>
            <View style={styles.verticalLine}></View>
          </View>
          
          <View style={styles.detailRow}>
            <MaterialIcons name="location-searching" size={20} color="#3498db" />
            <View style={styles.locationDetail}>
              <Text style={styles.locationLabel}>Dropoff</Text>
              <Text style={styles.locationValue}>{passengers.dropoffLocation}</Text>
            </View>
          </View>
          
          <View style={styles.tripInfo}>
            <View style={styles.tripInfoItem}>
              <FontAwesome5 name="road" size={16} color="#7f8c8d" />
              <Text style={styles.tripInfoText}>{passengers.distance} km</Text>
            </View>
            <View style={styles.tripInfoItem}>
              <Ionicons name="time-outline" size={16} color="#7f8c8d" />
              <Text style={styles.tripInfoText}>{passengers.time} min</Text>
            </View>
            <View style={styles.tripInfoItem}>
              <FontAwesome5 name="ticket-alt" size={16} color="#9b59b6" />
              <Text style={styles.tripInfoText}>{passengers.confirmationCode}</Text>
            </View>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.deboardButton}
          onPress={() => handleDeboardPassenger(passengers._id)}
        >
          <Text style={styles.deboardButtonText}>Deboard Passenger</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Empty state rendering
  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="car-outline" size={50} color="#ccc" />
      <Text style={styles.emptyText}>
        No {passengers.bookings ? 'shared' : 'individual'} taxi requests
      </Text>
    </View>
  );

  // Render appropriate UI based on data structure
  const renderContent = () => {
    if (passengers && passengers.bookings) {
      // Shared taxi case
      if (passengers.bookings.length === 0) {
        return renderEmptyComponent();
      }
      
      return (
        <FlatList
          data={passengers.bookings}
          keyExtractor={(item) => item._id}
          renderItem={renderSharedTaxiItem}
          ListHeaderComponent={renderSharedTaxiHeader}
          contentContainerStyle={styles.sharedContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#2ecc71"]}
            />
          }
        />
      );
    } else {
      // Non-shared taxi case
      return (
        <FlatList
          data={[{ id: '1' }]} // Just need one item to render the non-shared UI
          keyExtractor={(item) => item.id}
          renderItem={() => passengers && passengers._id ? renderNonSharedTaxi() : renderEmptyComponent()}
          contentContainerStyle={styles.nonSharedContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#2ecc71"]}
            />
          }
        />
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Taxi Requests</Text>
      {renderContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16,
    color: '#2c3e50',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: '#95a5a6',
  },
  // Shared taxi styles
  sharedContainer: {
    padding: 12,
    flexGrow: 1,
  },
  taxiInfoContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  taxiInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  taxiCapacityText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
    color: '#34495e',
  },
  bookingsHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
    color: '#2c3e50',
  },
  bookingItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  bookingInfo: {
    flex: 1,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    fontSize: 15,
    marginLeft: 8,
    color: '#34495e',
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  codeText: {
    fontSize: 14,
    marginLeft: 8,
    color: '#9b59b6',
    fontWeight: '500',
  },
  deboardButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  deboardButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  // Non-shared taxi styles
  nonSharedContainer: {
    padding: 12,
    flexGrow: 1,
  },
  requestCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  requestHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  requestTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#2c3e50',
    flex: 1,
  },
  statusBadge: {
    backgroundColor: '#3498db',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  requestDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  locationDetail: {
    marginLeft: 12,
    flex: 1,
  },
  locationLabel: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  locationValue: {
    fontSize: 16,
    color: '#34495e',
    marginTop: 2,
  },
  locationConnector: {
    marginLeft: 10,
    height: 20,
    alignItems: 'center',
  },
  verticalLine: {
    width: 1,
    height: '100%',
    backgroundColor: '#bdc3c7',
  },
  tripInfo: {
    flexDirection: 'row',
    marginTop: 12,
    justifyContent: 'space-between',
  },
  tripInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tripInfoText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#7f8c8d',
  },
});