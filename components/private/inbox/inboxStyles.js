import { StyleSheet } from "react-native";


export const styles = {
    container: {
      flex: 1,
      backgroundColor: '#F6F6F6',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      backgroundColor: 'white',
      borderBottomWidth: 1,
      borderBottomColor: '#E5E5E5',
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#1A1A1A',
    },
    newMessageButton: {
      padding: 8,
    },
    messageItem: {
      flexDirection: 'row',
      padding: 16,
      backgroundColor: 'white',
      borderBottomWidth: 1,
      borderBottomColor: '#E5E5E5',
    },
    avatarContainer: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: '#007AFF',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    avatarText: {
      color: 'white',
      fontSize: 20,
      fontWeight: 'bold',
    },
    messageContent: {
      flex: 1,
      justifyContent: 'center',
    },
    userName: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#1A1A1A',
      marginBottom: 4,
    },
    lastMessageContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    youText: {
      fontSize: 14,
      color: '#666666',
      fontWeight: '500',
    },
    lastMessage: {
      fontSize: 14,
      color: '#666666',
      flex: 1,
    },
    timestamp: {
      fontSize: 12,
      color: '#999999',
      marginTop: 4,
    },
    emptyContainer: {
      padding: 24,
      alignItems: 'center',
    },
    emptyText: {
      fontSize: 16,
      color: '#666666',
    },
    loadingContainer: {
      padding: 16,
      alignItems: 'center',
    },
  };