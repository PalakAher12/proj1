import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LottieView from 'lottie-react-native';

export default function MeasureScreen({ navigation }) {
  const [bpm, setBpm] = useState(null);
  const [isMeasuring, setIsMeasuring] = useState(true);

  useEffect(() => {
    // Simulate measuring delay and then show fake bpm
    const timer = setTimeout(() => {
      const fake = Math.floor(Math.random() * (90 - 72 + 1)) + 72; // 72 to 90
      setBpm(fake);
      setIsMeasuring(false);
    }, 15000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {isMeasuring ? (
          <>
            <Text style={styles.title}>Measuring Heart Rate</Text>
            <Text style={styles.instruction}>Place your fingertip on flashlight</Text>
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <LottieView
                source={require('../img/loadrate.json')}
                autoPlay
                loop
                style={{ width: 200, height: 200 }}
              />
            </View>
            <Text style={styles.waiting}>Analyzing pulse...</Text>
          </>
        ) : (
          <>
            <Text style={styles.title}>Your Heart Rate</Text>
            <Text style={styles.bpm}>{bpm} bpm</Text>
            <Icon name="heart-pulse" size={100} color="#E91E63" style={{ margin: 10 }} />
          </>
        )}

        <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.cancelText}>{isMeasuring ? 'Cancel' : 'Done'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },
  content: { alignItems: 'center', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#000', marginBottom: 10 },
  instruction: { fontSize: 16, color: '#000', marginBottom: 30, textAlign: 'center' },
  waiting: { color: '#000', marginTop: 20, fontStyle: 'italic' },
  bpm: { fontSize: 48, color: '#E91E63', fontWeight: 'bold', marginBottom: 20 },
  cancelBtn: {
    marginTop: 40,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#E91E63',
    borderRadius: 10,
  },
  cancelText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
