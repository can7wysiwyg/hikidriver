import axios from 'axios';
import React, { useState } from 'react';
import { Text, TextInput, StyleSheet, View, TouchableOpacity, Alert, ScrollView, Image, ActivityIndicator } from 'react-native';
import { ApiUrl } from '../../helpers/ApiUrl';
import { MaterialIcons } from '@expo/vector-icons';



export default function RegistrationVeri({navigation}) {
    const [email, setEmail] = useState("");
    const[verificationCode, setCode] = useState("")
    const[veriMessage, setVeriMsg] = useState()
    const [loading, setLoading] = useState(false); // Loading state



    const handleVeri = async() => {
        if(!email || !verificationCode) {
            Alert.alert("Fields cannot be empty")
        }

        setLoading(true); // Start loading



        try {
          const items = { email, verificationCode };
          const response = await axios.post(`${ApiUrl}/verify_email`, items);
        
          setVeriMsg(response.data.msg);
    
          
          Alert.alert("Success", response.data.msg);
        } catch (error) {
          Alert.alert("Error", "Verification failed. Please try again.");
        } finally {
          setLoading(false); // Stop loading
        }
    
        



    }


  return (
    <ScrollView contentContainerStyle={styles.container}>
    <Image 
      source={{ uri: "https://cdn.icon-icons.com/icons2/2407/PNG/512/uber_icon_146046.png" }} 
      style={styles.logo}
    />
    <Text style={styles.title}>Activate Account</Text>
    <View style={styles.notscontainer}>
      <MaterialIcons name="mail-outline" size={24} color="#3b82f6" style={styles.icon} />
      <Text style={styles.title}>Email Verification Required</Text>
      <Text style={styles.message}>
        Check your email inbox or spam box for the verification code to activate your account.
      </Text>
    </View>

    
    <TextInput
      style={styles.input}
      placeholder="Email Address"
      value={email}
      onChangeText={setEmail}
      keyboardType="email-address"
    />
    <TextInput
      style={styles.input}
      placeholder="Enter Code Sent To Email"
      value={verificationCode}
      onChangeText={setCode}
    
    />

<TouchableOpacity style={styles.button} onPress={handleVeri} disabled={loading}>
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Activate Account</Text>
        )}
      </TouchableOpacity>

            
     
{
  veriMessage && (

    <TouchableOpacity style={{marginTop: 23, alignItems: "center"}} onPress={() => navigation.navigate('Login')}>
      <Text style={{textAlign: "center", fontWeight: "bold", color: "red",   fontSize: 18, 
  marginVertical: 10 
}}>
        {veriMessage}
      </Text>


    </TouchableOpacity>



  )
}
    
    

    </ScrollView>
  )
}


const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      justifyContent: "center", 
      alignItems: "center",     
      padding: 20,
      backgroundColor: "#f9f9f9",
    },
    error: { color: 'red', 
      marginBottom: 12 
    },
  
    logo: {
      width: 120,
      height: 120,
      marginBottom: 30,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 20,
      color: "#333",
    },
    input: {
      width: "90%",
      height: 50,
      backgroundColor: "#fff",
      borderBottomWidth: 1,
      borderColor: "#ccc",
      borderRadius: 5,
      paddingHorizontal: 10,
      fontSize: 16,
      marginBottom: 15,
    },
    button: {
      width: "90%",
      height: 50,
      backgroundColor: "#000",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 8,
      marginTop: 10,
    },
    buttonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
    },
    linkButton: {
      marginTop: 15,
    },
    linkText: {
      color: "#007bff",
      fontSize: 14,
    },
    notscontainer: {
      backgroundColor: '#eff6ff',
      borderRadius: 12,
      padding: 16,
      marginVertical: 16,
      marginHorizontal: 16,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#dbeafe',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    icon: {
      marginBottom: 8,
    },
    title: {
      fontSize: 16,
      fontWeight: '600',
      color: '#1f2937',
      marginBottom: 4,
      textAlign: 'center',
    },
    message: {
      fontSize: 14,
      color: '#4b5563',
      textAlign: 'center',
      lineHeight: 20,
    },

  });
  
