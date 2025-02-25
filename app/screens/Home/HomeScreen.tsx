import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
  StatusBar,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// Define an interface for our activity data
interface Activity {
  id: number;
  title: string;
  image: string;
  host: string;
  hostAvatar?: string;
  date: string;
  time: string;
  location: string;
  participants: number;
  maxParticipants: number;
  description: string;
  timeframe?: string; // Adding a timeframe field to group activities
}

// Sample activities data
const ACTIVITIES: Activity[] = [
  {
    id: 1,
    title: 'Biking @ Golden Gate Bridge',
    image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29',
    host: 'Bret',
    hostAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    date: 'Friday',
    time: '9AM',
    location: 'Golden Gate Bridge, San Francisco',
    participants: 5,
    maxParticipants: 10,
    description: 'Biking across the iconic Golden Gate Bridge with breathtaking views of the bay.',
    timeframe: 'This Weekend'
  },
  {
    id: 2,
    title: 'Tennis @ Lisa & Douglas Goldman Tennis Center',
    image: 'https://images.unsplash.com/photo-1531315630201-bb15abeb1653',
    host: 'Thomas',
    hostAvatar: 'https://randomuser.me/api/portraits/men/41.jpg',
    date: 'Monday',
    time: '8PM',
    location: 'Goldman Tennis Center, San Francisco',
    participants: 4,
    maxParticipants: 4,
    description: 'Evening tennis session at the Lisa & Douglas Goldman Tennis Center.',
    timeframe: 'Next Week'
  },
  {
    id: 3,
    title: 'Indoor Rock Climbing @ Mission Cliffs',
    image: 'https://images.unsplash.com/photo-1522163182402-834f871fd851',
    host: 'Jessica',
    hostAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    date: 'Wednesday',
    time: '7PM',
    location: 'Mission Cliffs, San Francisco',
    participants: 3,
    maxParticipants: 8,
    description: 'Indoor climbing session at Mission Cliffs for all skill levels.',
    timeframe: 'Next Week'
  },
];

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.92;
const CARD_HEIGHT = 220;
const CARD_BORDER_RADIUS = 20;

export const HomeScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const insets = useSafeAreaInsets();
  
  // Group activities by timeframe
  const groupedActivities = ACTIVITIES.reduce((groups, activity) => {
    const timeframe = activity.timeframe || 'Upcoming';
    if (!groups[timeframe]) {
      groups[timeframe] = [];
    }
    groups[timeframe].push(activity);
    return groups;
  }, {} as Record<string, Activity[]>);

  // Simulate loading activities
  useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Finding activities near you...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.pageTitle}>My Activities</Text>
          <View style={styles.headerButtons}>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="options" size={30} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="person" size={30} color="#000" />
            </TouchableOpacity>
          </View>
        </View>
        
        {Object.entries(groupedActivities).map(([timeframe, activities]) => (
          <View key={timeframe} style={styles.timeframeSection}>
            <Text style={styles.timeframeTitle}>{timeframe}</Text>
            
            {activities.map(activity => (
              <TouchableOpacity key={activity.id} style={styles.activityCard}>
                <ImageBackground 
                  source={{ uri: activity.image }} 
                  style={styles.activityImage}
                  imageStyle={styles.activityImageStyle}
                >
                  <View style={styles.cardContent}>
                    <Text style={styles.activityTitle}>{activity.title}</Text>
                    
                    <View style={styles.hostContainer}>
                      <Text style={styles.hostedByText}>Hosted by {activity.host}</Text>
                      <Image 
                        source={{ uri: activity.hostAvatar }} 
                        style={styles.hostAvatar} 
                      />
                    </View>
                    
                    <View style={styles.activityDetails}>
                      <View style={styles.detailItem}>
                        <Ionicons name="calendar-outline" size={18} color="white" />
                        <Text style={styles.detailText}>{activity.date} @ {activity.time}</Text>
                      </View>
                    </View>
                  </View>
                  
                  <TouchableOpacity style={styles.shareButton}>
                    <Ionicons name="share-outline" size={24} color="white" />
                  </TouchableOpacity>
                </ImageBackground>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  headerButtons: {
    flexDirection: 'row',
  },
  pageTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#5E7069', // Using the green color from screenshot
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginLeft: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // Extra space for the tab bar
  },
  timeframeSection: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  timeframeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  activityCard: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: CARD_BORDER_RADIUS,
    overflow: 'hidden',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 20,
  },
  activityImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
    flexDirection: 'row',
  },
  activityImageStyle: {
    borderRadius: CARD_BORDER_RADIUS,
  },
  cardContent: {
    justifyContent: 'flex-end',
    flex: 1,
  },
  activityTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  hostContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 10,
  },
  hostedByText: {
    fontSize: 16,
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  hostAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: 'white',
  },
  activityDetails: {
    marginTop: 5,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  detailText: {
    color: 'white',
    fontSize: 14,
    marginLeft: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  shareButton: {
    alignSelf: 'flex-end',
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
  },
}); 