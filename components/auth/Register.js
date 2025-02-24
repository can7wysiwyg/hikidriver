import React, { useState, useEffect } from "react";
import { 
    View, 
    Text, 
    TextInput, 
    StyleSheet, 
    TouchableOpacity, 
    Alert, 
    ScrollView, 
    Image 
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { clearError, registerUser } from "../../redux/slices/authSlice";
import Icon from "react-native-vector-icons/Ionicons"; 




const Register = ({navigation}) => {
    const [fullname, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
    const [errorMessage, setErrorMessage] = useState('');

    
    const dispatch = useDispatch()
    const { loading, error } = useSelector((state) => state.auth);


    useEffect(() => {
        if (error) {
            Alert.alert("Registration Error", error);
            dispatch(clearError()); // Clear the error after showing it
        }
    }, [error, dispatch]);




    const handleRegister = async() => {
        // Validation Logic
        if (!fullname || !email || !phone || !password) {
            Alert.alert("Error", "All fields are required.");
            return;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            Alert.alert("Error", "Please enter a valid email address.");
            return;
        }
        if (phone.length !== 10) {
            Alert.alert("Error", "Please enter a valid phone number.");
            return;
        }

        if (password.length <= 6) {
            setErrorMessage('Password must be longer than 6 characters.');
            return ""
          } 



            setErrorMessage('');
            
          



        

        let items = {
            fullname, email, phone, password

        }

        

        try {
             await dispatch(registerUser(items)).unwrap();
        
            // If registration is successful, navigate to verification
            navigation.navigate('RegistrationVeri');
        } catch (err) {
            // Error is already handled by the error state
            console.log('Registration failed');
        }


           
      
         
        
       
        
    };

    
    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Logo */}
            <Image 
                source={{ uri: "https://cdn.icon-icons.com/icons2/2407/PNG/512/uber_icon_146046.png" }} // Use your logo URL here
                style={styles.logo}
            />
            
            <Text style={styles.title}>Create an Account</Text>

            
            <TextInput
                style={styles.input}
                placeholder="Full Name"
                value={fullname}
                onChangeText={setName}
            />
            <TextInput
                style={styles.input}
                placeholder="Email Address"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
            />
            <TextInput
                style={styles.input}
                placeholder="Phone Number"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true}
            />

{errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}


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
            

    
            
            <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>  {loading ? 'Registering...' : 'Register'}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.linkButton}>
                <Text style={styles.linkText}>Already have an account? Log in</Text>
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
    logo: {
        width: 120, // Adjust logo size
        height: 120, // Adjust logo size
        marginBottom: 30, // Space between logo and title
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        color: "#333",
    },
    input: {
        width: "90%", // Increase the width of the input fields
        height: 50,
        backgroundColor: "#fff",
        borderBottomWidth: 1, // Only bottom border
        borderColor: "#ccc", // Light gray border color
        borderRadius: 5, // Optional, to slightly round the corners
        paddingHorizontal: 10,
        fontSize: 16,
        marginBottom: 15,
    },
    button: {
        width: "90%", // Make the button the same width as the inputs
        height: 50,
        backgroundColor: "#000",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 8,
        marginTop: 10,
    },
    error: {
        color: 'red',
        marginBottom: 10,
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
    error: {
        color: 'red',
        marginBottom: 12,
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

export default Register;
