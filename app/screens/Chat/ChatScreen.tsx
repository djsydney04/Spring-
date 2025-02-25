import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// Sample conversation data
const CONVERSATIONS = [
  {
    id: 1,
    title: 'Hiking at Marin Headlands',
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aGlraW5nfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60',
    lastMessage: 'Is everyone still joining despite the weather forecast?',
    sender: 'John',
    time: '10:34 AM',
    unread: 2,
    participants: 6,
    isGroupChat: true,
  },
  {
    id: 2,
    title: 'Sarah Johnson',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
    lastMessage: 'Looking forward to the yoga session tomorrow!',
    sender: 'Sarah',
    time: 'Yesterday',
    unread: 0,
    participants: 2,
    isGroupChat: false,
  },
  {
    id: 3,
    title: 'Beach Cleanup at Ocean Beach',
    image: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8YmVhY2glMjBjbGVhbnVwfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60',
    lastMessage: 'I\'ll bring extra gloves for everyone who needs them',
    sender: 'You',
    time: 'Wed',
    unread: 0,
    participants: 12,
    isGroupChat: true,
  },
  {
    id: 4,
    title: 'Mike Thompson',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    lastMessage: 'Can you recommend any hiking trails near the city?',
    sender: 'Mike',
    time: 'Mon',
    unread: 0,
    participants: 2,
    isGroupChat: false,
  },
];

interface Conversation {
  id: number;
  title: string;
  image: string;
  lastMessage: string;
  sender: string;
  time: string;
  unread: number;
  participants: number;
  isGroupChat: boolean;
}

export const ChatScreen = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Simulate loading conversations
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setConversations(CONVERSATIONS);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter conversations based on search
  const filteredConversations = conversations.filter(
    (conversation) =>
      conversation.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conversation.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderConversationItem = ({ item }: { item: Conversation }) => (
    <TouchableOpacity style={styles.conversationItem}>
      <View style={styles.avatarContainer}>
        <Image source={{ uri: item.image }} style={styles.avatar} />
        {item.isGroupChat && (
          <View style={styles.groupIndicator}>
            <Ionicons name="people" size={12} color="#FFF" />
          </View>
        )}
      </View>
      <View style={styles.conversationContent}>
        <View style={styles.conversationHeader}>
          <Text style={styles.conversationTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.conversationTime}>{item.time}</Text>
        </View>
        <View style={styles.conversationPreview}>
          <Text style={styles.conversationSender} numberOfLines={1}>
            {item.sender === 'You' ? '' : `${item.sender}: `}
          </Text>
          <Text
            style={[
              styles.conversationMessage,
              item.unread > 0 && styles.unreadMessage,
            ]}
            numberOfLines={1}
          >
            {item.lastMessage}
          </Text>
          {item.unread > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCount}>{item.unread}</Text>
            </View>
          )}
        </View>
        {item.isGroupChat && (
          <Text style={styles.participantCount}>
            {item.participants} participants
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="chatbubble-ellipses-outline" size={60} color="#ccc" />
      <Text style={styles.emptyTitle}>No Conversations Yet</Text>
      <Text style={styles.emptySubtitle}>
        Join activities to chat with participants!
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        <TouchableOpacity style={styles.newChatButton}>
          <Ionicons name="create-outline" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search messages"
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
        />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading conversations...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredConversations}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderConversationItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={renderEmptyComponent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  newChatButton: {
    padding: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 36,
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  list: {
    flexGrow: 1,
  },
  conversationItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 15,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  groupIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#007AFF',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  conversationTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 10,
  },
  conversationTime: {
    fontSize: 14,
    color: '#999',
  },
  conversationPreview: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  conversationSender: {
    fontWeight: '500',
    color: '#333',
  },
  conversationMessage: {
    color: '#666',
    flex: 1,
  },
  unreadMessage: {
    color: '#333',
    fontWeight: '500',
  },
  unreadBadge: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    height: 20,
    minWidth: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  unreadCount: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 5,
  },
  participantCount: {
    color: '#999',
    fontSize: 12,
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    marginTop: 80,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
}); 