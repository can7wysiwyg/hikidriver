import { StyleSheet } from "react-native";


export const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f8f9fa',
    },
    header: {
      backgroundColor: '#ffffff',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#eeeeee',
    },
    headerContent: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#333333',
    },
    onlineContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    onlineText: {
      marginRight: 8,
      fontSize: 16,
      color: '#333333',
    },
    summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: 8,
    },
    summaryItem: {
      alignItems: 'center',
      paddingHorizontal: 16,
    },
    summaryValue: {
      fontSize: 18,
      fontWeight: 'bold',
      marginTop: 4,
      color: '#333333',
    },
    summaryLabel: {
      fontSize: 14,
      color: '#757575',
    },
    content: {
      flex: 1,
      padding: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 16,
      marginTop: 8,
      color: '#333333',
    },
    actionGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginBottom: 24,
    },
    actionItem: {
      width: '48%',
      backgroundColor: '#ffffff',
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      alignItems: 'center',
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
    },
    actionIcon: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: '#f5faf9',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 8,
    },
    actionText: {
      fontSize: 14,
      color: '#333333',
      fontWeight: '500',
    },
    tripSummary: {
      marginBottom: 24,
    },
    summaryCard: {
      backgroundColor: '#ffffff',
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
    },
    summaryCardContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    summaryCardText: {
      marginLeft: 16,
    },
    summaryCardTitle: {
      fontSize: 14,
      color: '#757575',
    },
    summaryCardValue: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#333333',
      marginTop: 2,
    },
    noRideContainer: {
      backgroundColor: '#ffffff',
      borderRadius: 12,
      padding: 24,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
      marginBottom: 30
    },
    noRideText: {
      fontSize: 24,
      color: '#333333',
      marginTop: 12,
    },
    offlineMessage: {
      backgroundColor: '#ffffff',
      borderRadius: 12,
      padding: 24,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
    },
    offlineText: {
      fontSize: 16,
      color: '#757575',
      marginTop: 12,
    },
  
  });
  
  