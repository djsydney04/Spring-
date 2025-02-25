import React from 'react';
import { View, StyleSheet, Text, Platform, Image } from 'react-native';
import { SvgProps } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';

// Import all SVG icons - using try/catch to handle potential errors gracefully
let BookmarkIcon: React.FC<SvgProps> | undefined;
let BookmarkFillIcon: React.FC<SvgProps> | undefined;
let DiscoverIcon: React.FC<SvgProps> | undefined;
let DiscoverFillIcon: React.FC<SvgProps> | undefined;
let ActivityIcon: React.FC<SvgProps> | undefined;
let ActivityFillIcon: React.FC<SvgProps> | undefined;

try {
  BookmarkIcon = require('../../MenuItems/bookmark.svg').default;
  BookmarkFillIcon = require('../../MenuItems/bookmark.fill.svg').default;
  DiscoverIcon = require('../../MenuItems/rectangle.stack.svg').default;
  DiscoverFillIcon = require('../../MenuItems/rectangle.stack.fill.svg').default;
  ActivityIcon = require('../../MenuItems/plus.square.on.square.svg').default;
  ActivityFillIcon = require('../../MenuItems/plus.square.fill.on.square.fill.svg').default;
} catch (error) {
  console.warn('Error loading SVG icons:', error);
}

type IconType = 'bookmark' | 'discover' | 'activity' | 'chat' | 'profile';
type IoniconsName = 'bookmark' | 'bookmark-outline' | 'layers' | 'layers-outline' 
  | 'add-circle' | 'add-circle-outline' | 'chatbubble' | 'chatbubble-outline' 
  | 'person-circle' | 'person-circle-outline' | 'ellipse' | 'square-outline' | 'square';

interface TabBarIconProps {
  name: IconType;
  color: string;
  focused: boolean;
  size?: number;
  style?: any;
}

export const TabBarIcon: React.FC<TabBarIconProps> = ({ 
  name, 
  color, 
  focused, 
  size = 24,
  style
}) => {
  // Fallback to Ionicons if SVG loading failed
  if (!BookmarkIcon || !DiscoverIcon || !ActivityIcon) {
    // Map names to Ionicons
    const getIoniconName = (): IoniconsName => {
      switch (name) {
        case 'bookmark':
          return focused ? 'bookmark' : 'bookmark-outline';
        case 'discover':
          return focused ? 'square' : 'square-outline'; // Using square for SF Symbol-like appearance
        case 'activity':
          return focused ? 'add-circle' : 'add-circle-outline';
        case 'chat':
          return focused ? 'chatbubble' : 'chatbubble-outline';
        case 'profile':
          return focused ? 'person-circle' : 'person-circle-outline';
        default:
          return 'ellipse';
      }
    };

    return (
      <View style={[styles.container, style]}>
        <Ionicons name={getIoniconName()} size={size} color={color} />
      </View>
    );
  }

  // Use SVG icons if available
  const IconComponent = (() => {
    switch (name) {
      case 'bookmark':
        return focused ? BookmarkFillIcon : BookmarkIcon;
      case 'discover':
        return focused ? DiscoverFillIcon : DiscoverIcon;
      case 'activity':
        return focused ? ActivityFillIcon : ActivityIcon;
      case 'chat':
        return null; // Use Ionicons for chat
      case 'profile':
        return null; // Use Ionicons for profile
      default:
        return BookmarkIcon;
    }
  })();

  if (name === 'chat' || name === 'profile' || !IconComponent) {
    // For chat and profile or if component is null, use Ionicons
    const iconName: IoniconsName = name === 'chat' 
      ? (focused ? 'chatbubble' : 'chatbubble-outline')
      : (focused ? 'person-circle' : 'person-circle-outline');

    return (
      <View style={[styles.container, style]}>
        <Ionicons name={iconName} size={size} color={color} />
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <IconComponent width={size} height={size} fill={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
}); 