import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#f5f5f5",
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      padding: 16,
      color: "#2c3e50",
    },
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 40,
    },
    emptyText: {
      marginTop: 10,
      fontSize: 16,
      color: "#95a5a6",
    },
    // Shared taxi styles
    sharedContainer: {
      padding: 12,
      flexGrow: 1,
    },
    taxiInfoContainer: {
      backgroundColor: "#fff",
      borderRadius: 8,
      padding: 16,
      marginBottom: 12,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,
      elevation: 3,
    },
    taxiInfoHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
    },
    taxiCapacityText: {
      fontSize: 16,
      fontWeight: "500",
      marginLeft: 8,
      color: "#34495e",
    },
    bookingsHeader: {
      fontSize: 18,
      fontWeight: "bold",
      marginTop: 8,
      color: "#2c3e50",
    },
    bookingItem: {
      backgroundColor: "#fff",
      borderRadius: 8,
      padding: 16,
      marginBottom: 12,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,
      elevation: 3,
    },
    bookingInfo: {
      flex: 1,
    },
    locationRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
    },
    locationText: {
      fontSize: 15,
      marginLeft: 8,
      color: "#34495e",
    },
    codeRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    codeText: {
      fontSize: 14,
      marginLeft: 8,
      color: "#9b59b6",
      fontWeight: "500",
    },
    startButton: {
      backgroundColor: "purple",
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 4,
    },
    deboardButton: {
      backgroundColor: "#e74c3c",
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 4,
    },
    deboardButtonText: {
      color: "#fff",
      fontWeight: "500",
    },
    // Non-shared taxi styles
    nonSharedContainer: {
      padding: 12,
      flexGrow: 1,
    },
    requestCard: {
      backgroundColor: "#fff",
      borderRadius: 8,
      padding: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    requestHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 16,
    },
    requestTitle: {
      fontSize: 18,
      fontWeight: "bold",
      marginLeft: 8,
      color: "#2c3e50",
      flex: 1,
    },
    statusBadge: {
      backgroundColor: "#3498db",
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
    },
    statusText: {
      color: "#fff",
      fontSize: 12,
      fontWeight: "500",
      textTransform: "capitalize",
    },
    requestDetails: {
      marginBottom: 16,
    },
    detailRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: 12,
    },
    locationDetail: {
      marginLeft: 12,
      flex: 1,
    },
    locationLabel: {
      fontSize: 14,
      color: "#7f8c8d",
    },
    locationValue: {
      fontSize: 16,
      color: "#34495e",
      marginTop: 2,
    },
    locationConnector: {
      marginLeft: 10,
      height: 20,
      alignItems: "center",
    },
    verticalLine: {
      width: 1,
      height: "100%",
      backgroundColor: "#bdc3c7",
    },
    tripInfo: {
      flexDirection: "row",
      marginTop: 12,
      justifyContent: "space-between",
    },
    tripInfoItem: {
      flexDirection: "row",
      alignItems: "center",
    },
    tripInfoText: {
      marginLeft: 6,
      fontSize: 14,
      color: "#7f8c8d",
    },
  });
  