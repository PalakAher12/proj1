import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { db } from './firechifile/firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';


const OtpVerification = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { userData, loginData } = route.params || {};
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const inputs = useRef([]);

  const handleChange = (text, index) => {
    if (/^\d?$/.test(text)) {
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);
      if (text && index < 5) {
        inputs.current[index + 1]?.focus();
      }
    }
  };

  const handleVerifyOtp = async () => {
    const enteredOtp = otp.join('');
    if (enteredOtp.length < 6) {
      ToastAndroid.showWithGravity('Please enter all 6 digits of the OTP.', ToastAndroid.SHORT, ToastAndroid.CENTER);
      return;
    }

    if (enteredOtp !== '121612') {
      ToastAndroid.showWithGravity('The OTP entered is incorrect.', ToastAndroid.SHORT, ToastAndroid.CENTER);
      return;
    }

    setVerifying(true);

    try {
      if (route.params?.from === 'signup') {
        const { uid, fullName, email, phone, password } = route.params;

        const userData = {
          userid: uid,
          fullName,
          email,
          phone,
          password,
          createdAt: new Date().toISOString(),
        };

        await setDoc(doc(db, 'Siddhi', uid), userData);
        ToastAndroid.showWithGravity('🎉 Signup successful! 🎯', ToastAndroid.SHORT, ToastAndroid.CENTER);
        navigation.replace('Terms');
      } else {
        ToastAndroid.showWithGravity('✅ Login successful! 🚀', ToastAndroid.SHORT, ToastAndroid.CENTER);
        navigation.replace('MainTab');
      }
    } catch (error) {
      console.error('OTP Verification Error:', error);
      ToastAndroid.showWithGravity('Something went wrong while verifying OTP.', ToastAndroid.SHORT, ToastAndroid.CENTER);
    } finally {
      setVerifying(false);
    }
  };

  const handleResendOtp = () => {
    setResending(true);
    setTimeout(() => {
      setOtp(['', '', '', '', '', '']);
      inputs.current[0]?.focus();
      alert('Mock resend successful (123456).');
      setResending(false);
    }, 1000);
  };

  const isOtpComplete = otp.every((digit) => digit !== '');

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : null}
    >
      <Text style={styles.title}>Enter OTP</Text>
      <Text style={styles.subtitle}>We sent it to your number</Text>

      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputs.current[index] = ref)}
            style={styles.otpInput}
            maxLength={1}
            keyboardType="number-pad"
            value={digit}
            onChangeText={(text) => handleChange(text, index)}
          />
        ))}
      </View>

      <TouchableOpacity
        style={[styles.button, !isOtpComplete || verifying ? { opacity: 0.6 } : null]}
        onPress={handleVerifyOtp}
        disabled={!isOtpComplete || verifying}
      >
        {verifying ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Text style={styles.buttonText}>Verify OTP</Text>
            <Ionicons name="arrow-forward-circle" size={24} color="white" />
          </>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={handleResendOtp} disabled={resending} style={{ marginTop: 20 }}>
        <Text style={{ color: '#1C75BC', fontSize: 16 }}>
          {resending ? 'Resending...' : 'Resend OTP'}
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

export default OtpVerification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    alignSelf: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    alignSelf: 'center',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  otpInput: {
    width: 45,
    height: 55,
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 20,
    color: '#333',
  },
  button: {
    backgroundColor: '#1C75BC',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 10,
    gap: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});