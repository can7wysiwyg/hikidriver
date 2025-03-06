import React, { useEffect, useCallback, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import {  TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Home from './Home';
import Login from './auth/Login';
import { useDispatch, useSelector } from 'react-redux';
import Logout from './auth/Logout';
import { getUserDetails } from '../redux/slices/authSlice';
import ForgotPassword from './auth/ForgotPassword';
import ResetPassword from './auth/ResetPassword';
import { ApiUrl } from '../helpers/ApiUrl';
import Driver from './private/driver/Driver';
import Inbox from "./private/inbox/Inbox"
import DriverLocationUpdater from '../helpers/DriverLocationUpdater';
import SingleMessage from './private/inbox/SingleMessage';
import ViewCar from './private/driver/ViewCar';
import RouteUpdateList from './private/driver/RouteUpdateList';
import RouteStartLocation from './private/driver/RouteStartLocation';
import RouteEndLocation from './private/driver/RouteEndLocation';
import RouteName from './private/driver/RouteName';
import RoutePrice from './private/driver/RoutePrice';
import PostTaxiRoute from './private/driver/PostTaxiRoute';
import ViewRequests from './private/driver/ViewRequests';
import PaymentSystems from './private/driver/PaymentSystems';
import { registerForPushNotificationsAsync } from '../helpers/notifications';
import FCMHandler from '../helpers/FCMHandler';

// Create the Stack Navigator for Login and Register screens
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();




// HomeBar Screen component (memoized)
const HomeBar = React.memo(() => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Hom" component={Home}  
      
      options={() => ({
        headerShown: false,
        headerTitle: "Home"
       
      })} 
      
      
      
      />

      <Stack.Screen name="Login" component={Login} 
      
      options={({ navigation }) => ({
        headerShown: true,
        headerTitle: "Log in",
        headerLeft: () => (
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={{ marginLeft: 10 }}
          >
            <Icon name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
        )
      })} 
      
      
      />
      
      
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} 
      
      options={({ navigation }) => ({
        headerShown: true,
        headerTitle: "Forgot Password",
        headerLeft: () => (
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={{ marginLeft: 10 }}
          >
            <Icon name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
        )
      })} 
      
      
      />
      <Stack.Screen name="ResetPassword" component={ResetPassword} 
      
      options={({ navigation }) => ({
        headerShown: true,
        headerTitle: "Reset Password",
        headerLeft: () => (
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={{ marginLeft: 10 }}
          >
            <Icon name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
        )
      })} 
      
      
      />



      
    
    </Stack.Navigator>
  );
});


// Authentication Stack (Login and Register Screens)
const AuthStack = React.memo(() => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={Login} 
      
      options={({ navigation }) => ({
        headerShown: true,
        headerTitle: "Log in",
        headerLeft: () => (
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={{ marginLeft: 10 }}
          >
            <Icon name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
        )
      })} 
      
      
      />
      
      
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} 
      
      options={({ navigation }) => ({
        headerShown: true,
        headerTitle: "Forgot Password",
        headerLeft: () => (
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={{ marginLeft: 10 }}
          >
            <Icon name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
        )
      })} 
      
      
      />
      <Stack.Screen name="ResetPassword" component={ResetPassword} 
      
      options={({ navigation }) => ({
        headerShown: true,
        headerTitle: "Reset Password",
        headerLeft: () => (
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={{ marginLeft: 10 }}
          >
            <Icon name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
        )
      })} 
      
      
      />




    </Stack.Navigator>
  );
});

// Logout Stack
const LogsOut = React.memo(() => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Logout" component={Logout} 
      
      options={({ navigation }) => ({
        headerShown: true,
        headerTitle: "Log Out",
        headerLeft: () => (
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={{ marginLeft: 10 }}
          >
            <Icon name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
        )
      })} 
      
      />
      <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
});



const DriverStack = React.memo(() => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
      name="driver" 
      component={Driver}
      options={({ navigation }) => ({
        headerShown: true,
        headerTitle: "Driver Profile",
        headerLeft: () => (
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={{ marginLeft: 10 }}
          >
            <Icon name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
        )
      })} 
      
      
      />      
      


      <Stack.Screen 
      name="viewcar" 
      component={ViewCar}
      options={({ navigation }) => ({
        headerShown: true,
        headerTitle: "My Taxi",
        headerLeft: () => (
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={{ marginLeft: 10 }}
          >
            <Icon name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
        )
      })} 
      
      
      />   

<Stack.Screen 
      name="ViewRequests" 
      component={ViewRequests}
      options={({ navigation }) => ({
        headerShown: true,
        headerTitle: "Requests",
        headerLeft: () => (
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={{ marginLeft: 10 }}
          >
            <Icon name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
        )
      })} 
      
      
      />      



<Stack.Screen 
      name="PaymentSystems" 
      component={PaymentSystems}
      options={({ navigation }) => ({
        headerShown: true,
        headerTitle: "Payment Systems",
        headerLeft: () => (
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={{ marginLeft: 10 }}
          >
            <Icon name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
        )
      })} 
      
      
      />      

      


<Stack.Screen 
      name="PostTaxiRoute" 
      component={PostTaxiRoute}
      options={({ navigation }) => ({
        headerShown: true,
        headerTitle: "Taxi Route",
        headerLeft: () => (
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={{ marginLeft: 10 }}
          >
            <Icon name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
        )
      })} 
      
      
      />



      <Stack.Screen 
      name="RouteUpdateList" 
      component={RouteUpdateList}
      options={({ navigation }) => ({
        headerShown: true,
        headerTitle: "Route List",
        headerLeft: () => (
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={{ marginLeft: 10 }}
          >
            <Icon name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
        )
      })} 
      
      
      />


      <Stack.Screen 
      name="RouteName" 
      component={RouteName}
      options={({ navigation }) => ({
        headerShown: true,
        headerTitle: "Route Name",
        headerLeft: () => (
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={{ marginLeft: 10 }}
          >
            <Icon name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
        )
      })} 
      
      
      />   


<Stack.Screen 
      name="RoutePrice" 
      component={RoutePrice}
      options={({ navigation }) => ({
        headerShown: true,
        headerTitle: "Route Price",
        headerLeft: () => (
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={{ marginLeft: 10 }}
          >
            <Icon name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
        )
      })} 
      
      
      />   


<Stack.Screen 
      name="RouteStartLocation" 
      component={RouteStartLocation}
      options={({ navigation }) => ({
        headerShown: true,
        headerTitle: "Start Area",
        headerLeft: () => (
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={{ marginLeft: 10 }}
          >
            <Icon name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
        )
      })} 
      
      
      />   



<Stack.Screen 
      name="RouteEndLocation" 
      component={RouteEndLocation}
      options={({ navigation }) => ({
        headerShown: true,
        headerTitle: "End Area",
        headerLeft: () => (
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={{ marginLeft: 10 }}
          >
            <Icon name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
        )
      })} 
      
      
      />   


      
         
      
     
    </Stack.Navigator>
  );
});


