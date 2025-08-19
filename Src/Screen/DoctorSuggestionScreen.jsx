import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, ScrollView, Image, TouchableHighlight, Alert, Dimensions } from 'react-native';
import Feather from "react-native-vector-icons/Feather";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import LottieView from 'lottie-react-native';
import { db } from "../SiddhiScreens/firechifile/firebaseConfig";
import {getDoc, doc, setDoc } from 'firebase/firestore';
import auth from '@react-native-firebase/auth'

const DoctorSuggestionScreen = ({ navigation }) => {


  const [fullName, setFullName] = useState('');
  const [searchText, setSearchText] = useState('');
  const screenWidth = Dimensions.get('window').width;
    const scrollRef = useRef(null);
  let currentIndex = 0;

  const recommendationDoctors = [
    {
      id: 1,
      name: 'Dr. Shruti Patel',
      specialization: 'Cardiologist',
      available: 'Mon - Fri',
    },
    {
      id: 2,
      name: 'Dr. Manoj Sinha',
      specialization: 'Neurologist',
      available: 'Tue - Sat',
    },
    {
      id: 3,
      name: 'Dr. Riya Deshmukh',
      specialization: 'Dermatologist',
      available: 'Mon - Thu',
    },
    {
      id: 4,
      name: 'Dr. Riya Deshmukh',
      specialization: 'Dermatologist',
      available: 'Mon - Thu',
    },
    {
      id: 5,
      name: 'Dr. Riya Deshmukh',
      specialization: 'Dermatologist',
      available: 'Mon - Thu',
    },
    {
      id: 6,
      name: 'Dr. Riya Deshmukh',
      specialization: 'Dermatologist',
      available: 'Mon - Thu',
    },
    {
      id: 7,
      name: 'Dr. Riya Deshmukh',
      specialization: 'Dermatologist',
      available: 'Mon - Thu',
    },

  ];


  
  useEffect(() => {
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % recommendationDoctors.length;
      if (scrollRef.current) {
        scrollRef.current.scrollTo({ x: currentIndex * screenWidth, animated: true });
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

    const user = auth().currentUser;

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = user.uid;
      try {
        const docRef = doc(db, 'Siddhi', userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          setFullName(userData.fullName || '');
        } else {
          console.log('No such user!');
        }
      } catch (error) {
        console.error('Error getting user data:', error);
      }
    };

    fetchUserData();
  }, []);


  // const doctors = [
  //   { id: 1, name: 'Dr. Aditi Mehra' },
  //   { id: 2, name: 'Dr. Rahul Verma' },
  //   { id: 3, name: 'Dr. Sneha Patil' },
  //   { id: 4, name: 'Dr. Ankit Sharma' },
  // ];
  // Search bar related ahe kahi tri he********************
  // const filteredDoctors = doctors.filter((doc) =>
  //   doc.name.toLowerCase().includes(searchText.toLowerCase())
  // );

  return (
    <ScrollView style={style.Screen} contentContainerStyle={{ flexGrow: 1 }}>
      <View>
        <View style={style.headingRow}>
          <View>
            <Text style={style.greetingText}>{`👋 Hello ${fullName} ,`} </Text>
            <Text style={style.greetingText}>Pick your Doctor</Text>
          </View>

          <LottieView
            source={require('../Animations/SearchDoctor.json')}
            autoPlay
            loop
            style={{ width: 100, height: 100 }}
          />
        </View>

        <View style={style.searchWrapper}>
          <TouchableOpacity>
            <Feather style={style.searchIcon}
              name={"search"}
              size={16}
              color="#888" />
          </TouchableOpacity>
          <TextInput
            placeholder="Search for doctor"
            placeholderTextColor="#888"
            style={style.searchInput}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        <View style={style.divider} />
        {/* Below code shows recent visits of user */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ marginLeft: 26, marginTop: 20, fontSize: 22, fontWeight: 600 }}>Recent Visit</Text>
          <TouchableOpacity style={{ marginRight: 40, marginTop: 25, }}
            onPress={() => navigation.navigate('AllRecentVisits')}>
            <Text style={{ fontSize: 16, color: 'grey', opacity: 10 }}>See All</Text>
          </TouchableOpacity>
        </View>

        <TouchableHighlight
          underlayColor="#e0e0e0"
          style={style.DoctorCard}
          // onPress={() => Alert.alert('Navigate to doctor profile')}
        >
          <View>
            <View style={style.DoctorTopRow}>
              <Image
                source={require('../Images/DocImg.jpeg')}
                style={style.DoctorImage}
              />
              <View style={{ marginLeft: 12 }}>
                <Text style={style.DoctorName}>Dr. Rchana Kanade</Text>
                <Text style={style.Specialization}>Cardiologist</Text>
              </View>
            </View>

            <View style={style.ScheduleContainer}>
              <View>
                <View style={style.ScheduleItem}>
                  <FontAwesome name="calendar" size={16} color="#4D94CC" style={{ marginRight: 6 }} />
                  <Text style={style.ScheduleText}>Mon - Fri</Text>
                </View>
                <View style={[style.ScheduleItem, { marginTop: 6 }]}>
                  <FontAwesome name="clock-o" size={16} color="#4D94CC" style={{ marginRight: 6 }} />
                  <Text style={style.ScheduleText}>10:30 AM - 5:30 PM</Text>
                </View>
              </View>
              <TouchableOpacity
                style={style.bookButton}
                onPress={() => navigation.navigate("DoctorBookingScreen")}
              >
                <Text style={style.bookButtonText}>Book</Text>
              </TouchableOpacity>
            </View>

          </View>
        </TouchableHighlight>

        {/* Below code Shows recommendations of Doctors to user */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ marginLeft: 26, marginTop: 40, fontSize: 22, fontWeight: 600 }}>Recommendation</Text>
          <TouchableOpacity style={{ marginRight: 40, marginTop: 45 }}
            onPress={() => navigation.navigate('DocRecommendationScreen')}>
            <Text style={{ fontSize: 16, color: 'grey', opacity: 10 }}>See All</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          ref={scrollRef}
        >
          {recommendationDoctors.map((doc) => (
            <View
              key={doc.id}
              style={{
                width: screenWidth,
                paddingHorizontal: 2,
                paddingVertical: 10,
              }}>

              {/* DocRecCard view */}
              <TouchableHighlight
                underlayColor="#e0e0e0"
                style={style.DoctorCard}
                // onPress={() => Alert.alert('Navigate to doctor profile')}
              >
                <View>

                  {/* Doc img and name row */}
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image
                      source={require('../Images/DocImg.jpeg')}
                      style={{ width: 60, height: 60, borderRadius: 25 }}
                    />

                    <View style={{ marginLeft: 12 }}>
                      <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#000' }}>{doc.name}</Text>
                      <Text style={{ fontSize: 13, color: '#333', marginTop: 4 }}>{doc.specialization}</Text>
                    </View>
                  </View>
                  {/* Scehdule Section View */}
                  <View
                   style={style.ScheduleContainer}
                  >
                    <View>
                      <View style={style.ScheduleItem}>
                        <FontAwesome name="calendar" size={16} color="#4D94CC" style={{ marginRight: 6 }} />
                        <Text style={style.ScheduleText}>{doc.available}</Text>
                      </View>
                      <View style={[style.ScheduleItem, { marginTop: 6 }]}>
                        <FontAwesome name="clock-o" size={16} color="#4D94CC" style={{ marginRight: 6 }} />
                        <Text style={style.ScheduleText}>10:30 AM - 5:30 PM</Text>
                      </View>
                    </View>

                    <TouchableOpacity
                     style={style.bookButton}
                      onPress={() => navigation.navigate('DoctorBookingScreen')}
                    >
                      <Text style={style.bookButtonText}>Book</Text>
                    </TouchableOpacity>
                  </View>

                </View>
              </TouchableHighlight>
            </View>
          ))}
        </ScrollView>


      </View>
    </ScrollView>
  );
};

