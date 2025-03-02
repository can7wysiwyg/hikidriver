import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Alert
} from 'react-native';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { format } from 'date-fns';
import { MaterialIcons } from '@expo/vector-icons';
import { ApiUrl } from '../../../helpers/ApiUrl';

export default function SingleMessage({ route, navigation }) {
  const { data: conversationId } = route.params;
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [conversation, setConversation] = useState(null);
  const [error, setError] = useState('');
  const { token, user } = useSelector((state) => state.auth);
  const flatListRef = useRef(null);
  const inputRef = useRef(null);

  const fetchMessages = useCallback(async (showLoader = false) => {
    if (!conversationId || !token) return;

    try {
      if (showLoader) setLoading(true);

      const response = await axios.get(
        `${ApiUrl}/get_my_messages/${conversationId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.convo) {
        setConversation(response.data.convo);
        // Only update messages if there are changes
        setMessages(prevMessages => {
          const newMessages = response.data.convo.messages || [];
          if (JSON.stringify(prevMessages) !== JSON.stringify(newMessages)) {
            return newMessages;
          }
          return prevMessages;
        });
      }
    } catch (err) {
      console.error('Fetch messages error:', err);
      setError('Unable to load messages. Please try again.');
    } finally {
      if (showLoader) setLoading(false);
    }
  }, [conversationId, token]);

  useEffect(() => {
    fetchMessages(true);
    
    const pollInterval = setInterval(() => {
      fetchMessages(false);
    }, 5000);

    return () => clearInterval(pollInterval);
  }, [fetchMessages]);

  useEffect(() => {
    if (!conversation?._id || !user?._id) return;

    const markAsRead = async () => {
      try {
        await axios.post(
          `${ApiUrl}/mark_messages_as_read`,
          {
            conversationId: conversation._id,
            userId: user._id
          },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
      } catch (error) {
        console.error('Error marking messages as read:', error);
      }
    };

    markAsRead();
  }, [conversation?._id, user?._id, token]);

  const sendMessage = async () => {
    if (!newMessage.trim() || sending) return;

    const receiverId = conversation?.participants.find(id => id !== user?._id);
    if (!receiverId) {
      Alert.alert('Error', 'Cannot determine message recipient');
      return;
    }

    setSending(true);
    Keyboard.dismiss();

    const messagePayload = {
      conversationId,
      content: newMessage.trim(),
      senderId: user._id,
      receiverId
    };

    try {
      // Optimistically add message
      const optimisticMessage = {
        ...messagePayload,
        _id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        sender: user._id,
        pending: true
      };

      setMessages(prev => [optimisticMessage, ...prev]);
      setNewMessage('');

      const response = await axios.post(
        `${ApiUrl}/send_message`,
        messagePayload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Replace optimistic message with real one
      setMessages(prev => 
        prev.map(msg => 
          msg._id === optimisticMessage._id ? response.data.message : msg
        )
      );
    } catch (err) {
      console.error('Send message error:', err);
      Alert.alert('Error', 'Failed to send message. Please try again.');
      // Remove failed optimistic message
      setMessages(prev => prev.filter(msg => msg._id !== messagePayload._id));
      setNewMessage(messagePayload.content);
    } finally {
      setSending(false);
    }
  };

  const renderMessage = ({ item }) => {
    const isSender = user?._id === item.sender;
    const timestamp = item.timestamp 
      ? format(new Date(item.timestamp), 'h:mm a')
      : '';

    return (
      <View style={[
        styles.messageRow,
        isSender ? styles.outgoingRow : styles.incomingRow
      ]}>
        {!isSender && (
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {conversation?.participants[0]?.fullname?.charAt(0) || '?'}
            </Text>
          </View>
        )}
        
        <View style={[
          styles.messageBubble,
          isSender ? styles.outgoing : styles.incoming,
          item.pending && styles.pendingMessage
        ]}>
          <Text style={[
            styles.messageText,
            isSender ? styles.outgoingText : styles.incomingText
          ]}>
            {item.content}
          </Text>
          <Text style={[
            styles.timestamp,
            isSender ? styles.outgoingTimestamp : styles.incomingTimestamp
          ]}>
            {timestamp}
            {item.pending && ' • Sending...'}
          </Text>
        </View>
      </View>
    );
  };

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => {
            setError('');
            fetchMessages(true);
          }}
        >
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={item => item._id || item.timestamp}
          renderItem={renderMessage}
          inverted
          contentContainerStyle={styles.messageList}
          onEndReached={() => {/* Implement load more */}}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                No messages yet. Start the conversation!
              </Text>
            </View>
          }
        />
      )}

      <View style={styles.inputContainer}>
        <TextInput
          ref={inputRef}
          style={styles.input}
          placeholder="Type a message..."
          value={newMessage}
          onChangeText={setNewMessage}
          multiline
          maxLength={1000}
          returnKeyType="send"
          onSubmitEditing={sendMessage}
        //   blurOnSubmit={false}
        />
        <TouchableOpacity 
          style={[
            styles.sendButton,
            (!newMessage.trim() || sending) && styles.sendButtonDisabled
          ]} 
          onPress={sendMessage}
          disabled={!newMessage.trim() || sending}
        >
            {/* <Send size={24} color={newMessage.trim() && !sending ? "#007AFF" : "#999"} /> */}

            <MaterialIcons
          name="send"
          size={24}
          color={newMessage.trim() && !sending ? "#007AFF" : "#999"} // Dynamic color
        />

 
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#F6F6F6'
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  messageList: {
    paddingHorizontal: 16,
    paddingVertical: 8
  },
  messageRow: {
    flexDirection: 'row',
    marginVertical: 4,
    alignItems: 'flex-end'
  },
  outgoingRow: {
    justifyContent: 'flex-end'
  },
  incomingRow: {
    justifyContent: 'flex-start'
  },
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8
  },
  avatarText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500'
  },
  messageBubble: {
    maxWidth: '75%',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 4
  },
  incoming: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E5EA'
  },
  outgoing: {
    backgroundColor: '#007AFF'
  },
  pendingMessage: {
    opacity: 0.7
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22
  },
  incomingText: {
    color: 'black'
  },
  outgoingText: {
    color: 'white'
  },
  timestamp: {
    fontSize: 12,
    marginTop: 4
  },
  incomingTimestamp: {
    color: '#8E8E93'
  },
  outgoingTimestamp: {
    color: 'rgba(255,255,255,0.7)'
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 8,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    alignItems: 'flex-end'
  },
  input: {
    flex: 1,
    marginRight: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#F6F6F6',
    borderRadius: 20,
    fontSize: 16,
    maxHeight: 100
  },
  sendButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  sendButtonDisabled: {
    opacity: 0.5
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32
  },
  emptyText: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center'
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 16
  },
  retryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#007AFF',
    borderRadius: 8
  },
  retryText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500'
  }
};