const MessagingStack = React.memo(() => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="inbox" component={Inbox} 
      
      options={({ navigation }) => ({
        headerShown: true,
        headerTitle: "Messages",
        headerLeft: () => (
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={{ marginLeft: 10 }}
          >
            <Icon name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
        )
      })} 
      
      
      />


<Stack.Screen name="SingleMessage" component={SingleMessage} 
      
      options={({ navigation }) => ({
        headerShown: true,
        headerTitle: "Message",
        headerLeft: () => (
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={{ marginLeft: 10 }}
          >
            <Icon name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
        )
      })} 
      
      
      />




      
      
    </Stack.Navigator>
  );
});




function AppNavigator() {
  const { token, user } = useSelector((state) => state.auth);
  const[unreadMessagesCount, setUnreadMessagesCount] = useState([])


    
      const navigationRef = React.useRef(null)


      useEffect(() => {
        // Register for push notifications
        if (token) {
          registerForPushNotificationsAsync();
        }
      }, [token]);
    
  


  const dispatch = useDispatch();

  
   
  
  useEffect(() => {
    const fetchUnreadMessages = async () => {
      try {
        if (!token) {
          // console.error('No token found, user may need to log in.');
          return; // Exit if there's no token
        }
  

        const response = await fetch(`${ApiUrl}/unread_messages`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        // Check if the response is successful
        if (!response.ok) {
          
          return;
        }
  
        // Check if the response is in JSON format
        const contentType = response.headers.get("Content-Type");
        if (!contentType || !contentType.includes("application/json")) {
          // console.error('Error: Expected JSON, but received something else.');
          return; // Exit if the response is not JSON
        }
  
        // Parse JSON only if it's valid
        const data = await response.json();
        setUnreadMessagesCount(data.unreadCount || 0);
  
      } catch (error) {
        console.log('Error fetching unread messages:', error);
      }
    };
  
    fetchUnreadMessages();
  
    const interval = setInterval(fetchUnreadMessages, 4000); // Poll every 4 seconds
  
    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, [token]);
  
  
  
  // Fetch user details only if not already fetched
  const fetchUserDetails = useCallback(async () => {
    if (!user) {
      await dispatch(getUserDetails());
    }
  }, [dispatch, user]);

  useEffect(() => {
    fetchUserDetails();
  }, [fetchUserDetails]);



  return (
    <NavigationContainer ref={navigationRef}>
    

     

{token && <FCMHandler />}

      {/* navigation here */}
         {token && user?.role === 11 && <DriverLocationUpdater driverId={user?._id} /> }

        


      <Tab.Navigator
      screenOptions={{
        headerShown: false  // This hides all tab level headers
      }}
      >
    
         <Tab.Screen
          name="Home"
          component={HomeBar}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="home-outline" size={size} color={color} />
            ),
          }}
        /> 

          
        

        {
          token && (
        
        <Tab.Screen
  name="Inbox"
  component={MessagingStack}
  options={{
    tabBarIcon: ({ color, size }) => (
      <Icon name="mail-outline" size={size} color={color} />
    ),
    tabBarBadge: unreadMessagesCount > 0 ? unreadMessagesCount : null,
  }}
/>
          )
        }

        {/* Conditional rendering for Driver tab */}
        {token && user?.role === 11 && (
        

           <Tab.Screen
           name="Driver"
         component={DriverStack}
           options={{
             tabBarIcon: ({ color, size }) => (
               <Icon name="person-outline" size={size} color={color} />
             ),
           }}
      
    
           /> )}
      

       
        {/* Authentication Tab */}
        {token ? (
          <Tab.Screen
            name="LOGOUT"
            component={LogsOut}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Icon name="log-out-outline" size={size} color={color} />
              ),
            }}
          />
        ) : (
          <Tab.Screen
            name="Log In"
            component={AuthStack} // Auth Stack (Login and Register)
            options={{
              tabBarIcon: ({ color, size }) => (
                <Icon name="log-in-outline" size={size} color={color} />
              ),
            }}
          />
        )}
      </Tab.Navigator>
      
    </NavigationContainer>
  );
}

export default AppNavigator;