export default DoctorSuggestionScreen;

const style = StyleSheet.create({
  Screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 25,
  },
  greetingText: {
    fontSize: 26,
    fontWeight: 500,
    color: '#000',
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 18,
    paddingVertical: 5,
    marginHorizontal: 20,
    elevation: 5,
    marginTop: 10,
    borderWidth: 0.5,
    borderColor: '#ddd',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginTop: 20,
    marginHorizontal: 20,
  },
  scrollRow: {
    marginTop: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: 'row',
  },

  CategorieCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 100,
    marginRight: 15,
    elevation: 3,

    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 2,
    shadowRadius: 1.41,
  },

  CategorieIcon: {
    width: 55,
    height: 49,
    marginBottom: 6,

  },

  CategorieLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },

  DoctorCard: {
    backgroundColor: '#F8F8F9',
    marginTop: 10,
    padding: 16,
    borderRadius: 20,
    marginHorizontal: 20,
    elevation: 4,
  },

  DoctorTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  DoctorImage: {
    width: 60,
    height: 60,
    borderRadius: 25,
  },

  DoctorName: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },

  Specialization: {
    color: '#000000',
    fontSize: 13,
    marginTop: 4,
  },

  ScheduleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
    backgroundColor: 'rgba(127, 188, 229, 0.1)',
    padding: 10,
    borderRadius: 12,
  },

  ScheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  ScheduleText: {
    color: '#4D94CC',
    fontSize: 13,
  },
  bookButton: {
    backgroundColor: '#1C75BC',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  bookingCard: {
    backgroundColor: '#fff',
    marginTop: 10,
    padding: 16,
    borderRadius: 20,
    marginHorizontal: 20,
    paddingVertical: 30,
    elevation: 4,
  },
});