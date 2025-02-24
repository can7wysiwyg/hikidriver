import React, { useState, useEffect } from 'react';
import { Text, TextInput, StyleSheet, TouchableOpacity, Alert, View, ScrollView, Image, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDetails, loginUser } from '../../redux/slices/authSlice';
import Icon from "react-native-vector-icons/Ionicons"; 




const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isButtonLoading, setIsButtonLoading] = useState(false); 
  const [showPassword, setShowPassword] = useState(false); 


  const dispatch = useDispatch();
  const { user, token, error, errorType } = useSelector((state) => state.auth);

    // Watch for authentication errors
    useEffect(() => {
      if (error && errorType === 'LOGIN_ERROR') {
        Alert.alert("Login Failed", error);
        dispatch(clearError());
      }
    }, [error, errorType]);
  
    // Watch for successful authentication
    useEffect(() => {
      if (token && user) {
        navigation.replace("Home"); // Use replace instead of navigate
      }
    }, [token, user, navigation]);
  


  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      Alert.alert("Error", "Please enter a valid email address.");
      return;
    }

    try {
      setIsButtonLoading(true); // Show loader when button is clicked

      await dispatch(loginUser({ email, password })).unwrap();

     
    } catch (error) {
      console.log("my error", error)
      Alert.alert("Error", "Something went wrong. Please try again later.");
    } finally {
      setIsButtonLoading(false); // Hide loader after action completes
    }
  };

  useEffect(() => {
    if (token) {
      dispatch(getUserDetails());
      navigation.navigate("Home"); // Automatically navigate if token exists
    }
  }, [token, dispatch, navigation]);



  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={{
          uri: "https://cdn.icon-icons.com/icons2/2407/PNG/512/uber_icon_146046.png",
        }}
        style={styles.logo}
      />
      <Text style={styles.title}>Login to Your Account</Text>

      <TextInput
        style={styles.input}
        placeholder="Email Address"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />


            {/* Password Field with Toggle Visibility */}
            <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
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


      {/* Button with Loader */}
      <TouchableOpacity
        style={[styles.button, isButtonLoading && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={isButtonLoading} // Disable button during loading
      >
        {isButtonLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color="#FFFFFF" size="small" />
            <Text style={[styles.buttonText, styles.loadingText]}>
              Logging in...
            </Text>
          </View>
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("Register")}
        style={styles.linkButton}
      >
        <Text style={styles.linkText}>Register New Account</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("ForgotPassword")}
        style={styles.linkButton}
      >
        <Text style={styles.linkText}>Forgot Password</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};




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
  buttonDisabled: {
    opacity: 0.7,
  },
 
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginLeft: 10,
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

export default Login;
