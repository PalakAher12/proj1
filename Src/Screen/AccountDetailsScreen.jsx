import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, RefreshControl, TextInput, TouchableOpacity, Alert } from 'react-native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Platform, ToastAndroid } from 'react-native';

const PersonalDetails = () => {
  const userId = auth().currentUser?.uid;

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [personalDetails, setPersonalDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchUserDetails = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, 'Siddhi', userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        setFullName(userData.fullName || '');
        setEmail(userData.email || '');
        setPhone(userData.phone || '');
        setPersonalDetails({
          address: userData.personalDetails?.address || '',
          birthDate: userData.personalDetails?.birthDate || '',
          bloodGrp: userData.personalDetails?.bloodGrp || '',
          gender: userData.personalDetails?.gender || '',
          height: userData.personalDetails?.height || '',
          weight: userData.personalDetails?.weight || '',
        });
      }
    } catch (error) {
      console.error('Error getting user data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchUserDetails();
  };

  const saveChanges = async () => {
    setSaving(true);
    try {
      const docRef = doc(db, 'Siddhi', userId);
      await updateDoc(docRef, {
        fullName,
        email,
        phone,
        personalDetails: personalDetails
      });
      setIsEditing(false);

      // Toast message
      if (Platform.OS === 'android') {
        ToastAndroid.show("Details updated successfully", ToastAndroid.SHORT);
      } else {
        console.warn("Details updated successfully");
      }
    } catch (error) {
      console.error('Error updating user data:', error);
      if (Platform.OS === 'android') {
        ToastAndroid.show("Failed to update details", ToastAndroid.SHORT);
      } else {
        console.warn("Failed to update details");
      }
    } finally {
      setSaving(false); // stop loader
    }
  };

  return loading ? (
    <View style={styles.loader}>
      <ActivityIndicator size="large" color="#4D94CC" />
    </View>
  ) : (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#4D94CC']}
          tintColor="#4D94CC"
        />
      }
    >
      <View style={styles.card}>
        <Text style={styles.title}>Personal Information</Text>

        {/* Full Name */}
        {isEditing ? (
          <TextInput style={styles.input} value={fullName} onChangeText={setFullName} />
        ) : (
          <Text style={styles.value}>Full Name: {fullName}</Text>
        )}

        {/* Email */}
        {isEditing ? (
          <TextInput style={styles.input} value={email} onChangeText={setEmail} />
        ) : (
          <Text style={styles.value}>Email: {email}</Text>
        )}

        {/* Phone */}
        {isEditing ? (
          <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad"
            maxLength={10} />
        ) : (
          <Text style={styles.value}>Phone: {phone}</Text>
        )}

        {/* Birth Date */}
        {isEditing ? (
          <TextInput
            style={styles.input}
            value={personalDetails.birthDate}
            keyboardType="phone-pad"
            onChangeText={(text) => setPersonalDetails({ ...personalDetails, birthDate: text })}
          />
        ) : (
          <Text style={styles.value}>Birth Date: {personalDetails.birthDate}</Text>
        )}

        {/* Address */}
        {isEditing ? (
          <TextInput
            style={styles.input}
            value={personalDetails.address}
            onChangeText={(text) => setPersonalDetails({ ...personalDetails, address: text })}
          />
        ) : (
          <Text style={styles.value}>Address: {personalDetails.address}</Text>
        )}

        {/* Blood Group */}
        {isEditing ? (
          <TextInput
            style={styles.input}
            value={personalDetails.bloodGrp}
            onChangeText={(text) => setPersonalDetails({ ...personalDetails, bloodGrp: text })}
          />
        ) : (
          <Text style={styles.value}>Blood Group: {personalDetails.bloodGrp}</Text>
        )}

        {/* Gender */}
        {isEditing ? (
          <TextInput
            style={styles.input}
            value={personalDetails.gender}
            onChangeText={(text) => setPersonalDetails({ ...personalDetails, gender: text })}
          />
        ) : (
          <Text style={styles.value}>Gender: {personalDetails.gender}</Text>
        )}

        {/* Height */}
        {isEditing ? (
          <TextInput
            style={styles.input}
            value={personalDetails.height}
            onChangeText={(text) => setPersonalDetails({ ...personalDetails, height: text })}
          />
        ) : (
          <Text style={styles.value}>Height: {personalDetails.height}</Text>
        )}

        {/* Weight */}
        {isEditing ? (
          <TextInput
            style={styles.input}
            value={personalDetails.weight}
            onChangeText={(text) => setPersonalDetails({ ...personalDetails, weight: text })}
          />
        ) : (
          <Text style={styles.value}>Weight: {personalDetails.weight}</Text>
        )}

        {/* Action Buttons */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: isEditing ? '#4CAF50' : '#4D94CC' }]}
          onPress={isEditing ? saveChanges : () => setIsEditing(true)}
          disabled={saving} // disable during save
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>{isEditing ? 'Save' : 'Edit'}</Text>
          )}
        </TouchableOpacity>

        {isEditing && (
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#f44336', marginTop: 10 }]}
            onPress={() => setIsEditing(false)}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

export default PersonalDetails;

const styles = StyleSheet.create({
  // Layout & container styles
  container: { 
    flexGrow: 1, 
    backgroundColor: '#f5f5f5', 
    justifyContent: 'center', 
    padding: 20 
  },
  card: { 
    backgroundColor: '#fff', 
    borderRadius: 12, 
    padding: 20, 
    elevation: 4 
  },

  // Text styles
  title: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    marginBottom: 20, 
    color: '#1C75BC', 
    textAlign: 'center' 
  },
  value: { 
    fontSize: 16, 
    marginBottom: 10, 
    color: '#000', 
    
  },

  // Input styles
  input: { 
    borderWidth: 1, 
    borderColor: '#ccc', 
    borderRadius: 8, 
    padding: 8, 
    marginBottom: 10, 
    fontSize: 16 
  },

  // Button styles
  button: { 
    padding: 12, 
    borderRadius: 8, 
    alignItems: 'center' 
  },
  buttonText: { 
    color: '#fff', 
    fontWeight: 'bold', 
    fontSize: 16 
  },

  // Loader styles
  loader: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  }
});
