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
  Image,
  Dimensions,
  Modal,
  StatusBar
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
const { width } = Dimensions.get('window');
import { ToastAndroid } from 'react-native';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState('error'); // 'success' or 'error'
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    let valid = true;
    let newErrors = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required*';
      valid = false;
    }

    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required*';
      valid = false;
    } else if (!/^\d{10}$/.test(phone)) {
      newErrors.phone = 'Enter a valid 10-digit phone number';
      valid = false;
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required*';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

 
const handleLogin = async () => {
  if (!validate()) return;

  const normalizePhone = (num) => num.replace(/\D/g, '').slice(-10);
  const enteredPhone = normalizePhone(phone);

  try {
    // 1. Sign in
    const userCredential = await auth().signInWithEmailAndPassword(email, password);
    const uid = userCredential.user.uid;

    // 2. Get Firestore user
    const userDoc = await firestore().collection('Siddhi').doc(uid).get();
    if (!userDoc.exists) {
      setModalType('error');
      setModalMessage('No user data found in Firestore.');
      setModalVisible(true);
      return;
    }

    const userData = userDoc.data();
    const storedPhone = userData.phone ? normalizePhone(userData.phone) : '';

    if (storedPhone !== enteredPhone) {
      setModalType('error');
      setModalMessage('The phone number does not match our records.');
      setModalVisible(true);
      return;
    }

    navigation.navigate('OtpVerification', {
      uid,
      phone: userData.phone,
      from: 'login',
    });

  }
  catch (error) {
  
  let message = error.message;

  if (error.code === 'auth/user-not-found') {
    message = 'No account found with this email.';
  } else if (error.code === 'auth/wrong-password') {
    message = 'Incorrect password.';
  } else if (error.code === 'auth/invalid-credential') {
    message = 'Invalid credentials. Please check your email and password.';
  }

  // For invalid credentials → use Android toast
  if (
    error.code === 'auth/user-not-found' ||
    error.code === 'auth/wrong-password' ||
    error.code === 'auth/invalid-credential'
  ) {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.LONG);
      return; // skip modal for these cases
    } else {
      alert(message); // iOS fallback
      return;
    }
  }

  // For other errors → show modal
  setModalType('error');
  setModalMessage(message);
  setModalVisible(true);
}

};

  return (
    
    <LinearGradient colors={['#f0f4ff', '#fff']} style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Image
            source={{
              uri: 'https://i.pinimg.com/736x/99/35/ce/9935ce5f3b1d6cb6bc86287cd927d03e.jpg',
            }}
            style={styles.headerImage}
          />
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerText}>Your emergency access, simplified.</Text>
          </View>

          <View style={styles.container}>
            <Text style={styles.title}>
              Welcome <Text style={styles.highlight}>Back</Text>
            </Text>
            <View style={styles.subtitleRow}>
              <Text style={styles.subtitle}>Login to your account</Text>
              <Ionicons name="qr-code-outline" size={22} color="#1C75BC" style={styles.qrIcon} />
            </View>

            {/* Email */}
            <View style={[styles.inputContainer, errors.email && styles.errorInputContainer]}>
              <Ionicons name="mail-outline" size={20} color="#1C75BC" style={styles.icon} />
              <TextInput
                placeholder="Email"
                placeholderTextColor="#b0c4de"
                style={styles.input}
                value={email}
                onChangeText={text => {
                  setEmail(text);
                  if (errors.email) setErrors({ ...errors, email: undefined });
                }}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

            {/* Phone */}
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
                  if (errors.phone) setErrors({ ...errors, phone: undefined });
                }}
                maxLength={10}
              />
            </View>
            {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}

            {/* Password */}
            <View style={[styles.inputContainer, errors.password && styles.errorInputContainer]}>
              <Ionicons name="lock-closed-outline" size={20} color="#1C75BC" style={styles.icon} />
              <TextInput
                placeholder="Password"
                placeholderTextColor="#b0c4de"
                style={styles.input}
                value={password}
                onChangeText={text => {
                  setPassword(text);
                  if (errors.password) setErrors({ ...errors, password: undefined });
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

            <TouchableOpacity
              style={styles.forgotContainer}
              onPress={() => navigation.navigate('ForgotPassword')}
            >
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.loginButton, (!email || !password || !phone) && styles.disabledButton]}
              onPress={handleLogin}
            >
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            <View style={styles.footerText}>
              <Text style={styles.footer}>Don't have an account?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                <Text style={styles.signupLink}> Sign up</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Modal for alerts */}
          <Modal
            visible={modalVisible}
            transparent
            animationType="fade"
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContainer}>
                <Text style={[styles.modalTitle, modalType === 'success' ? styles.modalTitleSuccess : styles.modalTitleError]}>
                  {modalType === 'success' ? 'Success' : 'Error'}
                </Text>
                <Text style={styles.modalMessage}>{modalMessage}</Text>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.modalButtonText}>OK</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

export default Login;




const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  headerImage: {
    width: width,
    height: 260,
    resizeMode: 'cover',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTextContainer: {
    alignItems: 'center',
    marginTop: 12,
    marginBottom: -50,
  },
  headerText: {
    fontSize: 14,
    color: '#555',
    fontStyle: 'italic',
  },
  container: {
    backgroundColor: 'rgba(255,255,255,0.97)',
    padding: 20,
    borderRadius: 16,
    elevation: 8,
    shadowColor: '#1C75BC',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.13,
    shadowRadius: 6,
    marginHorizontal: 20,
    marginTop: 0,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 10,
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
  },
  qrIcon: {
    marginLeft: 8,
    marginTop: 2,
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
  forgotContainer: {
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  forgotText: {
    color: '#1C75BC',
    fontSize: 13,
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: '#1C75BC',
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 18,
    shadowColor: '#1C75BC',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.13,
    shadowRadius: 6,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  footerText: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
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
  errorText: {
    color: 'red',
    fontSize: 13,
    marginBottom: 6,
    marginLeft: 12,
    alignSelf: 'flex-start',
  },
  // Add modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    width: '80%',
    borderRadius: 10,
    padding: 20,
    elevation: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalTitleSuccess: {
    color: '#1C75BC',
  },
  modalTitleError: {
    color: '#d9534f',
  },
  modalMessage: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#1C75BC',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});