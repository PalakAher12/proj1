import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import LottieView from 'lottie-react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function BloodOxy({ navigation }) {
  const [isMeasuring, setIsMeasuring] = useState(true);
  const [result, setResult] = useState(null);

  useEffect(() => {
    // Simulate measuring delay and generate fake SpO2 result
    if (isMeasuring) {
      const timer = setTimeout(() => {
        const spo2 = Math.floor(Math.random() * (100 - 90 + 1)) + 90;
        const status = spo2 < 94 ? 'Low' : spo2 <= 98 ? 'Normal' : 'High';

        setResult({ spo2, status });
        setIsMeasuring(false);
      }, 25000);

      return () => clearTimeout(timer);
    }
  }, [isMeasuring]);

  if (isMeasuring) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Measuring Blood Oxygen</Text>
        <Text style={styles.subtitle}>
          Sit still and stay calm{"\n"}Place your fingertip gently over the flashlight
        </Text>
        <LottieView
          source={require('../img/oxygen')}
          autoPlay
          loop
          style={{ width: 250, height: 250 }}
        />
        <Text style={styles.analyzing}>Scanning your oxygen levels...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Blood Oxygen Level</Text>
      <Text style={styles.bpValue}>{result.spo2} %</Text>
      <Text
        style={[
          styles.status,
          result.status === 'High'
            ? styles.high
            : result.status === 'Low'
            ? styles.low
            : styles.normal,
        ]}
      >
        {result.status} SpO₂
      </Text>
      <Icon
        name="water-percent"
        size={90}
        color="#00AEEF"
        style={{ marginVertical: 20 }}
      />

      <View style={{ flexDirection: 'row', gap: 12, marginTop: 10 }}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#0077B6' }]}
          onPress={() => {
            setIsMeasuring(true);
            setResult(null);
          }}
        >
          <Text style={styles.buttonText}>Measure Again</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#D32F2F' }]}
          onPress={() => navigation.navigate('MainTab')}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#0077B6',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#023E8A',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 24,
  },
  analyzing: {
    fontSize: 18,
    fontStyle: 'italic',
    color: '#023E8A',
    marginTop: 20,
  },
  bpValue: {
    fontSize: 44,
    fontWeight: 'bold',
    color: '#ef0606ff',
    marginTop: 10,
  },
  status: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 10,
  },
  high: {
    color: '#2E7D32',
  },
  low: {
    color: '#C62828',
  },
  normal: {
    color: '#1565C0',
  },
  button: {
    marginTop: 30,
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 14,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});
