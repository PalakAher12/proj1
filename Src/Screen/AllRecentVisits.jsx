import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';

const AllRecentVisits = ({ navigation }) => {
  const recentVisits = [
    { id: '1', name: 'Dr. Rchana Kanade', speciality: 'Cardiologist', days: 'Mon - Fri', image: 'https://randomuser.me/api/portraits/women/44.jpg' },
    { id: '2', name: 'Dr. Manoj Sinha', speciality: 'Neurologist', days: 'Tue - Sat', image: 'https://randomuser.me/api/portraits/men/45.jpg' },
    { id: '3', name: 'Dr. Priya Deshmukh', speciality: 'Orthopedist', days: 'Mon - Thu', image: 'https://randomuser.me/api/portraits/women/46.jpg' },
    { id: '4', name: 'Dr. Suresh Mehta', speciality: 'Dermatologist', days: 'Mon - Thu', image: 'https://randomuser.me/api/portraits/men/47.jpg' },
    { id: '5', name: 'Dr. Anjali Kapoor', speciality: 'Pediatrician', days: 'Mon - Thu', image: 'https://randomuser.me/api/portraits/women/48.jpg' },
    { id: '6', name: 'Dr. Ramesh Gupta', speciality: 'ENT Specialist', days: 'Mon - Thu', image: 'https://randomuser.me/api/portraits/men/49.jpg' },
    { id: '7', name: 'Dr. Sneha Bansal', speciality: 'Psychiatrist', days: 'Mon - Thu', image: 'https://randomuser.me/api/portraits/women/50.jpg' },
  ];

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.specialization}>{item.speciality}</Text>
        <Text style={styles.available}>{item.days}</Text>
      </View>
      <TouchableOpacity
        style={styles.bookButton}
        onPress={() => navigation.navigate('DoctorBookingScreen')}
      >
        <Text style={styles.bookText}>Book</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>All Recent Visits</Text>
      </View>

      {/* List */}
      <FlatList
        data={recentVisits}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 10 }}
      />
    </View>
  );
};

export default AllRecentVisits;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerText: { fontSize: 20, fontWeight: 'bold', color: '#000' },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    alignItems: 'center',
  },
  image: { width: 60, height: 60, borderRadius: 30, marginRight: 10 },
  name: { fontSize: 16, fontWeight: 'bold', color: '#000' },
  specialization: { fontSize: 14, color: 'gray' },
  available: { fontSize: 13, color: '#555' },
  bookButton: {
    backgroundColor: '#1C75BC',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  bookText: { color: '#fff', fontWeight: 'bold' },
});