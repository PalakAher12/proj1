import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';

const NotificationScreen = ({ navigation }) => {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [appointmentEnabled, setAppointmentEnabled] = useState(false);
  const [emailEnabled, setEmailEnabled] = useState(true); // Optional third toggle

  return (
    <View style={styles.container}>
<Text style={styles.title}>Notification Settings</Text>
      <View style={styles.optionRow}>
        <Text style={styles.optionText}>Push Notifications</Text>
        <Switch
          value={pushEnabled}
          onValueChange={setPushEnabled}
          trackColor={{ false: '#ccc', true: '#4CAF50' }}
          thumbColor="#fff"
        />
      </View>

      <View style={styles.optionRow}>
        <Text style={styles.optionText}>Appointment Reminders</Text>
        <Switch
          value={appointmentEnabled}
          onValueChange={setAppointmentEnabled}
          trackColor={{ false: '#ccc', true: '#2196F3' }}
          thumbColor="#fff"
        />
      </View>

    </View>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 20,
    color: '#333',
    paddingLeft:10,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 10,
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
});
