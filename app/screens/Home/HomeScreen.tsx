import React, { useState, useEffect, useRef } from 'react';
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
  Animated,
  PanResponder,
  Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { SvgXml } from 'react-native-svg';

// Import the SF Symbol SVGs we need
const personIconXml = require('../../../SFSymbolsItems/person.svg');
const sliderIconXml = require('../../../SFSymbolsItems/slider.horizontal.3.svg');

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
}

// Featured activity data
const FEATURED_ACTIVITIES: Activity[] = [
  {
    id: 1,
    title: 'Hike Through the Marin Headlands',
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aGlraW5nfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60',
    host: 'Adam',
    hostAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    date: 'This Weekend',
    time: '9:00 AM',
    location: 'Marin Headlands, CA',
    participants: 5,
    maxParticipants: 10,
    description: 'Anybody want to come for a hike in the Marin headlands on Friday? We\'ll take a moderate 5-mile trail with stunning views of the Golden Gate Bridge and Pacific Ocean. Great for all experience levels. Bring water and comfortable shoes!',
  },
  {
    id: 2,
    title: 'Yoga in Golden Gate Park',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8eW9nYXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60',
    host: 'Sarah',
    hostAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    date: 'Tomorrow',
    time: '8:00 AM',
    location: 'Golden Gate Park, San Francisco',
    participants: 8,
    maxParticipants: 15,
    description: 'Start your morning with a refreshing yoga session in the beautiful surroundings of Golden Gate Park. All levels welcome! We\'ll focus on gentle flows and mindfulness techniques to start your day right. Bring your own mat if you have one, but extras will be available.',
  },
];

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width * 0.92; // 92% of screen width
const CARD_HEIGHT = height * 0.64; // Reduced height to create more space at bottom
const CARD_BORDER_RADIUS = 20;
const SWIPE_THRESHOLD = 120; // How far the card needs to be swiped
const SWIPE_UP_THRESHOLD = 100; // Threshold for upward swipe

