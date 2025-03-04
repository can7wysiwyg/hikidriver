import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  Image,
  Animated,
  Easing
} from 'react-native';
import { 
  FontAwesome, 
  MaterialIcons,
  Ionicons
} from '@expo/vector-icons';

const PaymentSystems = ({ onSelect, selectedPayment = null }) => {
  const [selected, setSelected] = useState(selectedPayment);
  const [airtelScale] = useState(new Animated.Value(1));
  const [mpambaScale] = useState(new Animated.Value(1));

  const handleSelect = (paymentType) => {
    setSelected(paymentType);
    
    // Animate the selected payment method
    if (paymentType === 'airtel_money') {
      Animated.sequence([
        Animated.timing(airtelScale, {
          toValue: 1.05,
          duration: 150,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic)
        }),
        Animated.timing(airtelScale, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
          easing: Easing.in(Easing.cubic)
        })
      ]).start();
      mpambaScale.setValue(1);
    } else {
      Animated.sequence([
        Animated.timing(mpambaScale, {
          toValue: 1.05,
          duration: 150,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic)
        }),
        Animated.timing(mpambaScale, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
          easing: Easing.in(Easing.cubic)
        })
      ]).start();
      airtelScale.setValue(1);
    }
    
    // Call the onSelect callback
    if (onSelect) {
      onSelect(paymentType);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Set Payment Method</Text>
      
      <View style={styles.paymentOptionsContainer}>
        {/* AirtelMoney Option */}
        <Animated.View 
          style={[
            styles.paymentCard,
            { transform: [{ scale: airtelScale }] },
            selected === 'airtel_money' && styles.selectedCard
          ]}
        >
          <TouchableOpacity 
            style={styles.paymentCardInner}
            onPress={() => handleSelect('airtel_money')}
            activeOpacity={0.7}
          >
            <View style={styles.paymentCardContent}>
              <View style={[styles.logoContainer, styles.airtelLogoContainer]}>
                <FontAwesome name="money" size={24} color="#FF0000" style={styles.mainIcon} />
              </View>
              <Text style={styles.paymentName}>AirtelMoney</Text>
              <Text style={styles.paymentDescription}>Fast, secure mobile payments</Text>
              
              <View style={styles.paymentInfoRow}>
                <MaterialIcons name="verified" size={14} color="#4CAF50" />
                <Text style={styles.infoText}>Instant transfer</Text>
              </View>
              
              <View style={styles.paymentInfoRow}>
                <MaterialIcons name="security" size={14} color="#455A64" />
                <Text style={styles.infoText}>Protected payment</Text>
              </View>
            </View>
            
            {selected === 'airtel_money' && (
              <View style={styles.checkmarkContainer}>
                <Ionicons name="checkmark-circle" size={24} color="#FFC107" />
              </View>
            )}
          </TouchableOpacity>
        </Animated.View>

        {/* TNM Mpamba Option */}
        <Animated.View 
          style={[
            styles.paymentCard,
            { transform: [{ scale: mpambaScale }] },
            selected === 'tnm_mpamba' && styles.selectedCard
          ]}
        >
          <TouchableOpacity 
            style={styles.paymentCardInner}
            onPress={() => handleSelect('tnm_mpamba')}
            activeOpacity={0.7}
          >
            <View style={styles.paymentCardContent}>
              <View style={[styles.logoContainer, styles.mpambaLogoContainer]}>
                <FontAwesome name="credit-card" size={24} color="#0078D7" style={styles.mainIcon} />
              </View>
              <Text style={styles.paymentName}>TNM Mpamba</Text>
              <Text style={styles.paymentDescription}>Convenient mobile wallet</Text>
              
              <View style={styles.paymentInfoRow}>
                <MaterialIcons name="access-time" size={14} color="#455A64" />
                <Text style={styles.infoText}>Quick transactions</Text>
              </View>
              
              <View style={styles.paymentInfoRow}>
                <MaterialIcons name="confirmation-number" size={14} color="#455A64" />
                <Text style={styles.infoText}>No hidden fees</Text>
              </View>
            </View>
            
            {selected === 'tnm_mpamba' && (
              <View style={styles.checkmarkContainer}>
                <Ionicons name="checkmark-circle" size={24} color="#FFC107" />
              </View>
            )}
          </TouchableOpacity>
        </Animated.View>
      </View>
      
      {selected && (
        <TouchableOpacity 
          style={styles.continueButton}
          activeOpacity={0.8}
        >
          <Text style={styles.continueText}>Continue with {selected === 'airtel_money' ? 'AirtelMoney' : 'TNM Mpamba'}</Text>
          <MaterialIcons name="arrow-forward" size={20} color="#333" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginVertical: 10,
    marginHorizontal: 5,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  paymentOptionsContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  paymentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 3,
    marginVertical: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  selectedCard: {
    borderColor: '#FFC107',
    borderWidth: 2,
    shadowColor: '#FFC107',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  paymentCardInner: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentCardContent: {
    flex: 1,
  },
  logoContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  airtelLogoContainer: {
    backgroundColor: '#FFEBEE',
  },
  mpambaLogoContainer: {
    backgroundColor: '#E3F2FD',
  },
  mainIcon: {
    marginTop: 2,
  },
  paymentName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  paymentDescription: {
    fontSize: 13,
    color: '#666',
    marginBottom: 10,
  },
  paymentInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  infoText: {
    fontSize: 12,
    color: '#555',
    marginLeft: 5,
  },
  checkmarkContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 15,
  },
  continueButton: {
    backgroundColor: '#FFC107',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 25,
    marginTop: 10,
  },
  continueText: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 8,
  }
});

export default PaymentSystems