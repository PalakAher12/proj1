import React, { useState } from 'react';
import { View, Text, TouchableOpacity, PermissionsAndroid, Platform, Alert, ActivityIndicator } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import Share from 'react-native-share';

const LOCATIONIQ_API_KEY = 'pk.f60293a097e9a9445d67903abc01f569';

async function requestLocationPermission() {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location Permission',
        message: 'This app needs access to your location',
        buttonPositive: 'OK',
      },
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }
  return true;
}

export default function Locationex() {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchAddress = async (lat, lon) => {
    try {
      const res = await fetch(
        `https://us1.locationiq.com/v1/reverse.php?key=${LOCATIONIQ_API_KEY}&lat=${lat}&lon=${lon}&format=json`
      );
      const data = await res.json();
      if (data.error) {
        Alert.alert('Error', data.error);
      } else {
        setAddress(data.display_name);
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to fetch address');
    } finally {
      setLoading(false);
    }
  };

  const handleGetLocation = async () => {
    setLoading(true);
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      Alert.alert('Permission denied', 'Cannot access location');
      setLoading(false);
      return;
    }

    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
        fetchAddress(latitude, longitude);
      },
      error => {
        Alert.alert('Error', error.message);
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  const handleShare = () => {
    if (!location || !address) {
      Alert.alert('No location', 'Please fetch your location first.');
      return;
    }
    const message = `My current location:\n${address}\nhttps://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`;
    Share.open({ message })
      .catch(err => console.log('Share error:', err));
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <TouchableOpacity
        onPress={handleGetLocation}
        style={{ backgroundColor: 'blue', padding: 15, borderRadius: 8, marginBottom: 20 }}
        disabled={loading}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>
          {loading ? 'Getting Location...' : 'Get Location'}
        </Text>
      </TouchableOpacity>

      {location && address && (
        <>
          <Text style={{ marginBottom: 20, textAlign: 'center' }}>{address}</Text>
          <TouchableOpacity
            onPress={handleShare}
            style={{ backgroundColor: 'green', padding: 15, borderRadius: 8 }}
          >
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Share Location</Text>
          </TouchableOpacity>
        </>
      )}

      {loading && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}
    </View>
  );
}