export const HomeScreen = () => {
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const insets = useSafeAreaInsets();
  
  // Animation values
  const position = useRef(new Animated.ValueXY()).current;
  const rotate = position.x.interpolate({
    inputRange: [-CARD_WIDTH / 2, 0, CARD_WIDTH / 2],
    outputRange: ['-10deg', '0deg', '10deg'],
    extrapolate: 'clamp',
  });
  
  const likeOpacity = position.x.interpolate({
    inputRange: [25, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  
  const nopeOpacity = position.x.interpolate({
    inputRange: [-100, -25],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });
  
  const infoOpacity = position.y.interpolate({
    inputRange: [-100, -25],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const nextCardScale = position.x.interpolate({
    inputRange: [-CARD_WIDTH / 2, 0, CARD_WIDTH / 2],
    outputRange: [1, 0.8, 1],
    extrapolate: 'clamp',
  });

  // Simulate loading activities
  useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const currentActivity = FEATURED_ACTIVITIES[currentActivityIndex];
  const nextActivityIndex = (currentActivityIndex + 1) % FEATURED_ACTIVITIES.length;
  const nextActivity = FEATURED_ACTIVITIES[nextActivityIndex];

  const handleNextActivity = () => {
    setCurrentActivityIndex((prevIndex) => 
      prevIndex === FEATURED_ACTIVITIES.length - 1 ? 0 : prevIndex + 1
    );
    position.setValue({ x: 0, y: 0 });
  };

  // Setup pan responder for gesture handling
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        position.setValue({ x: gestureState.dx, y: gestureState.dy });
      },
      onPanResponderRelease: (_, gestureState) => {
        // Swiped Right (Yes)
        if (gestureState.dx > SWIPE_THRESHOLD) {
          Animated.timing(position, {
            toValue: { x: CARD_WIDTH * 1.5, y: 0 },
            duration: 300,
            useNativeDriver: false,
          }).start(() => {
            console.log("Liked activity:", currentActivity.title);
            handleNextActivity();
          });
        } 
        // Swiped Left (No)
        else if (gestureState.dx < -SWIPE_THRESHOLD) {
          Animated.timing(position, {
            toValue: { x: -CARD_WIDTH * 1.5, y: 0 },
            duration: 300,
            useNativeDriver: false,
          }).start(() => {
            console.log("Passed on activity:", currentActivity.title);
            handleNextActivity();
          });
        }
        // Swiped Up (More Info)
        else if (gestureState.dy < -SWIPE_UP_THRESHOLD) {
          Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            friction: 5,
            useNativeDriver: false,
          }).start();
          setShowDetails(true);
        }
        // Return to center if not swiped far enough
        else {
          Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            friction: 5,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  const cardStyle = {
    transform: [
      { translateX: position.x },
      { translateY: position.y },
      { rotate },
    ],
  };

  const nextCardStyle = {
    transform: [{ scale: nextCardScale }],
    opacity: 0.6,
  };

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
      
      {/* Header with preferences and profile buttons */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton}>
          <SvgXml xml={sliderIconXml} width={28} height={28} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <SvgXml xml={personIconXml} width={28} height={28} color="#000" />
        </TouchableOpacity>
      </View>
      
      {/* Activity Cards - Stacked with Animation */}
      <View style={styles.cardContainer}>
        {/* Next card (behind) */}
        <Animated.View style={[styles.card, nextCardStyle, styles.nextCard]}>
          <ImageBackground 
            source={{ uri: nextActivity.image }} 
            style={styles.cardImage}
            imageStyle={styles.cardImageStyle}
          >
            <View style={styles.cardContent}>
              <View style={styles.titleContainer}>
                <Text style={styles.activityTitle}>{nextActivity.title}</Text>
              </View>
            </View>
          </ImageBackground>
        </Animated.View>
      
        {/* Current card (top) */}
        <Animated.View 
          style={[styles.card, cardStyle]}
          {...panResponder.panHandlers}
        >
          <ImageBackground 
            source={{ uri: currentActivity.image }} 
            style={styles.cardImage}
            imageStyle={styles.cardImageStyle}
          >
            {/* YES overlay */}
            <Animated.View style={[styles.overlay, styles.likeOverlay, { opacity: likeOpacity }]}>
              <Text style={styles.overlayText}>YES</Text>
            </Animated.View>
            
            {/* NO overlay */}
            <Animated.View style={[styles.overlay, styles.nopeOverlay, { opacity: nopeOpacity }]}>
              <Text style={styles.overlayText}>NOPE</Text>
            </Animated.View>
            
            {/* INFO overlay */}
            <Animated.View style={[styles.overlay, styles.infoOverlay, { opacity: infoOpacity }]}>
              <Text style={styles.overlayText}>INFO</Text>
            </Animated.View>
            
            <View style={styles.cardContent}>
              <View style={styles.titleContainer}>
                <Text style={styles.activityTitle}>{currentActivity.title}</Text>
                
                <View style={styles.hostContainer}>
                  <Text style={styles.hostedByText}>Hosted By {currentActivity.host}</Text>
                  <Image 
                    source={{ uri: currentActivity.hostAvatar }} 
                    style={styles.hostAvatar} 
                  />
                </View>
              </View>
              
              <View style={styles.detailsContainer}>
                <View style={styles.detailRow}>
                  <Ionicons name="location" size={18} color="white" />
                  <Text style={styles.detailText}>{currentActivity.location}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Ionicons name="people" size={18} color="white" />
                  <Text style={styles.detailText}>{currentActivity.participants}-{currentActivity.maxParticipants} People</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Ionicons name="calendar" size={18} color="white" />
                  <Text style={styles.detailText}>{currentActivity.date}</Text>
                </View>
              </View>
            </View>
          </ImageBackground>
        </Animated.View>
      </View>
      
      {/* Indicator line to show position in the slides */}
      <View style={styles.indicatorContainer}>
        {FEATURED_ACTIVITIES.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              { backgroundColor: index === currentActivityIndex ? '#000' : '#E0E0E0' }
            ]}
          />
        ))}
      </View>
      
      {/* Modal for detailed view (shows when swiped up) */}
      <Modal
        visible={showDetails}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowDetails(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{currentActivity.title}</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setShowDetails(false)}
              >
                <Ionicons name="close" size={28} color="#000" />
              </TouchableOpacity>
            </View>
            
            <Image 
              source={{ uri: currentActivity.image }} 
              style={styles.modalImage}
            />
            
            <View style={styles.hostInfoContainer}>
              <Image 
                source={{ uri: currentActivity.hostAvatar }} 
                style={styles.modalHostAvatar} 
              />
              <View style={styles.hostTextContainer}>
                <Text style={styles.modalHostName}>{currentActivity.host}</Text>
                <Text style={styles.modalHostLabel}>Host</Text>
              </View>
              <TouchableOpacity style={styles.messageButton}>
                <Text style={styles.messageButtonText}>Message</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalInfoSection}>
              <View style={styles.modalInfoItem}>
                <Ionicons name="calendar-outline" size={24} color="#007AFF" />
                <View style={styles.modalInfoTextContainer}>
                  <Text style={styles.modalInfoLabel}>Date & Time</Text>
                  <Text style={styles.modalInfoText}>{currentActivity.date}, {currentActivity.time}</Text>
                </View>
              </View>
              
              <View style={styles.modalInfoItem}>
                <Ionicons name="location-outline" size={24} color="#007AFF" />
                <View style={styles.modalInfoTextContainer}>
                  <Text style={styles.modalInfoLabel}>Location</Text>
                  <Text style={styles.modalInfoText}>{currentActivity.location}</Text>
                </View>
              </View>
              
              <View style={styles.modalInfoItem}>
                <Ionicons name="people-outline" size={24} color="#007AFF" />
                <View style={styles.modalInfoTextContainer}>
                  <Text style={styles.modalInfoLabel}>Participants</Text>
                  <Text style={styles.modalInfoText}>{currentActivity.participants} joined / {currentActivity.maxParticipants} max</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionTitle}>About This Activity</Text>
              <Text style={styles.descriptionText}>{currentActivity.description}</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.joinButtonModal}
              onPress={() => {
                console.log("Joined activity:", currentActivity.title);
                setShowDetails(false);
                handleNextActivity();
              }}
            >
              <Text style={styles.joinButtonTextModal}>JOIN THIS ACTIVITY</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  iconButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 90, // Added more bottom margin to center card between bars
  },
  card: {
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
    position: 'absolute',
  },
  nextCard: {
    zIndex: 0,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  cardImageStyle: {
    borderRadius: CARD_BORDER_RADIUS,
  },
  cardContent: {
    padding: 20,
    paddingBottom: 30,
    justifyContent: 'space-between',
    height: '100%',
  },
  titleContainer: {
    marginTop: 'auto',
  },
  activityTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    marginBottom: 10,
  },
  hostContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 20,
  },
  hostAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginLeft: 8,
    borderWidth: 2,
    borderColor: 'white',
  },
  hostedByText: {
    fontSize: 18,
    color: 'white',
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  detailsContainer: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 15,
    padding: 15,
    marginTop: 'auto',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 8,
  },
  overlay: {
    position: 'absolute',
    top: 50,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 3,
    zIndex: 999,
  },
  likeOverlay: {
    right: 20,
    borderColor: '#4CD964',
    backgroundColor: 'rgba(76, 217, 100, 0.3)',
    transform: [{ rotate: '10deg' }],
  },
  nopeOverlay: {
    left: 20,
    borderColor: '#FF3B30',
    backgroundColor: 'rgba(255, 59, 48, 0.3)',
    transform: [{ rotate: '-10deg' }],
  },
  infoOverlay: {
    alignSelf: 'center',
    borderColor: '#007AFF',
    backgroundColor: 'rgba(0, 122, 255, 0.3)',
    transform: [{ rotate: '0deg' }],
  },
  overlayText: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  indicator: {
    width: 30,
    height: 4,
    borderRadius: 2,
    marginHorizontal: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalContent: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  hostInfoContainer: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  modalHostAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  hostTextContainer: {
    marginLeft: 15,
    flex: 1,
  },
  modalHostName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalHostLabel: {
    fontSize: 14,
    color: '#666',
  },
  messageButton: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  messageButtonText: {
    color: '#333',
    fontWeight: '600',
  },
  modalInfoSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  modalInfoItem: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'center',
  },
  modalInfoTextContainer: {
    marginLeft: 15,
  },
  modalInfoLabel: {
    fontSize: 14,
    color: '#666',
  },
  modalInfoText: {
    fontSize: 16,
    fontWeight: '500',
  },
  descriptionContainer: {
    padding: 20,
    flex: 1,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  joinButtonModal: {
    backgroundColor: '#007AFF',
    margin: 20,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  joinButtonTextModal: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 