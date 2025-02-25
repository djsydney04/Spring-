import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// Sample data for saved activities
const THIS_WEEKEND_ACTIVITIES = [
  {
    id: 1,
    title: 'Biking @ Golden Gate Bridge',
    image: 'https://images.unsplash.com/photo-1610136649349-0f646f318053?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8Z29sZGVuJTIwZ2F0ZSUyMGJyaWRnZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60',
    host: 'Bret',
    date: 'Friday @ 9AM',
  },
];

const NEXT_WEEK_ACTIVITIES = [
  {
    id: 2,
    title: 'Tennis @ Lisa & Douglas Goldman Tennis Center',
    image: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dGVubmlzfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60',
    host: 'Thomas',
    date: 'Monday @ 6PM',
    participants: 2,
    maxParticipants: 4,
  },
  {
    id: 3,
    title: 'Rock Climbing @ Mission Cliffs',
    image: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8cm9jayUyMGNsaW1iaW5nfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60',
    host: 'Jessica',
    date: 'Wednesday @ 7PM',
    participants: 3,
    maxParticipants: 6,
  },
];

export const BookmarkScreen = () => {
  const renderActivityCard = (activity) => (
    <TouchableOpacity key={activity.id} style={styles.activityCard}>
      <Image source={{ uri: activity.image }} style={styles.activityImage} />
      <View style={styles.activityOverlay}>
        <Text style={styles.activityTitle}>{activity.title}</Text>
        <View style={styles.activityDetails}>
          <View style={styles.hostContainer}>
            <View style={styles.hostAvatar}>
              <Text style={styles.hostInitial}>{activity.host.charAt(0)}</Text>
            </View>
            <Text style={styles.hostText}>Hosted by {activity.host}</Text>
          </View>
          <View style={styles.dateContainer}>
            <Ionicons name="calendar-outline" size={16} color="#FFF" />
            <Text style={styles.dateText}>{activity.date}</Text>
          </View>
        </View>
      </View>
      <TouchableOpacity style={styles.shareButton}>
        <Ionicons name="share-outline" size={22} color="#007AFF" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Activities</Text>
      </View>
      
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>This Weekend</Text>
        {THIS_WEEKEND_ACTIVITIES.map(activity => renderActivityCard(activity))}
        
        <Text style={styles.sectionTitle}>Next Week</Text>
        {NEXT_WEEK_ACTIVITIES.map(activity => renderActivityCard(activity))}
      </ScrollView>
      
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem}>
          <Ionicons name="bookmark" size={24} color="#007AFF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <Ionicons name="compass-outline" size={24} color="#8E8E93" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <Ionicons name="add-circle-outline" size={24} color="#8E8E93" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4A635D', // Dark green color like in the mockup
  },
  scrollContainer: {
    flex: 1,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 15,
    color: '#333',
  },
  activityCard: {
    height: 180,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  activityImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  activityOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 10,
  },
  activityDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hostContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hostAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  hostInitial: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  hostText: {
    fontSize: 14,
    color: '#FFF',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 14,
    color: '#FFF',
    marginLeft: 6,
  },
  shareButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  tabBar: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#EFEFEF',
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 