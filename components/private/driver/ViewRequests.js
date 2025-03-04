import React, { useCallback, useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from "react-native";
import {
  MaterialIcons,
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { ApiUrl } from "../../../helpers/ApiUrl";
import axios from "axios";
import { styles } from "./viewRequestStyles";

export default function ViewRequests() {
  const { token, user } = useSelector((state) => state.auth);
  const [passengers, setPassengers] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const [carInfo, setCarInfo] = useState({});
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    fetchPassengers();
    fetchTaxi();
  }, []);

  const fetchPassengers = async () => {
    try {
      setRefreshing(true);
      const response = await fetch(
        `${ApiUrl}/show_boarded_taxi_to_owner/${user?._id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const fetchedData = await response.json();
      setPassengers(fetchedData.passengers);
    } catch (error) {
      console.log("Error while fetching passengers", error);
      Alert.alert("Error", "Failed to fetch passengers. Please try again.");
    } finally {
      setRefreshing(false);
    }
  };

  const fetchTaxi = async () => {
    try {
      const response = await fetch(`${ApiUrl}/single_driver/${user?._id}`, {
        method: "GET",
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch driver data: ${response.statusText}`);
      }

      const fetchedData = await response.json();

      setCarInfo(fetchedData);
    } catch (error) {
      console.log("failed to fetch car info", error);
    } finally {
    }
  };

  const onRefresh = useCallback(() => {
    fetchPassengers();
    fetchTaxi();
  }, []);

  const confirmStartJourney = (tripId) => {
    Alert.alert(
      "Start Trip",
      "Are you sure you want to start this trip?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes, Start",
          onPress: () => startJourney(tripId),
        },
      ],
      { cancelable: true }
    );
  };

  const startJourney = async (tripId) => {
    try {
      let driverId = carInfo.driverId;

      setIsDisabled(true);

      await axios.put(
        `${ApiUrl}/driver_start_trip_non_shared/${tripId}/${driverId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await fetchPassengers();
    } catch (error) {
      console.error("Error starting trip:", error.message);
      setIsDisabled(false);
    }
  };

  const handleDeboardPassenger = async () => {
    try {
      const response = await axios.delete(
        `${ApiUrl}/de_board_passenger_from_non_shared_taxi/${user?._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.msg) {
        Alert.alert("Success", "Passenger deboarded successfully");
        fetchPassengers(); // Refresh the list
      } else {
        Alert.alert("Error", "Failed to deboard passenger");
      }
    } catch (error) {
      console.log("Error while deboarding passenger", error);
      Alert.alert("Error", "Failed to deboard passenger. Please try again.");
    }
  };

  const deboardSharedPassenger = async (userId) => {
    let driverId = carInfo.driverId;

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
  };

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
              <Text style={styles.locationValue}>
                <PickUp passengers={passengers} />{" "}
              </Text>
            </View>
          </View>

          <View style={styles.locationConnector}>
            <View style={styles.verticalLine}></View>
          </View>

          <View style={styles.detailRow}>
            <MaterialIcons
              name="location-searching"
              size={20}
              color="#3498db"
            />
            <View style={styles.locationDetail}>
              <Text style={styles.locationLabel}>Dropoff</Text>
              <Text style={styles.locationValue}>
                {passengers.dropoffLocation}
              </Text>
            </View>
          </View>

          <View style={{margin: 8}}>

          <View style={styles.locationDetail}>
              <Text style={styles.locationLabel}>Passenger Details</Text>
              <Text style={styles.locationValue}>
                {/* {passengers.dropoffLocation} */}

                <PassengerDetails passengers={passengers} />
              </Text>
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
              <Text style={styles.tripInfoText}>
                {passengers.confirmationCode}
              </Text>
            </View>
          </View>
        </View>

        <View style={{ margin: 12 }}>
          {passengers.rideStatus === "in transit" ? (
            <Text style={{ color: "red", fontWeight: "bold" }}>
              You Are In Transit
            </Text>
          ) : (
            <TouchableOpacity
              onPress={
                !isDisabled ? () => confirmStartJourney(passengers?._id) : null
              }
              style={{
                backgroundColor: isDisabled ? "#888" : "#007BFF",
                borderRadius: 50,
                padding: 15,
                flexDirection: "row",
                alignItems: "center",
                shadowColor: "#000",
                shadowOpacity: 0.3,
                shadowOffset: { width: 0, height: 2 },
                shadowRadius: 3,
                elevation: 5,
              }}
              disabled={isDisabled}
            >
              <MaterialIcons
                name="play-circle-outline"
                size={24}
                color="#fff"
                style={{ marginRight: 10 }}
              />
              <Text
                style={{
                  color: "#fff",
                  fontSize: 16,
                  fontWeight: "bold",
                }}
              >
                {isDisabled ? "Started..." : "Start Trip"}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={styles.deboardButton}
          onPress={() => handleDeboardPassenger()}
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
        No {passengers.bookings ? "shared" : "individual"} taxi requests
      </Text>
    </View>
  );

  // Render appropriate UI based on data structure
  const renderContent = () => {
    if (passengers && passengers?.bookings) {
      // Shared taxi case
      if (passengers?.bookings.length === 0) {
        return renderEmptyComponent();
      }

      return (
        <FlatList
          data={passengers?.bookings}
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
          data={[{ id: "1" }]} // Just need one item to render the non-shared UI
          keyExtractor={(item) => item.id}
          renderItem={() =>
            passengers && passengers._id
              ? renderNonSharedTaxi()
              : renderEmptyComponent()
          }
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

const PickUp = ({ passengers }) => {
  const [place, setPlace] = useState({});

  useEffect(() => {
    const fetchPlaceName = async () => {
      const apiKey = "9c9c94ac-7c45-4141-8427-663723d70743";

      const addressName = await axios.get(
        `https://graphhopper.com/api/1/geocode?point=${passengers?.pickupCoordinates?.latitude},${passengers?.pickupCoordinates?.longitude}&reverse=true&key=${apiKey}`
      );

      const data = addressName.data.hits[0];

      setPlace(data);
    };

    fetchPlaceName();
  }, []);

  


  return (
    <>
      
        
              {place.name},{" "}
            {place.state}, {place.country}{" "}
          
          
          
    </>
  );
};



const PassengerDetails = ({passengers}) => {
  const { token } = useSelector((state) => state.auth);
  const[userDetails, setDetails] = useState({})

  const id = passengers.userId 

  useEffect(() => {

    const fetchUser = async() => {

      const response = await axios.get(`${ApiUrl}/show_user/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setDetails(response.data.user)

    }

    fetchUser()


  }, [id])

console.log(userDetails)

  return(<>
  
  {userDetails?.fullname}, {" "},
   {userDetails?.email}, {userDetails?.phone} {" "}
  
  
  </>)
}