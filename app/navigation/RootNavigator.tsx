import React, { useEffect } from 'react';
import { Text, View, Platform, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { TabBarIcon } from '../components/Icons/TabBarIcon';

// Import screens
import { OnboardingScreen } from '../screens/Onboarding/OnboardingScreen';
import { HomeScreen } from '../screens/Home/HomeScreen';
import { ActivityScreen } from '../screens/Activity/ActivityScreen';
import { BookmarkScreen } from '../screens/Bookmark/BookmarkScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Custom tab bar to ensure we have control over rendering
const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E0E0E0',
          height: Platform.OS === 'ios' ? 80 : 60,
          paddingBottom: Platform.OS === 'ios' ? 25 : 5,
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          elevation: 0, // for Android
          shadowOpacity: 0, // for iOS
          zIndex: 8, // ensure it's visible but not too high
        },
        tabBarShowLabel: true,
        tabBarItemStyle: {
          // Add more space between items
          marginHorizontal: 30, // Increased spacing between tabs
        }
      }}
    >
      <Tab.Screen 
        name="Bookmark" 
        component={BookmarkScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="bookmark" color={color} focused={focused} size={28} />
          ),
          tabBarLabel: ({ color }) => (
            <Text style={{ color, fontSize: 12 }}>Saved</Text>
          )
        }}
      />
      <Tab.Screen 
        name="Discover" 
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={{ transform: [{ rotate: '90deg' }] }}>
              <TabBarIcon name="discover" color={color} focused={focused} size={28} />
            </View>
          ),
          tabBarLabel: ({ color }) => (
            <Text style={{ color, fontSize: 12 }}>Discover</Text>
          )
        }}
      />
      <Tab.Screen 
        name="Activities" 
        component={ActivityScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="activity" color={color} focused={focused} size={28} />
          ),
          tabBarLabel: ({ color }) => (
            <Text style={{ color, fontSize: 12 }}>Activities</Text>
          )
        }}
      />
    </Tab.Navigator>
  );
};

export const RootNavigator = () => {
  const { session, loading } = useAuth();
  
  useEffect(() => {
    console.log('RootNavigator - Auth State:', { session: !!session, loading });
  }, [session, loading]);

  if (loading) {
    console.log('RootNavigator - Loading state');
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  console.log('RootNavigator - Rendering with session:', !!session);
  
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!session ? (
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        ) : (
          <Stack.Screen 
            name="Main" 
            component={MainTabs}
            options={{
              headerShown: false,
              gestureEnabled: false,
            }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}; 