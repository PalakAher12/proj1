import React from 'react';
import { Modal, View, Text, StyleSheet, Pressable } from 'react-native';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';

const LogoutModal = ({ visible = false, onClose }) => {
  const navigation = useNavigation(); // ✅ moved inside the component

const handleLogout = async () => {
  try {
    await auth().signOut(); // sign out from Firebase
    navigation.replace('Login'); // replace so back button can't go back
  } catch (error) {
    console.log('Logout Error:', error);
  }
};


  return (
    <Modal
      visible={!!visible} // ensure boolean
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>Logout</Text>
          <Text style={styles.modalMessage}>Are you sure you want to logout?</Text>

          <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', width: '100%' }}>
            <Pressable style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>

            <Pressable style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutButtonText}>Logout</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default LogoutModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingVertical: 60,
  },
  modalCard: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalMessage: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
    marginBottom: 20,
  },
  closeButton: {
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#f44336',
    fontSize: 16,
    fontWeight: '600',
  },
});
