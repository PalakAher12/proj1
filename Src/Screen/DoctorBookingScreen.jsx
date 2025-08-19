import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';

const DoctorBookingScreen = ({ navigation }) => {
  const [bookingTime, setBookingTime] = useState(null);
  const [showPicker, setShowPicker] = useState(false);

  const handleTimeSelect = (event, selectedTime) => {
    setShowPicker(false);
    if (selectedTime) {
      const hours = selectedTime.getHours().toString().padStart(2, '0');
      const minutes = selectedTime.getMinutes().toString().padStart(2, '0');
      const formattedTime = `${hours}:${minutes}`;
      setBookingTime(formattedTime);
    }
  };

  const cancelBooking = () => {
    setBookingTime(null);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Doctor Image */}
      <View style={styles.imageContainer}>
        <Image
          source={require('../Images/DocImg.jpeg')}
          style={styles.doctorImage}
        />
      </View>

      {/* Doctor Name & Speciality */}
      <View style={styles.infoContainer}>
        <Text style={styles.doctorName}>Dr. Rchana Kanade</Text>
        <Text style={styles.speciality}>Cardiologist</Text>
      </View>

      {/* Schedule */}
      <View style={styles.scheduleCard}>
        <View style={styles.row}>
          <Icon name="calendar" size={20} color="#000" />
          <Text style={styles.scheduleText}>Mon - Fri</Text>
        </View>
        <View style={styles.row}>
          <MaterialCommunityIcons name="clock-outline" size={20} color="#000" />
          <Text style={styles.scheduleText}>10:30 AM - 5:30 PM</Text>
        </View>
      </View>

      {/* About Doctor */}
      <View style={styles.aboutCard}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.aboutText}>
          Dr. Rchana Kanade is a highly experienced Cardiologist with over 10 years 
          of expertise in treating heart-related ailments. She is committed to 
          providing top-quality cardiac care to patients.
        </Text>
      </View>

      {/* Booked or Book Button */}
      {bookingTime ? (
        <View style={styles.warningCard}>
          <MaterialCommunityIcons name="alert-circle" size={20} color="#ff9800" />
          <Text style={styles.warningText}>Booked at {bookingTime}</Text>
          <TouchableOpacity style={styles.cancelButton} onPress={cancelBooking}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.bookButton} onPress={() => setShowPicker(true)}>
          <Text style={styles.bookButtonText}>Select Time & Book</Text>
        </TouchableOpacity>
      )}

      {/* Time Picker */}
      {showPicker && (
        <DateTimePicker
          value={new Date()}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleTimeSelect}
        />
      )}
    </ScrollView>
  );
};

export default DoctorBookingScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  imageContainer: { alignItems: 'center', marginVertical: 20 },
  doctorImage: { width: 120, height: 120, borderRadius: 60 },
  infoContainer: { alignItems: 'center', marginBottom: 20 },
  doctorName: { fontSize: 22, fontWeight: 'bold' },
  speciality: { fontSize: 16, color: 'gray' },
  scheduleCard: { backgroundColor: '#E3F3FF', borderRadius: 15, padding: 15, marginVertical: 10 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  scheduleText: { marginLeft: 10, fontSize: 16 },
  aboutCard: { backgroundColor: '#f5f5f5', borderRadius: 15, padding: 15, marginVertical: 10 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  aboutText: { fontSize: 14, color: '#555', lineHeight: 20 },
  bookButton: { backgroundColor: '#1C75BC', padding: 15, borderRadius: 30, alignItems: 'center', marginTop: 20 },
  bookButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  warningCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF3E0', padding: 12, borderRadius: 10, marginTop: 20 },
  warningText: { marginLeft: 8, color: '#ff9800', fontSize: 15, fontWeight: '500', flex: 1 },
  cancelButton: { backgroundColor: '#ff4d4d', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8 },
  cancelButtonText: { color: '#fff', fontSize: 14 }
});