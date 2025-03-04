
import React, { useEffect, useState, useCallback } from 'react';
import { 
   View, 
  Text, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar,
  ScrollView,
  RefreshControl
} from 'react-native';
import { 
  MaterialIcons, 
  FontAwesome5, 
  Ionicons, 
  MaterialCommunityIcons 
} from '@expo/vector-icons';
import { styles } from './driverStyles';
import { useSelector } from 'react-redux';
import { ApiUrl } from '../../../helpers/ApiUrl';



export default function Driver ({navigation})  {
  const { token, user } = useSelector((state) => state.auth);
  const [refreshing, setRefreshing] = useState(false);
  const[passengers, setPassengers] = useState({})  
  const [earnings, setEarnings] = useState(85.50);
  const [trips, setTrips] = useState(6);

  useEffect(() => {
    fetchPassengers()
}, [])



 const fetchPassengers = async() => {

  try {
const response = await fetch(`${ApiUrl}/show_boarded_taxi_to_owner/${user?._id}`, {
  method: 'GET',
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})

const fetchedData = await response.json()

setPassengers(fetchedData.passengers)

    
  } catch (error) {
    console.log("Error while fetching passengers", error)
  }

 }

 
const onRefresh = useCallback( async() => {
    setRefreshing(true);
    fetchPassengers()
   
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#f8f9fa" barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{user?.fullname}</Text>
          
        </View>
        
        {/* Summary Row */}
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <MaterialIcons name="attach-money" size={24} color="#16a085" />
            <Text style={styles.summaryValue}>${earnings.toFixed(2)}</Text>
            <Text style={styles.summaryLabel}>Today</Text>
          </View>
          <View style={styles.summaryItem}>
            <FontAwesome5 name="route" size={20} color="#16a085" />
            <Text style={styles.summaryValue}>{trips}</Text>
            <Text style={styles.summaryLabel}>Trips</Text>
          </View>
        </View>
      </View>
      
      {/* Main Content */}
      <ScrollView style={styles.content}
      refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={["#2ecc71"]}
                  /> }
      
      >
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        
        <View style={styles.actionGrid}>
          <TouchableOpacity style={styles.actionItem} onPress={() => navigation.navigate('viewcar')}>
            <View style={styles.actionIcon}>
              <Ionicons name="car" size={24} color="#16a085" />
            </View>
            <Text style={styles.actionText}>View Car</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionItem} onPress={() => navigation.navigate('PaymentSystems') }>
            <View style={styles.actionIcon}>
              <MaterialCommunityIcons name="wallet" size={24} color="#16a085" />
            </View>
            <Text style={styles.actionText}>Payment Systems</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionItem}>
            <View style={styles.actionIcon}>
              <FontAwesome5 name="map-marked-alt" size={22} color="#16a085" />
            </View>
            <Text style={styles.actionText}>Navigation</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionItem}>
            <View style={styles.actionIcon}>
              <MaterialIcons name="history" size={24} color="#16a085" />
            </View>
            <Text style={styles.actionText}>Trip History</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.sectionTitle}>Today's Summary</Text>
        
        <View style={styles.tripSummary}>
          <TouchableOpacity style={styles.summaryCard}>
            <View style={styles.summaryCardContent}>
              <MaterialCommunityIcons name="clock-time-four" size={22} color="#16a085" />
              <View style={styles.summaryCardText}>
                <Text style={styles.summaryCardTitle}>Online Hours</Text>
                <Text style={styles.summaryCardValue}>5h 20m</Text>
              </View>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.summaryCard}>
            <View style={styles.summaryCardContent}>
              <MaterialIcons name="speed" size={22} color="#16a085" />
              <View style={styles.summaryCardText}>
                <Text style={styles.summaryCardTitle}>Total Distance</Text>
                <Text style={styles.summaryCardValue}>78 km</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.sectionTitle}>Taxi Requests</Text>
        
        
          <View style={styles.noRideContainer}>
            <FontAwesome5 name="user" size={40} color="#16a085" />
            {
              passengers ? <TouchableOpacity onPress={() => navigation.navigate('ViewRequests')} >
<Text style={styles.noRideText}>See requests...</Text>
              </TouchableOpacity> : <Text style={styles.noRideText}>No requests...</Text>
            }
            
          </View>
        
      </ScrollView>
      
      
      
    </SafeAreaView>
  );
};

