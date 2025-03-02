import React, { useEffect, useState } from "react";
import { Alert, AppState } from "react-native";
import * as Location from "expo-location";
import axios from "axios";
import { useSelector } from "react-redux";
import { ApiUrl } from "./ApiUrl";


const DRIVER_UPDATE_INTERVAL = 60000; // Update every 60 seconds

const DriverLocationUpdater = ({ driverId }) => {
  const [appState, setAppState] = useState(AppState.currentState);
  const [location, setLocation] = useState(null);
  const { token } = useSelector((state) => state.auth);

  // Function to fetch and update location
  const updateDriverLocation = async () => {
    try {
      // Get the driver's current location
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Location permissions are required.");
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      const latitude = currentLocation.coords.latitude;
      const longitude = currentLocation.coords.longitude;

      // Update location in state
      setLocation({ latitude, longitude });

      // Send location to backend
      await axios.post(`${ApiUrl}/updateLocation/${driverId}`, {
        latitude, longitude 
      },  {
        headers: {
            Authorization: `Bearer ${token}`
        }
      });

    //   console.log("Driver location updated successfully:", { latitude, longitude });
    } catch (error) {
      console.log("Error updating driver location:", error.message);
    }
  };

  // Start periodic updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (appState === "active") {
        updateDriverLocation();
      }
    }, DRIVER_UPDATE_INTERVAL);

    return () => clearInterval(interval); // Cleanup on unmount
  }, [appState]);

  // Listen for app state changes
  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      setAppState(nextAppState);
    };

    const subscription = AppState.addEventListener("change", handleAppStateChange);

    return () => subscription.remove(); // Cleanup on unmount
  }, []);

  return null; // This component doesn't render anything visible
};

export default DriverLocationUpdater;
