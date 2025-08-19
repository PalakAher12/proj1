import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

export default function WaterGlass() {
  const [target, setTarget] = useState(2000);
  const [input, setInput] = useState('2000');
  const [current, setCurrent] = useState(0);
  const [lastReset, setLastReset] = useState(new Date());
  const waterLevel = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    height: withTiming(waterLevel.value * 240, { duration: 800 }),
  }));

  useEffect(() => {
    const now = new Date();
    const hours = Math.abs(now - lastReset) / 36e5;
    if (hours >= 24) {
      setCurrent(0);
      setLastReset(now);
      waterLevel.value = 0;
    }
  }, []);

  const updateTarget = () => {
    const val = parseInt(input);
    if (!isNaN(val) && val > 0) {
      setTarget(val);
      setCurrent(0);
      waterLevel.value = 0;
    }
  };

  const addWater = (amount) => {
    if (current + amount <= target) {
      const newAmt = current + amount;
      setCurrent(newAmt);
      waterLevel.value = newAmt / target;
    }
  };

  const reset = () => {
    setCurrent(0);
    waterLevel.value = 0;
    setLastReset(new Date());
  };

  const percent = Math.min(((current / target) * 100).toFixed(0), 100);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <Text style={styles.heading}>💧 Water Tracker</Text>

      <Text style={styles.currentIntake}>{current} mL</Text>
      <Text style={styles.goalText}>Daily Goal: {target} mL</Text>

      <View style={styles.inputRow}>
        <TextInput
          value={input}
          onChangeText={setInput}
          keyboardType="numeric"
          placeholder="Set goal (mL)"
          placeholderTextColor="#ccc"
          style={styles.input}
        />
        <TouchableOpacity onPress={updateTarget} style={styles.setBtn}>
          <Text style={styles.setBtnText}>Set</Text>
        </TouchableOpacity>
      </View>

      {/* Glass */}
      <View style={styles.glass}>
        <Animated.View style={[styles.water, animatedStyle]}>
          <Svg height={20} width="100%" viewBox="0 0 100 20" style={styles.wave}>
            <Path d="M0 10 Q 25 0 50 10 T 100 10 V20 H0 Z" fill="#0096C7" />
          </Svg>
        </Animated.View>
        <Text style={styles.percentText}>{percent}%</Text>
      </View>

      <Text style={styles.subText}>You've completed {percent}% of your goal</Text>

      {/* Preset Buttons */}
      <View style={styles.presets}>
        {[100, 200, 500].map((val) => (
          <TouchableOpacity key={val} style={styles.presetBtn} onPress={() => addWater(val)}>
            <Text style={styles.presetText}>{val} mL</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Add Intake Button */}
      <TouchableOpacity style={styles.addIntakeBtn} onPress={() => addWater(250)}>
        <Text style={styles.addIntakeText}>+ Add Intake</Text>
      </TouchableOpacity>

      {/* Reset */}
      <TouchableOpacity onPress={reset} style={styles.resetBtn}>
        <Text style={styles.resetText}>Reset</Text>
      </TouchableOpacity>

      {/* Record Section */}
      <ScrollView contentContainerStyle={styles.record}>
        <Text style={styles.recordHeading}>💧 Water Record</Text>
        <Text style={styles.recordEmpty}>You haven’t logged any intake yet.</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 20,
  },
  heading: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0077B6',
    marginBottom: 16,
  },
  currentIntake: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#023E8A',
  },
  goalText: {
    fontSize: 16,
    color: '#0077B6',
    marginBottom: 14,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#00B4D8',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    width: 130,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#0077B6',
  },
  setBtn: {
    backgroundColor: '#0077B6',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  setBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  glass: {
    width: 150,
    height: 240,
    borderWidth: 2,
    borderColor: '#0096C7',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 80,
    borderBottomRightRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.4)',
    overflow: 'hidden',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginVertical: 18,
    shadowColor: '#0096C7',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  water: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#00B4D8',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  wave: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  percentText: {
    position: 'absolute',
    bottom: 12,
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  subText: {
    fontSize: 14,
    color: '#0077B6',
    marginBottom: 16,
  },
  presets: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  presetBtn: {
    backgroundColor: '#ADE8F4',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  presetText: {
    color: '#0077B6',
    fontWeight: '600',
  },
  addIntakeBtn: {
    backgroundColor: '#0077B6',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 30,
    marginBottom: 20,
  },
  addIntakeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resetBtn: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  resetText: {
    color: '#fff',
    fontWeight: '600',
  },
  record: {
    alignItems: 'center',
    paddingBottom: 30,
  },
  recordHeading: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
    color: '#03045E',
  },
  recordEmpty: {
    color: '#555',
    fontSize: 13,
    textAlign: 'center',
    paddingHorizontal: 12,
  },
});
