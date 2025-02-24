import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView, Image, ActivityIndicator } from 'react-native';
import { ApiUrl } from '../../helpers/ApiUrl';


export default function ForgotPassword({navigation}) {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false); // Loading state
    const[message, setMessage] = useState("")
    


    const handleForgot = async() => {
        if(!email) {
            Alert.alert("Field cannot be empty")
        }

        setLoading(true); // Start loading
 
        try {


        let items = {
            email
        }

        const response = await axios.post(`${ApiUrl}/user_forgot_password`, items)
        setMessage(response.data.msg)

        
      
      }

        catch (error) {
                        Alert.alert("Error", " Please try again.");
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

    


    <Text style={styles.title}>Write Your Email</Text>

    <Text style={{ fontWeight: 'bold', textAlign: 'center', color: '#555', marginBottom: 15, marginTop: 15 }}>
      A code will be sent to your email to RESET your password. 
    </Text>
    

    <TextInput
      style={styles.input}
      placeholder="Email Address"
      value={email}
      onChangeText={setEmail}
      keyboardType="email-address"
    />
    
            
    <TouchableOpacity style={styles.button} onPress={handleForgot}>
      {loading ? (
                         <ActivityIndicator size="small" color="#fff" />
                       ) : (
                        <Text style={styles.buttonText}>Request Code</Text>
                      
                       )}
      


      
    </TouchableOpacity>

    {
      message && (
    
        <TouchableOpacity style={{marginTop: 23, alignItems: "center"}} onPress={() => navigation.navigate('ResetPassword')}>
          <Text style={{textAlign: "center", fontWeight: "bold", color: "red",   fontSize: 18, 
      marginVertical: 10 
    }}>
            {message}
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
  });
  
