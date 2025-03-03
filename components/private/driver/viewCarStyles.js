import { StyleSheet } from "react-native";


export const styles = StyleSheet.create({
    scrollViewContent: {
    flexGrow: 1
    },
    container: {
      backgroundColor: '#fff',
      borderRadius: 12,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
      margin: 16,
    },
    loadingOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(255,255,255,0.7)',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 999,
    },
    photoSection: {
      position: 'relative',
      height: 200,
    },
    carPhoto: {
      width: '100%',
      height: '100%',
    },
    photoEditButton: {
      position: 'absolute',
      bottom: 10,
      right: 10,
      backgroundColor: 'rgba(0,0,0,0.6)',
      borderRadius: 20,
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
    detailsContainer: {
      padding: 16,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
      marginBottom: 16,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333',
    },
    infoSection: {
      marginBottom: 16,
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 8,
    },
    iconContainer: {
      width: 36,
      height: 36,
      backgroundColor: '#f0f8ff',
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    infoText: {
      fontSize: 16,
      color: '#333',
      flex: 1,
    },
    inputField: {
      flex: 1,
      height: 40,
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 4,
      paddingHorizontal: 8,
      fontSize: 16,
    },
    taxiTypeContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
    taxiTypeToggle: {
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: 8,
    },
    toggleText: {
      marginRight: 8,
      fontSize: 16,
      color: '#333',
    },
    taxiTypeText: {
      marginLeft: 8,
      fontSize: 16,
      fontWeight: '500',
    },
    licenseSection: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 16,
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: '#eee',
    },
    licenseText: {
      flex: 1,
      fontSize: 16,
      color: '#0066cc',
      marginLeft: 8,
    },
    saveButton: {
      backgroundColor: '#0066cc',
      borderRadius: 8,
      padding: 12,
      alignItems: 'center',
      marginTop: 8,
      marginBottom: 16,
    },
    saveButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
    routesSection: {
      marginTop: 16,
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: '#eee',
    },
    routeHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    routeTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: '#333',
    },
    routeInput: {
      flexDirection: 'row',
      marginBottom: 16,
    },
    routeInputField: {
      flex: 1,
      height: 40,
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 4,
      paddingHorizontal: 8,
      marginRight: 8,
    },
    addButton: {
      backgroundColor: '#0066cc',
      borderRadius: 4,
      paddingHorizontal: 12,
      justifyContent: 'center',
    },
    addButtonText: {
      color: '#fff',
      fontWeight: '600',
    },
    routePointsList: {
      marginTop: 8,
    },
    routePoint: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 4,
    },
    routePointText: {
      flex: 1,
      fontSize: 15,
      color: '#444',
    },
    noRouteText: {
      fontSize: 15,
      color: '#888',
      fontStyle: 'italic',
      marginTop: 8,
    }
  });