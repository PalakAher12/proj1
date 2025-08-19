import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
 import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Feather from 'react-native-vector-icons/Feather';
const ChangePasswordScreen = ({ navigation }) => {

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [update,updatePassword] = useState ("")
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});

 

const handlePasswordChange = async () => {
  let valid = true;
  let newErrors = {};

  if (!currentPassword) {
    newErrors.current = 'Current password is required';
    valid = false;
  }
  if (!newPassword) {
    newErrors.new = 'New password is required';
    valid = false;
  }
  if (!confirmPassword) {
    newErrors.confirm = 'Please confirm your new password';
    valid = false;
  }
  if (newPassword && confirmPassword && newPassword !== confirmPassword) {
    newErrors.confirm = 'New passwords do not match';
    valid = false;
  }

  setErrors(newErrors);
  if (!valid) return;

  try {
    const user = auth().currentUser;

    if (!user) {
      Alert.alert('Error', 'No authenticated user found.');
      return;
    }

    // 🔁 Step 1: Re-authenticate with Email and Password
    // const credential = auth.EmailAuthProvider.credential(user.email, currentPassword);

    // // This works on Android!
    // await user.reauthenticateWithCredential(credential);

    // // 🔁 Step 2: Update password in Firebase Auth
    // await user.updatePassword(newPassword);

    // // 🔁 Step 3: Update password in Firestore
    await firestore().collection('Siddhi').doc(user.uid).update({
      password: newPassword,
    });

    Alert.alert('Success', 'Your password has been changed successfully.', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  } catch (error) {
    console.error('Password update error:', error);
    let msg = error.message;

    if (msg.includes('auth/wrong-password')) {
      msg = 'Current password is incorrect.';
    }

    Alert.alert('Error', msg || 'Password update failed. Try again.');
  }
};

  const renderPasswordInput = (
    placeholder,
    value,
    setValue,
    show,
    setShow,
    errorKey
  ) => (
    <View style={{ marginBottom: 20 }}>
      <View style={styles.passwordWrapper}>
        <TextInput
          placeholder={placeholder}
          placeholderTextColor="grey"
          secureTextEntry={!show}
          style={styles.input}
          value={value}
          onChangeText={(text) => {
            setValue(text);
            if (errors[errorKey]) {
              setErrors((prev) => ({ ...prev, [errorKey]: '' }));
            }
          }}
        />
        <TouchableWithoutFeedback onPress={() => setShow(!show)}>
          <Feather
            name={show ? 'eye' : 'eye-off'}
            size={20}
            color="#555"
            style={styles.eyeIcon}
          />
        </TouchableWithoutFeedback>
      </View>
      {errors[errorKey] && (
        <Text style={styles.errorText}>{errors[errorKey]}</Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Change Password</Text>

      {renderPasswordInput(
        'Current Password',
        currentPassword,
        setCurrentPassword,
        showCurrent,
        setShowCurrent,
        'current'
      )}
      {renderPasswordInput(
        'New Password',
        newPassword,
        setNewPassword,
        showNew,
        setShowNew,
        'new'
      )}
      {renderPasswordInput(
        'Confirm New Password',
        confirmPassword,
        setConfirmPassword,
        showConfirm,
        setShowConfirm,
        'confirm'
      )}

      <TouchableOpacity style={styles.button} onPress={handlePasswordChange}>
        <Text style={styles.buttonText}>Update Password</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ChangePasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: '#f5f5f5',
  },
  input: {
    flex: 1,
    height: 50,
    color: '#000',
  },
  eyeIcon: {
    paddingHorizontal: 5,
  },
  button: {
    backgroundColor: '#1C75BC',
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    marginTop: 5,
    marginLeft: 5,
    fontSize: 12,
  },
});