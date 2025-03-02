import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,

} from 'react-native';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { format } from 'date-fns';
import { MaterialIcons} from '@expo/vector-icons';
import { ApiUrl } from '../../../helpers/ApiUrl';
import { styles } from './inboxStyles';


export default function Inbox({ navigation }) {
  const { token, user } = useSelector((state) => state.auth);
  const [inbox, setInbox] = useState([]);
  const [users, setUsers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isPolling, setIsPolling] = useState(true);
  const [isLoading, setIsLoading] = useState(true); // Add loading state for initial fetch

  const fetchConversations = async (isRefreshing = false) => {
    if (!user?._id || !token) return;

    try {
      if (isRefreshing) {
        setRefreshing(true);
      }

      const response = await axios.get(
        `${ApiUrl}/conversations/${user._id}?page=${isRefreshing ? 1 : page}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const newConversations = response.data;

      if (isRefreshing) {
        setInbox(newConversations);
        setPage(1); // Reset page when refreshing
      } else {
        setInbox(prev => {
          const filteredConversations = newConversations.filter(
            newConv => !prev.some(existing => existing._id === newConv._id)
          );
          return [...prev, ...filteredConversations];
        });
      }

      setHasMore(newConversations.length > 0);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setRefreshing(false);
      setLoadingMore(false);
      setIsLoading(false); // Make sure to update loading state
    }
  };

  const fetchUsers = useCallback(async () => {
    if (!token) return;

    try {
      const response = await axios.get(`${ApiUrl}/show_all_users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }, [token]);

  // Run this effect once when component mounts
  useEffect(() => {
    if (user?._id && token) {
      fetchConversations(true); // Initial fetch with refresh logic
      fetchUsers();
    }
  }, [token, user?._id]); // Only re-run if token or user ID changes

  useEffect(() => {
    // Only poll when not loading more or refreshing
    if (isPolling && !loadingMore && !refreshing) {
      const interval = setInterval(() => {
        fetchConversations();
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [isPolling, loadingMore, refreshing, page, token, user?._id]);

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      setLoadingMore(true);
      setPage(prev => prev + 1);
    }
  };

  const getUserById = useCallback((id) => (
    users.find(u => u._id === id) || { fullname: 'Unknown User' }
  ), [users]);

  const renderMessageItem = ({ item }) => {
    const lastMessage = item.lastMessage;
    const senderId = item.messages[item.messages.length - 1]?.sender;
    const otherParticipant = item.participants.find(p => p !== user?._id);
    const otherUser = getUserById(otherParticipant);
    const isCurrentUserLastSender = senderId === user?._id;

    return (
      <TouchableOpacity 
        onPress={() => navigation.navigate('SingleMessage', { data: item._id })}
        style={styles.messageItem}
      >
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {otherUser.fullname.charAt(0).toUpperCase()}
          </Text>
        </View>
        
        <View style={styles.messageContent}>
          <Text style={styles.userName}>{otherUser.fullname}</Text>
          <View style={styles.lastMessageContainer}>
            {isCurrentUserLastSender && (
              <Text style={styles.youText}>You: </Text>
            )}
            <Text style={styles.lastMessage} numberOfLines={1}>
              {lastMessage || 'No messages yet'}
            </Text>
          </View>
          {item.messages[item.messages.length - 1]?.createdAt && (
            <Text style={styles.timestamp}>
              {format(new Date(item.messages[item.messages.length - 1].createdAt), 'MMM d, h:mm a')}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        <TouchableOpacity 
          style={styles.newMessageButton}
          onPress={() => navigation.navigate('NewMessage')} // Assuming there's a NewMessage screen
        >
          <MaterialIcons name="message" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading messages...</Text>
        </View>
      ) : (
        <FlatList
          data={inbox}
          keyExtractor={item => item._id}
          renderItem={renderMessageItem}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => fetchConversations(true)}
              tintColor="#007AFF"
            />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={
            !refreshing && (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No messages yet</Text>
              </View>
            )
          }
          ListFooterComponent={
            loadingMore && (
              <View style={styles.footerLoadingContainer}>
                {/* <ActivityIndicator color="#007AFF" /> */}
              </View>
            )
          }
        />
      )}
    </View>
  );
}

