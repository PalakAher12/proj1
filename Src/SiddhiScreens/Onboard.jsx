import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
  Dimensions,
} from 'react-native';
import Signup from './Signup';
import styles from './Ostyle';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { height } = Dimensions.get('window');

const Onboard = ({navigation}) => {
  const [step, setStep] = useState(0);


  const screens = [
    {
      image: 'https://image.shutterstock.com/image-vector/hands-holding-smartphone-video-call-260nw-1831803718.jpg',
      title: 'Your Health, One Tap Away',
      subtitle: 'Carry your emergency medical info wherever you go — safe and accessible.',
      cropOffset: -20,
    },
    {
      image: 'https://img.freepik.com/premium-vector/online-doctor-consultation-chest-pain-heart-attack_939213-2064.jpg',
      title: 'Critical Data, Always Accessible',
      subtitle: 'Medical teams can view your blood group, allergies & conditions — even without unlocking.',
      cropOffset: 0,
    },
    {
      image: 'https://i.pinimg.com/1200x/55/81/80/558180f961f4da7db384c55903ae464c.jpg',
      title: 'Help Them Help You',
      subtitle: 'Instantly share emergency contacts, prescriptions, and vital stats with those who need them.',
      cropOffset: -25,
    },
  ];

  const nextStep = () => {
    if (step < screens.length - 1) {
      setStep(prev => prev + 1);
    } else {
    navigation.navigate('Signup'); // 👈 navigate on final step
  }
  };

  const prevStep = () => {
    if (step > 0) {
      setStep(prev => prev - 1);
    }
  };

 

  const { image, title, subtitle, cropOffset } = screens[step];

  return (
    <View style={stylesCentered.container}>
      <StatusBar backgroundColor="#F8F9FF" barStyle="dark-content" />

      {step > 0 && (
        <TouchableOpacity onPress={prevStep} style={styles.backButton}>
 <Ionicons name="arrow-back" size={24} color="blue" />


        </TouchableOpacity>
      )}

      <View style={stylesCentered.centerContent}>
        <View style={stylesCentered.imageWrapper}>
          <Image
            source={{ uri: image }}
            style={[stylesCentered.image, { marginTop: cropOffset }]}
          />

          {/* QR Icon overlay only on first screen */}
          {step === 0 && (
            <View style={stylesCentered.qrOverlay}>
              <Ionicons name="qr-code-outline" size={34} color="#1C75BC" />
            </View>
          )}
        </View>

        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      <View style={stylesCentered.bottomSection}>
        <View style={styles.dots}>
          {screens.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, step === i && styles.activeDot]}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.button} onPress={nextStep}>
          <Text style={styles.buttonText}>
            {step === screens.length - 1 ? 'Get Started' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Onboard;

const IMAGE_SIZE = 220;

const stylesCentered = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  imageWrapper: {
    height: IMAGE_SIZE,
    width: IMAGE_SIZE,
    borderRadius: IMAGE_SIZE / 2,
    overflow: 'hidden',
    marginBottom: 30,
    position: 'relative',
  },
  image: {
    height: IMAGE_SIZE + 40,
    width: IMAGE_SIZE,
    resizeMode: 'cover',
  },
 qrOverlay: {
  position: 'absolute',
  top: '82%',   // slightly lower in the image
  left: '42%',  // slightly toward left hand
  backgroundColor: '#F0F1F3',
  borderRadius: 20,
  padding: 4,
  elevation: 5,
},

  bottomSection: {
    alignItems: 'center',
    paddingBottom: 40,
  },
});