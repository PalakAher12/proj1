// components/PrivacyPolicyModal.js
import React from 'react';
import { Modal, View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';

const PrivacyPolicyModal = ({ visible, onClose }) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>Privacy Policy</Text>

        <ScrollView style={styles.scrollArea}>
          <Text style={styles.policyContent}>
            {/* Add your actual policy here */}
            This is your privacy policy content. Lorem ipsum dolor sit amet, consectetur adipiscing elit.{"\n\n"}
            You can scroll to read everything...
          </Text>
        </ScrollView>

        <Pressable style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Close</Text>
        </Pressable>
      </View>
    </Modal>
  );
};

export default PrivacyPolicyModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  scrollArea: {
    flex: 1,
    marginBottom: 20,
  },
  policyContent: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
  },
  closeButton: {
    backgroundColor: '#4CAF50',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
