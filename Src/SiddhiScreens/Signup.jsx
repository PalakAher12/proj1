import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LottieView from 'lottie-react-native';
import Animation1 from './img/Animation1.json';
import { getAuth, createUserWithEmailAndPassword } from '@react-native-firebase/auth';
import { ToastAndroid } from 'react-native';

const Signup = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!fullName.trim()) newErrors.fullName = 'Full name is required*';
    if (!email.trim()) newErrors.email = 'Email is required*';
    if (!password.trim()) newErrors.password = 'Password is required*';
    if (!phone.trim()) newErrors.phone = 'Phone number is required*';
    else if (!/^\d{10}$/.test(phone)) newErrors.phone = 'Enter valid 10-digit number';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleSignup = async () => {
  if (!validate()) return;

  const normalizePhone = (num) => num.replace(/\D/g, '').slice(-10);
  const normalizedPhone = normalizePhone(phone);

  try {
    const auth = getAuth();
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

   

    // Navigate to OTP verification
    navigation.navigate('OtpVerification', {
      from: 'signup',
      uid,
      fullName,
      email,
      phone: normalizedPhone,
      password
    });

  } catch (error) {

  // Default message
  let errorMessage = 'Signup failed. Please try again.';

  // Map Firebase error codes to friendly messages
  if (error.code === 'auth/email-already-in-use') {
    errorMessage = 'This email is already in use.';
  } else if (error.code === 'auth/invalid-email') {
    errorMessage = 'Invalid email address.';
  } else if (error.code === 'auth/weak-password') {
    errorMessage = 'Password must be at least 6 characters.';
  } else if (error.code === 'auth/invalid-credential') {
    errorMessage = 'Invalid email or password.';
  }

  // Show toast for Android, alert for iOS
  if (Platform.OS === 'android') {
    ToastAndroid.show(errorMessage, ToastAndroid.LONG);
  } else {
    alert(errorMessage);
  }
}

};


  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <StatusBar backgroundColor="#F8F9FF" barStyle="dark-content" />
        <LottieView source={Animation1} autoPlay loop style={styles.topAnimation} />
        <View style={styles.container}>
          <Text style={styles.title}>Sign <Text style={styles.highlight}>Up</Text></Text>
          <Ionicons name="qr-code-outline" size={22} color="#1C75BC" style={styles.qrIcon} />
          <View style={styles.subtitleRow}>
            <Text style={styles.subtitle}>Create a new account</Text>
          </View>

          <View style={[styles.inputContainer, errors.fullName && styles.errorInputContainer]}>
            <Ionicons name="person-outline" size={20} color="#1C75BC" style={styles.icon} />
            <TextInput
              placeholder="Full Name"
              placeholderTextColor="#b0c4de"
              style={styles.input}
              value={fullName}
              onChangeText={text => {
                setFullName(text);
                if (errors.fullName) setErrors({ ...errors, fullName: null });
              }}
              autoCapitalize="words"
            />
          </View>
          {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}

          <View style={[styles.inputContainer, errors.email && styles.errorInputContainer]}>
            <Ionicons name="mail-outline" size={20} color="#1C75BC" style={styles.icon} />
            <TextInput
              placeholder="Email"
              placeholderTextColor="#b0c4de"
              style={styles.input}
              value={email}
              onChangeText={text => {
                setEmail(text);
                if (errors.email) setErrors({ ...errors, email: null });
              }}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

          <View style={[styles.inputContainer, errors.password && styles.errorInputContainer]}>
            <Ionicons name="lock-closed-outline" size={20} color="#1C75BC" style={styles.icon} />
            <TextInput
              placeholder="Password"
              placeholderTextColor="#b0c4de"
              style={styles.input}
              value={password}
              onChangeText={text => {
                setPassword(text);
                if (errors.password) setErrors({ ...errors, password: null });
              }}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={22}
                color="#1C75BC"
                style={{ marginLeft: 8 }}
              />
            </TouchableOpacity>
          </View>
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

          <View style={[styles.inputContainer, errors.phone && styles.errorInputContainer]}>
            <Ionicons name="call-outline" size={20} color="#1C75BC" style={styles.icon} />
            <TextInput
              placeholder="Phone Number"
              placeholderTextColor="#b0c4de"
              style={styles.input}
              keyboardType="phone-pad"
              value={phone}
              onChangeText={text => {
                setPhone(text);
                if (errors.phone) setErrors({ ...errors, phone: null });
              }}
              maxLength={10}
            />
          </View>
          {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}

          <TouchableOpacity
            style={[styles.loginButton, (!fullName || !email || !password || !phone) && styles.disabledButton]}
            onPress={handleSignup}
          >
            <Text style={styles.buttonText}>Create Account</Text>
          </TouchableOpacity>

          <View style={styles.footerText}>
            <Text style={styles.footer}>Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.signupLink}> Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Signup;


const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
    paddingBottom: 40,
  },
  topAnimation: {
    width: 300,
    height: 300,
    alignSelf: 'center',
    marginBottom: -65,
    marginTop: -40,
  },
  container: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    padding: 16,
    borderRadius: 12,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    marginTop: -10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginRight: 10,
  },
  highlight: {
    color: '#1C75BC',
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 15,
  },
  qrIcon: {
    marginLeft: '67%',
    marginTop: -26,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fbff',
    borderRadius: 16,
    paddingHorizontal: 14,
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: '#e3eafc',
    shadowColor: '#1C75BC',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 6,
  },
  errorInputContainer: {
    borderColor: 'red',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 15,
    color: '#222',
    backgroundColor: 'transparent',
    paddingLeft: 2,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 8,
    marginLeft: 10,
  },
  loginButton: {
    backgroundColor: '#1C75BC',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footerText: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: -5,
  },
  footer: {
    fontSize: 13,
    color: '#444',
  },
  signupLink: {
    fontSize: 13,
    color: '#1C75BC',
    fontWeight: 'bold',
  },
});