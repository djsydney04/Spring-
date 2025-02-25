import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Dimensions,
  StatusBar,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// Define activity type
interface Activity {
  id: number;
  title: string;
  image: string;
  location: string;
  date: string;
  time?: string;
  participants: number;
  requests?: number;
  notifications?: number;
}

// Sample data for hosted activities
const HOSTED_ACTIVITIES: Activity[] = [
  {
    id: 1,
    title: 'Linda Mar Surf',
    image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8c3VyZnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60',
    location: 'Pacifica, CA',
    date: 'Monday Morning (August 27th)',
    participants: 3,
    requests: 2,
    notifications: 1,
  },
  {
    id: 2,
    title: 'Bouldering @ Stinson Beach',
    image: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8cm9jayUyMGNsaW1iaW5nfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60',
    location: 'Stinson Beach, CA',
    date: 'Wednesday Afternoon (August 28th)',
    participants: 4,
    requests: 1,
    notifications: 3,
  },
  {
    id: 3,
    title: 'Frisbee @ Crissy Field',
    image: 'https://images.unsplash.com/photo-1591331003574-53545af4991c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8ZnJpc2JlZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60',
    location: 'Crissy Field, CA',
    date: 'Friday Afternoon (August 31st)',
    participants: 11,
    requests: 0,
    notifications: 15,
  },
];

// Get screen width for proper image sizing
const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 40; // 20px padding on each side
const CARD_ASPECT_RATIO = 16 / 9;
const CARD_IMAGE_HEIGHT = CARD_WIDTH / CARD_ASPECT_RATIO;

export const ActivityScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [hostedActivities, setHostedActivities] = useState<Activity[]>([]);
  const [error, setError] = useState<string | null>(null);
  const insets = useSafeAreaInsets();

  // Handle create activity press
  const handleCreateActivity = () => {
    Alert.alert(
      "Create Activity",
      "This feature is coming soon!",
      [{ text: "OK" }]
    );
  };

  // Safer load activities implementation using useCallback to prevent recreation on each render
  const loadActivitiesData = useCallback(() => {
    setIsLoading(true);
    setError(null);
    
    // Use a simple timeout - this avoids issues with Promise chains
    const timer = setTimeout(() => {
      setHostedActivities(HOSTED_ACTIVITIES);
      setIsLoading(false);
    }, 1000);
    
    // Return cleanup function to clear timeout if component unmounts
    return () => clearTimeout(timer);
  }, []);

  // Load activities on mount
  useEffect(() => {
    const cleanup = loadActivitiesData();
    return cleanup;
  }, [loadActivitiesData]);

  const handleRetry = () => {
    setIsLoading(true);
    setError(null);
    
    // Simple implementation without try/catch to avoid potential errors
    setTimeout(() => {
      setHostedActivities(HOSTED_ACTIVITIES);
      setIsLoading(false);
    }, 1000);
  };

  const renderActivityItem = ({ item }: { item: Activity }) => (
    <TouchableOpacity style={styles.activityCard}>
      <Image source={{ uri: item.image }} style={styles.activityImage} />
      <View style={styles.activityInfo}>
        <Text style={styles.activityTitle}>{item.title}</Text>
        
        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={16} color="#666" />
          <Text style={styles.locationText}>{item.location}</Text>
        </View>
        
        <View style={styles.dateContainer}>
          <Ionicons name="calendar-outline" size={16} color="#666" />
          <Text style={styles.dateText}>{item.date}</Text>
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Ionicons name="people-outline" size={16} color="#007AFF" />
            <Text style={styles.statText}>{item.participants} person</Text>
          </View>
          
          {item.requests && item.requests > 0 && (
            <View style={styles.statItem}>
              <Ionicons name="person-add-outline" size={16} color="#FF9500" />
              <Text style={styles.statText}>{item.requests} requests</Text>
            </View>
          )}
        </View>

        {item.notifications && item.notifications > 0 && (
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationText}>
              {item.notifications} New Notification{item.notifications > 1 ? 's' : ''}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />
      <Text style={styles.screenTitle}>My Activities</Text>

      <View style={styles.createContainer}>
        <TouchableOpacity 
          style={styles.createButton}
          onPress={handleCreateActivity}
        >
          <Text style={styles.createButtonText}>Create Activity</Text>
          <View style={styles.createButtonIcon}>
            <Ionicons name="add" size={24} color="#FFF" />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.hostedSection}>
        <Text style={styles.sectionTitle}>Hosted Activities</Text>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading activities...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={32} color="#FF3B30" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={handleRetry}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={hostedActivities}
          renderItem={renderActivityItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={[
            styles.listContainer,
            { paddingBottom: insets.bottom + 120 } // Extra padding for tab bar
          ]}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  screenTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4A635D',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
  },
  createContainer: {
    padding: 20,
    paddingBottom: 10,
  },
  createButton: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  createButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginRight: 10,
  },
  createButtonIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  hostedSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A635D', // Dark green color like in the mockup
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFF',
    fontWeight: '600',
  },
  listContainer: {
    padding: 20,
    paddingTop: 10,
  },
  activityCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  activityImage: {
    width: '100%',
    height: CARD_IMAGE_HEIGHT,
    resizeMode: 'cover',
  },
  activityInfo: {
    padding: 15,
    position: 'relative',
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  locationText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  dateText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  notificationBadge: {
    backgroundColor: '#F0F8FF',
    borderRadius: 8,
    padding: 8,
    marginTop: 8,
  },
  notificationText: {
    fontSize: 13,
    color: '#007AFF',
  },
}); 