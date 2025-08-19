import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import LottieView from 'lottie-react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function BloodPressureScreen({ navigation }) {
  const [isMeasuring, setIsMeasuring] = useState(true);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (isMeasuring) {
      const timer = setTimeout(() => {
        // Simulate random result
        const systolic = Math.floor(Math.random() * (130 - 110 + 1)) + 110;
        const diastolic = Math.floor(Math.random() * (85 - 70 + 1)) + 70;
        const status =
          systolic > 130 || diastolic > 85
            ? 'High'
            : systolic < 100 || diastolic < 60
            ? 'Low'
            : 'Normal';

        setResult({ systolic, diastolic, status });
        setIsMeasuring(false);
      }, 15000);

      return () => clearTimeout(timer);
    }
  }, [isMeasuring]);

  if (isMeasuring) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Measuring Blood Pressure</Text>
        <Text style={styles.subtitle}>
          Please stay relaxed and still{"\n"}Place your fingertip on flashlight
        </Text>
        <LottieView
          source={require('../img/bloodpress.json')}
          autoPlay
          loop
          style={{ width: 250, height: 250 }}
        />
        <Text style={styles.status}>Analyzing your blood pressure....</Text>
      </View>
    );
  }

  // Result screen
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Blood Pressure</Text>
      <Text style={styles.bpValue}>
        {result.systolic} / {result.diastolic} mmHg
      </Text>
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
        {result.status} Blood Pressure
      </Text>
      <Icon
        name="blood-bag"
        size={90}
        color="#d30505ff"
        style={{ marginVertical: 20 }}
      />

      <View style={{ flexDirection: 'row', gap: 12, marginTop: 20 }}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#00AEEF' }]}
          onPress={() => {
            setIsMeasuring(true);
            setResult(null);
          }}
        >
          <Text style={styles.buttonText}>Measure Again</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#E53935' }]}
          onPress={() => navigation.navigate('Maintab')}
        >
          <Text style={[styles.buttonText, { color: '#fff' }]}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#00AEEF', marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#0D47A1', marginBottom: 20, textAlign: 'center' },
  status: { fontSize: 20, fontWeight: '450', marginTop: 10,  color: '#0D47A1', fontStyle: 'italic', },
  bpValue: { fontSize: 40, fontWeight: 'bold', color: '#ef0606ff' },
  high: { color: '#D32F2F' },
  low: { color: '#1976D2' },
  normal: { color: '#0D47A1',fontSize: 18,fontWeight:'300' },
  button: {
    marginTop: 40,
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 12,
  },
  buttonText: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
});
