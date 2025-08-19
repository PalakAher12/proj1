import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';

const doctors = [
  {
    id: '1',
    name: 'Dr. Shruti Patel',
    specialization: 'Cardiologist',
    available: 'Mon - Fri',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    id: '2',
    name: 'Dr. Rajesh Kumar',
    specialization: 'Neurologist',
    available: 'Mon - Sat',
    image: 'https://randomuser.me/api/portraits/men/45.jpg',
  },
  {
    id: '3',
    name: 'Dr. Anjali Mehta',
    specialization: 'Dermatologist',
    available: 'Tue - Sun',
    image: 'https://randomuser.me/api/portraits/women/46.jpg',
  },
  {
    id: '4',
    name: 'Dr. Suresh Iyer',
    specialization: 'Orthopedic',
    available: 'Mon - Fri',
    image: 'https://randomuser.me/api/portraits/men/47.jpg',
  },
  {
    id: '5',
    name: 'Dr. Priya Sharma',
    specialization: 'Pediatrician',
    available: 'Mon - Sat',
    image: 'https://randomuser.me/api/portraits/women/48.jpg',
  },
  {
    id: '6',
    name: 'Dr. Vivek Nair',
    specialization: 'ENT Specialist',
    available: 'Mon - Thu',
    image: 'https://randomuser.me/api/portraits/men/49.jpg',
  },
  {
    id: '7',
    name: 'Dr. Sneha Kapoor',
    specialization: 'Psychiatrist',
    available: 'Tue - Sat',
    image: 'https://randomuser.me/api/portraits/women/50.jpg',
  },
  {
    id: '8',
    name: 'Dr. Arjun Malhotra',
    specialization: 'Urologist',
    available: 'Wed - Sun',
    image: 'https://randomuser.me/api/portraits/men/51.jpg',
  },
  {
    id: '9',
    name: 'Dr. Neha Bansal',
    specialization: 'Gynecologist',
    available: 'Mon - Fri',
    image: 'https://randomuser.me/api/portraits/women/52.jpg',
  },
  {
    id: '10',
    name: 'Dr. Manoj Verma',
    specialization: 'General Physician',
    available: 'All Days',
    image: 'https://randomuser.me/api/portraits/men/53.jpg',
  },
];

const DocRecommendationScreen = ({navigation}) => {
  const renderDoctor = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.specialization}>{item.specialization}</Text>
        <Text style={styles.available}>{item.available}</Text>
      </View>
      <TouchableOpacity style={styles.bookButton}
         onPress={() => navigation.navigate('DoctorBookingScreen')}>
        <Text style={styles.bookText}>Book</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Recommendation</Text>
      </View>

      {/* Doctor List */}
      <FlatList
        data={doctors}
        keyExtractor={(item) => item.id}
        renderItem={renderDoctor}
        contentContainerStyle={{ padding: 10 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
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
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  specialization: {
    fontSize: 14,
    color: 'gray',
  },
  available: {
    fontSize: 13,
    color: '#555',
  },
  bookButton: {
    backgroundColor: '#1C75BC',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  bookText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default DocRecommendationScreen;