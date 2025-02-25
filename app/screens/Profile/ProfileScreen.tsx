import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../utils/supabase';

export const ProfileScreen = () => {
  const { signOut, session } = useAuth();
  const [profile, setProfile] = useState({
    fullName: 'Sarah Johnson',
    username: 'sarahj',
    bio: 'Outdoor enthusiast and yoga instructor passionate about community activities.',
    location: 'San Francisco, CA',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
  });
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    activitiesJoined: 8,
    activitiesHosted: 3,
    connections: 16,
  });
  const [notifications, setNotifications] = useState(true);
  const [locationSharing, setLocationSharing] = useState(true);

  // Fetch user profile data
  useEffect(() => {
    if (session?.user) {
      fetchUserProfile();
    }
  }, [session]);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      // In a real app, we'd fetch this from Supabase
      // For now, we'll just use the mock data after a delay
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setLoading(true);
      await signOut();
    } catch (error) {
      Alert.alert('Error signing out', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'Profile editing coming soon!');
  };

  if (loading && !profile) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Profile</Text>
        <TouchableOpacity style={styles.settingsButton} onPress={handleEditProfile}>
          <Ionicons name="settings-outline" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <ScrollView>
        <View style={styles.profileHeader}>
          <Image
            source={{ uri: profile.avatar }}
            style={styles.avatar}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{profile.fullName}</Text>
            <Text style={styles.username}>@{profile.username}</Text>
            <Text style={styles.location}>
              <Ionicons name="location-outline" size={16} color="#666" />
              {' '}{profile.location}
            </Text>
          </View>
        </View>

        <View style={styles.bioSection}>
          <Text style={styles.bioText}>{profile.bio}</Text>
        </View>

        <View style={styles.statsSection}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.activitiesJoined}</Text>
            <Text style={styles.statLabel}>Activities Joined</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.activitiesHosted}</Text>
            <Text style={styles.statLabel}>Activities Hosted</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.connections}</Text>
            <Text style={styles.statLabel}>Connections</Text>
          </View>
        </View>

        <View style={styles.sectionTitle}>
          <Text style={styles.sectionTitleText}>Settings</Text>
        </View>

        <View style={styles.settingsSection}>
          <View style={styles.settingItem}>
            <View style={styles.settingItemLeft}>
              <Ionicons name="notifications-outline" size={24} color="#007AFF" style={styles.settingIcon} />
              <Text style={styles.settingLabel}>Notifications</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={notifications ? '#007AFF' : '#f4f3f4'}
            />
          </View>
          
          <View style={styles.settingDivider} />
          
          <View style={styles.settingItem}>
            <View style={styles.settingItemLeft}>
              <Ionicons name="location-outline" size={24} color="#007AFF" style={styles.settingIcon} />
              <Text style={styles.settingLabel}>Location Sharing</Text>
            </View>
            <Switch
              value={locationSharing}
              onValueChange={setLocationSharing}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={locationSharing ? '#007AFF' : '#f4f3f4'}
            />
          </View>
          
          <View style={styles.settingDivider} />
          
          <TouchableOpacity style={styles.settingItem} onPress={() => Alert.alert('Help & Support', 'Coming soon!')}>
            <View style={styles.settingItemLeft}>
              <Ionicons name="help-circle-outline" size={24} color="#007AFF" style={styles.settingIcon} />
              <Text style={styles.settingLabel}>Help & Support</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
          
          <View style={styles.settingDivider} />
          
          <TouchableOpacity style={styles.settingItem} onPress={() => Alert.alert('Privacy Policy', 'Coming soon!')}>
            <View style={styles.settingItemLeft}>
              <Ionicons name="lock-closed-outline" size={24} color="#007AFF" style={styles.settingIcon} />
              <Text style={styles.settingLabel}>Privacy Policy</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.signOutButton} 
          onPress={handleSignOut}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.signOutButtonText}>Sign Out</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  settingsButton: {
    padding: 5,
  },
  profileHeader: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 20,
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  username: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  bioSection: {
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  bioText: {
    fontSize: 16,
    lineHeight: 22,
    color: '#333',
  },
  statsSection: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 15,
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#e0e0e0',
    height: '70%',
    alignSelf: 'center',
  },
  sectionTitle: {
    padding: 15,
    paddingBottom: 10,
  },
  sectionTitleText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  settingsSection: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: 15,
    marginBottom: 20,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
  },
  settingDivider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 15,
  },
  signOutButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    padding: 15,
    margin: 15,
    marginBottom: 30,
    alignItems: 'center',
  },
  signOutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
}); 