import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView, Image, View, ActivityIndicator } from 'react-native';
import { ApiUrl } from '../../helpers/ApiUrl';
import Icon from "react-native-vector-icons/Ionicons"; 



export default function ResetPassword({navigation}) {
    const [email, setEmail] = useState("");
    const [newPassword, setNew] = useState("")
    const [code, setCode] = useState("")
    const [loading, setLoading] = useState(false); // Loading state
    const[message, setMessage] = useState("")
    const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
    


    const handleReset = async() => {
        if(!email || !newPassword || !code) {
            Alert.alert("Fields cannot be empty")
        }

        setLoading(true); // Start loading

        try {


        let items = {
            email,
            newPassword,
            code
        }

        const response = await axios.post(`${ApiUrl}/reset_password`, items)
        alert(response.data.msg)
        setMessage(response.data.msg) 
      
      } catch (error) {
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
    <Text style={styles.title}>Reset Password</Text>

    <Text style={{ fontWeight: 'bold', textAlign: 'center', color: '#555', marginBottom: 15, marginTop: 15 }}>
      Check your email for the  code to change your password account.
    </Text>

    <TextInput
      style={styles.input}
      placeholder="Email Address"
      value={email}
      onChangeText={setEmail}
      keyboardType="email-address"
    />


<TextInput
        style={styles.input}
                placeholder="New Password"
                value={newPassword}
                onChangeText={setNew}
                secureTextEntry={true}
            />


              {/* Password Field with Toggle Visibility */}
                                    <View style={styles.passwordContainer}>
                                <TextInput
                                  style={styles.passwordInput}
                                  placeholder="Password"
                                  value={newPassword}
                                  onChangeText={setNew}
                                  secureTextEntry={!showPassword} // Toggle visibility
                                  editable={false}
                    
                                />
                                <TouchableOpacity
                                  onPress={() => setShowPassword(!showPassword)}
                                  style={styles.eyeIcon}
                                >
                                  <Icon
                                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                                    size={20}
                                    color="#888"
                                  />
                                </TouchableOpacity>
                              </View>
                       


<TextInput
      style={styles.input}
      placeholder="Enter Code Sent To Email"
      value={code}
      onChangeText={setCode}
    
    />
   
    
            
    <TouchableOpacity style={styles.button} onPress={handleReset}>
         
          {loading ? (
                   <ActivityIndicator size="small" color="#fff" />
                 ) : (
                  <Text style={styles.buttonText}>Reset</Text>
                
                 )}

      
    </TouchableOpacity>


    {
          message && (
        
            <TouchableOpacity style={{marginTop: 23, alignItems: "center"}} onPress={() => navigation.navigate('Login')}>
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
    passwordContainer: {
      width: "90%", // Match the width of other inputs
      height: 50,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#fff",
      borderBottomWidth: 1,
      borderColor: "#ccc",
      borderRadius: 5,
      paddingHorizontal: 10,
      marginBottom: 15,
    },
    eyeIcon: {
      marginLeft: 10,
    },
  
  });
  
