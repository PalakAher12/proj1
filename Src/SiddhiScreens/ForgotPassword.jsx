import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Ionicons from 'react-native-vector-icons/Ionicons';

import { auth } from "../firebaseconfig"; // ✅ Import your Firebase auth instance
import { sendPasswordResetEmail } from "firebase/auth"; // ✅ Import this from Firebase

const ForgotPassword = () => {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const navigation = useNavigation();

  const handleSubmit = async () => {
    const email = emailOrPhone.trim().toLowerCase();

    if (!email) {
      Alert.alert("Error", "Please enter your registered email.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert("Success", `Password reset email sent to ${email}`);
      navigation.goBack();
    } catch (error) {
      console.log("Reset error:", error.message);
      if (error.code === 'auth/user-not-found') {
        Alert.alert("Error", "No account found with that email.");
      } else if (error.code === 'auth/invalid-email') {
        Alert.alert("Error", "Invalid email format.");
      } else {
        Alert.alert("Error", "Something went wrong. Try again later.");
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>Forgot Password</Text>
        <Text style={styles.subtext}>
          Enter your registered email or phone number to receive a reset link.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Email or Phone"
          value={emailOrPhone}
          onChangeText={setEmailOrPhone}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#aaa"
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Send Reset Link</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>
            <Ionicons name="arrow-back" size={16} color="#1C75BC" /> Back to Login
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 28,
    backgroundColor: "#f7f9fc",
    paddingVertical: 40,
  },
  heading: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 10,
    textAlign: "center",
    color: "#1a1a1a",
  },
  subtext: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 25,
    color: "#000",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  button: {
    backgroundColor: "#1C75BC",
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 25,
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 17,
    fontWeight: "600",
  },
  backText: {
    color: "#1C75BC",
    textAlign: "center",
    fontSize: 15,
    fontWeight: "500",
    marginTop: 10,
  },
});
