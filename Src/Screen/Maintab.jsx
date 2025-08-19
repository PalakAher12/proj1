import React, { useRef, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HomeScreen from './HomeScreen';
import QRScreen from './QRScreen';
import ProfileScreen from './ProfileScreen';

const Tab = createBottomTabNavigator();

function AnimatedCircleIcon({ name, color, size, focused }) {
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: focused ? 1 : 0,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: focused ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [focused]);

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View
        style={[
          styles.circleBackground,
          {
            transform: [{ scale }],
            opacity,
            borderWidth: focused ? 2 : 0,
            borderColor: focused ? 'rgba(28, 117, 188, 0.3)' : 'transparent',
          },
        ]}
      />
      <Ionicons
        name={name}
        color={focused ? '#fff' : color}
        size={size}
      />
    </View>
  );
}

function CustomTabBarButton({ children, onPress }) {
  return (
    <TouchableOpacity
      style={styles.centerButton}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.centerIcon}>
        {children}
      </View>
    </TouchableOpacity>
  );
}

export default function MainTab() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 20,
          marginHorizontal: '7%',  // pushes in from right (together makes width 90%)
          backgroundColor: '#fff',
          width: '85%',
          borderRadius: 40,
          height: 55,
          elevation: 5,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowOffset: { width: 0, height: 5 },
          paddingHorizontal: 15,
        },

        headerShown: false,
        tabBarActiveTintColor: '#1C75BC',
        tabBarInactiveTintColor: '#4D94CC',
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <AnimatedCircleIcon
              name="home-outline"
              color={color}
              size={size}
              focused={focused}
            />
          ),
        }}
      />

      <Tab.Screen
        name="QR"
        component={QRScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons name="qr-code-outline" color={focused ? '#fff' : '#4D94CC'} size={28} />
          ),
          tabBarButton: (props) => (
            <CustomTabBarButton {...props} />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <AnimatedCircleIcon
              name="person-outline"
              color={color}
              size={size}
              focused={focused}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  circleBackground: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#1C75BC', // lighter blue circle
  },
  centerButton: {
    top: -20, // slightly less pop-up
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#1C75BC',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
});
