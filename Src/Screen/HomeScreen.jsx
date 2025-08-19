import { Text, View, TouchableOpacity, FlatList, Dimensions, Image, ScrollView, ActivityIndicator } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import Ionicons from "react-native-vector-icons/Ionicons"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import FontAwesome5 from "react-native-vector-icons/FontAwesome5"
import HomeStyle from "../../styles/HomeStyle"
import ActivityCard from "./ActivityCard"
import Dailycheckout from "../compoenents/Dailycheckout"
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import FlipCardBanner from '../Components/FlipCardBanner'
const { width } = Dimensions.get('window');

const cards = [
  {
    id: '1',
    title: 'Get the Best Medical Services',
    subtitle: 'We provide best quality medical Services without further cost',
    bgColor: '#d6f0fa',
    borderColor: '#0d6e9c',
    image: require('../img/doc1.png'),
    onPress: () => console.log('Card 1 clicked'),
  },
  {
    id: '2',
    title: 'Book Your Doctor Instantly',
    subtitle: 'Find and book the best doctors Now in seconds',
    bgColor: '#F3E8FF',  // pastel purple background
    borderColor: '#8A76D1', // deep purple border
    image: require('../img/doc1.png'),
  },
];
const HomeScreen = ({ navigation }) => {
  const Insurance = () => {
    navigation.navigate('MultiplePolicy');
  };
  const docnav = () => {
    navigation.navigate('DoctorSuggestionScreen');
  };
  const Emergencynav = () => {
    navigation.navigate('EmergencyContactScreen');
  };
  const qrnav = () => {
    navigation.navigate('QRScreen');
  };
  const medrepo = () => {
    navigation.navigate('MedicalReportPreview');
  };

  const profiles = () => {
    navigation.navigate('ProfileScreen');
  };
  // ===============for database of name , prfileimage =================
  const [fullName, setFullName] = useState('');
  const [profileImage, setProfileImage] = useState(null); // store Base64 image
  const user = auth().currentUser;

useEffect(() => {
  const fetchUserData = async () => {
    if (!user?.uid) return;

    try {
      const docRef = firestore().collection('Siddhi').doc(user.uid);
      const docSnap = await docRef.get();

      if (docSnap.exists()) {
        const userData = docSnap.data();
        setFullName(userData.fullName || '');

        if (userData.profileImageBase64) {
          // Use as-is because it already has 'data:image/jpeg;base64,'
          setProfileImage(userData.profileImageBase64);
        } else {
          setProfileImage(null);
        }
      } else {
        console.log('No such user!');
      }
    } catch (error) {
      console.error('Error getting user data:', error);
    }
  };

  fetchUserData();
}, [user]);

  // =====================================================
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto scroll effect
  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % cards.length;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentIndex(nextIndex);
    }, 2000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={docnav}
      style={{
        backgroundColor: item.bgColor,
        paddingLeft: 10,
        flexDirection: 'row',
        marginHorizontal: 10,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'space-between',
        borderLeftWidth: 5,
        borderLeftColor: item.borderColor,
        paddingVertical: 60,
        width: width * 0.9, overflow: 'hidden',
      }}
    >
      {/* Text section */}
      <View style={{ flexDirection: 'column', width: '55%' }}>
        <Text style={{ color: item.borderColor, fontWeight: 'bold', fontSize: 20, marginBottom: 5 }}>
          {item.title}
        </Text>
        <Text style={{ color: 'gray', fontSize: 10 }}>{item.subtitle}</Text>
      </View>

      {/* Image section */}
      <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
        <Image
          source={item.image}
          style={{
            height: '250%',
            width: '120%',
            resizeMode: 'contain',
            position: 'absolute',
            bottom: -105,       // stick to bottom
            right: 5,
          }}
        />
      </View>
    </TouchableOpacity>

  );
  // ==============================================
  return (
    // main container
    <View style={HomeStyle.main}>
      {/* Topbar container */}
      <View style={HomeStyle.Topbar}>
        <View style={HomeStyle.profile_name}>

          {/* profile image  */}
          <TouchableOpacity
            style={HomeStyle.profile_icon}

          >
            {profileImage ? (
              <Image
                source={{ uri: profileImage }}
                style={{
                  height: 45,
                  width: 45,
                  borderRadius: 20, // smooth rounded corners
                  resizeMode: 'cover',
                }}
              />
            ) : (
              <Ionicons name="person-circle" size={45} color="skyblue" />
            )}
          </TouchableOpacity>
          {/* name in top bar */}
          <Text style={{ fontWeight: "700", fontSize: 20, marginLeft: 10 }}>{`👋 Hello, ${fullName} `}</Text>

        </View>

      </View>
      <ScrollView style={HomeStyle.main} contentContainerStyle={{ paddingBottom: 80 }}
        decelerationRate='fast'>

        {/* stpes progress bar */}

 
        <FlipCardBanner/>
   

        <Text style={{ marginTop: 20, fontSize: 23, marginLeft: 10, fontWeight: "bold" }}>Service</Text>

        {/* four icons  */}
        <View style={HomeStyle.facility}>

          <View style={HomeStyle.fac_singleIcon}>
            <TouchableOpacity style={HomeStyle.fac_iconCnt}
              onPress={() => Emergencynav()}>
              <MaterialIcons name="add-call" size={30} color="#0d6e9c" />
            </TouchableOpacity>
            <Text style={{ textAlign: 'center' }}>Emergency{"\n"} Contact</Text>

          </View>

          <View style={HomeStyle.fac_singleIcon}>
            <TouchableOpacity style={HomeStyle.fac_iconCode}
              onPress={() => qrnav()}>
              <Ionicons name="qr-code-sharp" size={30} color="#E6A72F" />
            </TouchableOpacity>
            <Text style={{ textAlign: 'center' }}>QR {"\n"}Code</Text>
          </View>

          <View style={HomeStyle.fac_singleIcon}>
            <TouchableOpacity style={HomeStyle.fac_iconRep}
              onPress={() => medrepo()}>
              <MaterialIcons name="medical-information" size={30} color="#0DBAC6" />
            </TouchableOpacity>
            <Text style={{ textAlign: 'center' }}>Medical {"\n"}Reports</Text>
          </View>

          <View style={HomeStyle.fac_singleIcon}>
            <TouchableOpacity style={HomeStyle.fac_iconId} onPress={() => Insurance()}>
              <FontAwesome5 name="id-card" size={28} color="#A9445B" />
            </TouchableOpacity>
            <Text style={{ textAlign: 'center' }}>Insurance{"\n"} ID</Text>
          </View>

        </View>

        {/* activity information container */}
        <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 13 }}>
          <Text style={{ fontSize: 23, fontWeight: 'bold', marginBottom: 10, fontFamily: "Roboto" }}>Activity</Text>
        </View>
        <ActivityCard />

        {/* doctor container */}
        <FlatList
          ref={flatListRef}
          data={cards}
          renderItem={renderItem}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
        />



        {/* Dailycheckout 4 cards */}
        <Text style={{ fontSize: 23, fontWeight: 'bold', marginLeft: 10, marginTop: 25, }}>Vital Health Stats</Text>
        <View style={HomeStyle.container}>
          <View style={HomeStyle.row}>

            {/* heart rate card */}
            <Dailycheckout
              onPress={() => navigation.navigate('MeasureScreen')}
              title="Heart Rate"
              subtitle="Check your BPM"
              backgroundColor='#F8E7EC'
              imageSource={require('../img/heart.png')}
              imageStyle={{
                width: 120, height: 120,
                opacity: 0.9,
              }} />

            {/* blood pressure card */}
            <Dailycheckout
              onPress={() => navigation.navigate('Bloodpress')}
              title="BP Tracker"
              subtitle="Track your heart’s pressure"
              backgroundColor='#d6f0fa'
              imageSource={require('../img/pressure.png')}
              imageStyle={{
                width: 110, height: 110, marginBottom: 5,
                opacity: 0.9,
              }}
            />
          </View>

          <View style={HomeStyle.row}>
            {/* blood  oxygen card */}
            <Dailycheckout
              onPress={() => navigation.navigate('Bloodoxy')}
              title="Blood Oxygen"
              subtitle="See how well you breathe"
              backgroundColor='#EAEAFB'
              imageSource={require('../img/oxy.png')}
              imageStyle={{
                width: 110, height: 110,
                opacity: 0.9,
              }} />

            {/* water card   */}
            <Dailycheckout
              onPress={() => navigation.navigate('Waterintake')}

              title="Water Intake"
              subtitle="Log your daily water"
              backgroundColor='#E3E6FA'
              imageSource={require('../img/water.png')}
              imageStyle={{
                width: 110, height: 110,
                opacity: 0.9,
              }} />

          </View>
        </View>
      </ScrollView>

    </View>


  )
}

export default HomeScreen

