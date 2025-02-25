import React, { useEffect } from 'react';
import { View, StatusBar, LogBox, Text, TextProps } from 'react-native';
import { AuthProvider } from './app/context/AuthContext';
import { RootNavigator } from './app/navigation/RootNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ErrorBoundary } from './app/components/ErrorBoundary';

// Ignore specific warnings that might be related to navigation
LogBox.ignoreLogs([
  'Sending `onAnimatedValueUpdate` with no listeners registered',
  'Non-serializable values were found in the navigation state',
  'VirtualizedLists should never be nested inside plain ScrollViews',
  'The getNode method was removed',
  'NativeEventEmitter', // This is a warning from React Native itself
  'WARNING: Failed prop type', // This is often a third-party library issue
  'Text strings must be rendered within a', // Temporarily ignore text rendering warnings while debugging
  'Error loading activities', // Ignore our controlled error messages
]);

// Workaround for text scaling issues - using a type assertion to avoid TS errors
(Text as any).defaultProps = (Text as any).defaultProps || {};
(Text as any).defaultProps.allowFontScaling = false;

export default function App() {
  // Global error handler for uncaught JS errors
  useEffect(() => {
    const originalConsoleError = console.error;
    console.error = (...args) => {
      // Don't log known/handled errors to the console
      if (
        typeof args[0] === 'string' && 
        (args[0].includes('Text strings must be rendered') || 
         args[0].includes('Error loading activities'))
      ) {
        return;
      }
      originalConsoleError(...args);
    };
    
    return () => {
      console.error = originalConsoleError;
    };
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <SafeAreaProvider>
        <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
          <ErrorBoundary>
            <AuthProvider>
              <RootNavigator />
            </AuthProvider>
          </ErrorBoundary>
        </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
