import { StyleSheet, Dimensions } from "react-native";

const{height, width } = Dimensions.get('window');

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f8f9fa',
    },
    backgroundImage: {
      flex: 1,
      width: '100%',
      backgroundColor: 'white',
    },
    scrollViewContent: {
      flexGrow: 1,
      minHeight: height,
    },
    content: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 20,
      paddingTop: 40,
      paddingBottom: 40,
    },
    logoContainer: {
      alignItems: 'center',
      marginTop: 30,
    },
    logoText: {
      fontSize: 36,
      fontWeight: 'bold',
      color: '#222',
    },
    logoHighlight: {
      color: 'purple',
    },
    tagline: {
      color: '#555',
      fontSize: 16,
      marginTop: 5,
    },
    taxiIconContainer: {
      width: 120,
      height: 120,
      backgroundColor: '#FFC107',
      borderRadius: 60,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 20,
    },
    featuresContainer: {
      width: '100%',
      marginVertical: 20,
    },
    featureItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 12,
    },
    featureIconContainer: {
      width: 40,
      height: 40,
      backgroundColor: '#f0f0f0',
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 15,
    },
    featureTextContainer: {
      flex: 1,
    },
    featureTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#333',
    },
    featureDescription: {
      fontSize: 14,
      color: '#777',
      marginTop: 2,
    },
    buttonsContainer: {
      width: '100%',
      marginTop: 20,
      marginBottom: 20,
    },
    primaryButton: {
      backgroundColor: 'purple',
      paddingVertical: 15,
      borderRadius: 25,
      alignItems: 'center',
      marginBottom: 15,
    },
    primaryButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
    dividerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 15,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: '#ddd',
    },
    dividerText: {
      paddingHorizontal: 15,
      color: '#888',
      fontSize: 14,
    },
    secondaryButton: {
      backgroundColor: 'transparent',
      paddingVertical: 13,
      borderRadius: 25,
      alignItems: 'center',
      borderWidth: 2,
      borderColor: 'purple',
    },
    secondaryButtonText: {
      color: '#333',
      fontSize: 16,
      fontWeight: 'bold',
    },
    driverMessageContainer: {
      backgroundColor: '#fff8f8',
      borderWidth: 1,
      borderColor: '#ffcccb',
      borderRadius: 12,
      padding: 20,
      marginVertical: 16,
      alignItems: 'center',
    },
    driverMessageTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#e63946',
      marginBottom: 12,
      textAlign: 'center',
    },
    driverMessageText: {
      fontSize: 16,
      color: '#333333',
      textAlign: 'center',
      marginBottom: 16,
      lineHeight: 22,
    },
    supportButton: {
      backgroundColor: '#3a86ff',
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
      marginTop: 8,
    },
    supportButtonText: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: '600',
      textAlign: 'center',
    }
  });
  