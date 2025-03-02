import React from 'react';
import { 
  ScrollView, 
  View, 
  Text, 
  TouchableOpacity, 
  StatusBar, 
  SafeAreaView,
  ImageBackground,
  
} from 'react-native';
import { 
  FontAwesome5, 
  Ionicons, 
  MaterialCommunityIcons, 
  Feather 
} from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { styles } from './homeStyles';




export default function Home ({navigation})  {
  // Get auth token from Redux store
   const { token, user } = useSelector((state) => state.auth);
  // Navigation handlers

  const handleSignIn = () => {
    navigation.navigate('Login');
  };

  const handleContinue = () => {
    navigation.navigate('Taxis');
  };


  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFC107" />
      <ImageBackground 
        source={{ uri: 'https://via.placeholder.com/600x800' }} 
        style={styles.backgroundImage}
        imageStyle={{ opacity: 0.1 }}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            {/* Logo and App Name */}
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>
                Kali<Text style={styles.logoHighlight}>Changu</Text>
              </Text>
              <Text style={styles.tagline}>Your ride, your way</Text>
              <View style={styles.taxiIconContainer}>
                <FontAwesome5 name="taxi" size={60} color="#333" />
              </View>
            </View>

            {/* Features */}
             <View style={styles.featuresContainer}>
              
<View style={styles.featureItem}>
  <View style={styles.featureIconContainer}>
    <MaterialCommunityIcons name="routes" size={22} color="#555" />
  </View>
  <View style={styles.featureTextContainer}>
    <Text style={styles.featureTitle}>Optimized Routes</Text>
    <Text style={styles.featureDescription}>Less traffic, more earnings</Text>
  </View>
</View>


<View style={styles.featureItem}>
  <View style={styles.featureIconContainer}>
    <Ionicons name="stats-chart" size={22} color="#555" />
  </View>
  <View style={styles.featureTextContainer}>
    <Text style={styles.featureTitle}>Earnings Tracker</Text>
    <Text style={styles.featureDescription}>Monitor your income easily</Text>
  </View>
</View>


<View style={styles.featureItem}>
  <View style={styles.featureIconContainer}>
    <MaterialCommunityIcons name="shield-check" size={22} color="#555" />
  </View>
  <View style={styles.featureTextContainer}>
    <Text style={styles.featureTitle}>Driver Protection</Text>
    <Text style={styles.featureDescription}>Insurance coverage on trips</Text>
  </View>
</View>

<View style={styles.featureItem}>
  <View style={styles.featureIconContainer}>
    <Ionicons name="person-circle-outline" size={22} color="#555" />
  </View>
  <View style={styles.featureTextContainer}>
    <Text style={styles.featureTitle}>Passenger Ratings</Text>
    <Text style={styles.featureDescription}>Know who you're picking up</Text>
  </View>
  </View>





              
              


            </View>

            
            <View style={styles.buttonsContainer}>
                
{token ? (
  user?.role !== 11 ? (
    <View style={styles.driverMessageContainer}>

    
    
      <Text style={styles.driverMessageTitle}>Hello {user?.fullname}! Contact The Admin for help!</Text>
      <Text style={styles.driverMessageText}>
        This app is for drivers only! Possibly your account has been suspended.
      </Text>
      <TouchableOpacity 
        style={styles.supportButton}
        
      >
        <Text style={styles.supportButtonText}>Contact Support</Text>
      </TouchableOpacity>



      </View>
    
    
  ) : (
    
    <View style={styles.driverMessageContainer}>
      <Text style={styles.driverMessageTitle}>Welcome {user?.fullname}</Text>
      <Text style={styles.driverMessageText}>
        Use this app to manage your taxi business with us.
      </Text>
      
    </View>
  )
) : (
  
  <>
    
    
    <TouchableOpacity 
      style={styles.secondaryButton}
      onPress={handleSignIn}
    >
      <Text style={styles.secondaryButtonText}>Sign In</Text>
    </TouchableOpacity>
  </>
)}



            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

