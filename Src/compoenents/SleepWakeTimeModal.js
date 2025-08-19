import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  Animated,
  Easing,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Ionicons from 'react-native-vector-icons/Ionicons';

const SleepWakeTimeModal = ({ visible, onClose, onSubmit }) => {
  const [sleepTime, setSleepTime] = useState(null);
  const [wakeTime, setWakeTime] = useState(null);
  const [isSleepPickerVisible, setSleepPickerVisible] = useState(false);
  const [isWakePickerVisible, setWakePickerVisible] = useState(false);
  const [sleepAlertVisible, setSleepAlertVisible] = useState(false);
  const [sleepAlertMessage, setSleepAlertMessage] = useState('');

  const scaleAnim = new Animated.Value(0.9);

  React.useEffect(() => {
    if (visible) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 80,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const handleSleepConfirm = (time) => setSleepTime(time);
  const handleWakeConfirm = (time) => setWakeTime(time);

  const calculateSleepHours = (sleep, wake) => {
    const sleepDate = new Date(sleep);
    const wakeDate = new Date(wake);
    if (wakeDate < sleepDate) wakeDate.setDate(wakeDate.getDate() + 1);
    const diff = (wakeDate - sleepDate) / (1000 * 60 * 60);
    return parseFloat(diff.toFixed(2));
  };

  const handleSubmit = () => {
    if (!sleepTime || !wakeTime) {
      setSleepAlertMessage('Please select both sleep and wake times.');
      setSleepAlertVisible(true);
      return;
    }

    const hours = calculateSleepHours(sleepTime, wakeTime);
    onSubmit({ sleepTime, wakeTime, sleepHours: hours });
    onClose();
  };

  return (
   <Modal visible={visible} animationType="fade" transparent>
  <TouchableWithoutFeedback onPress={onClose}>
    <View style={styles.modalOverlay}>
      <TouchableWithoutFeedback>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>🌙 Set Sleep & Wake Time</Text>

          <TouchableOpacity style={styles.timeButton} onPress={() => setSleepPickerVisible(true)}>
            <Text style={styles.buttonText}>Set Sleep Time</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.timeButton} onPress={() => setWakePickerVisible(true)}>
            <Text style={styles.buttonText}>Set Wake Time</Text>
          </TouchableOpacity>

          <Text style={styles.timeText}>
            💤 Sleep Time: {sleepTime ? sleepTime.toLocaleTimeString() : '--'}
          </Text>
          <Text style={styles.timeText}>
            🌅 Wake Time: {wakeTime ? wakeTime.toLocaleTimeString() : '--'}
          </Text>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Save Times</Text>
          </TouchableOpacity>

          {isSleepPickerVisible && (
            <DateTimePicker
              value={sleepTime || new Date()}
              mode="time"
              is24Hour={false}
              display="default"
              onChange={(event, selectedDate) => {
                setSleepPickerVisible(false);
                if (selectedDate) handleSleepConfirm(selectedDate);
              }}
            />
          )}

          {isWakePickerVisible && (
            <DateTimePicker
              value={wakeTime || new Date()}
              mode="time"
              is24Hour={false}
              display="default"
              onChange={(event, selectedDate) => {
                setWakePickerVisible(false);
                if (selectedDate) handleWakeConfirm(selectedDate);
              }}
            />
          )}
        </View>
      </TouchableWithoutFeedback>
    </View>
  </TouchableWithoutFeedback>

      {/* Alert Modal */}
      <Modal
        visible={sleepAlertVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setSleepAlertVisible(false)}
      >
        <View style={styles.sleepModalBackdrop}>
          <View style={styles.sleepModalCard}>
            <Ionicons name="alert-circle" size={60} color="orange" />
            <Text style={styles.sleepModalTitle}>Missing Time</Text>
            <Text style={styles.sleepModalMessage}>{sleepAlertMessage}</Text>
            <TouchableOpacity
              style={styles.sleepModalButton}
              onPress={() => setSleepAlertVisible(false)}
            >
              <Text style={styles.sleepModalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Modal>
  );
};

export default SleepWakeTimeModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    width: '100%',
    backgroundColor: '#fefefe',
    borderRadius: 25,
    padding: 25,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    borderWidth: 1,
    borderColor: '#dcdcdc',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#5c5470',
    textAlign: 'center',
    marginBottom: 20,
  },
  timeButton: {
    backgroundColor: '#dbe7f0', // soft sky blue
    paddingVertical: 12,
    borderRadius: 30,
    marginVertical: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#4a6572',
    fontSize: 16,
    fontWeight: '500',
  },
  timeText: {
    fontSize: 16,
    color: '#6a6a6a',
    textAlign: 'center',
    marginVertical: 4,
  },
  submitButton: {
    backgroundColor: '#a1d6b2', // soft green
    paddingVertical: 14,
    borderRadius: 30,
    marginTop: 20,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#2f4f4f',
    fontSize: 16,
    fontWeight: '600',
  },
});
