// components/DoctorBookingModal.js
import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const DoctorBookingModal = ({ visible, onClose, doctor }) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Book Appointment</Text>
          <Text style={styles.doctorName}>{doctor?.name}</Text>
          <Text style={styles.info}>Specialization: {doctor?.specialization}</Text>
          <Text style={styles.info}>Available: {doctor?.available}</Text>

          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default DoctorBookingModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingVertical:60
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
  },
  info: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  closeBtn: {
    marginTop: 20,
    backgroundColor: '#7B75F5',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 10,
  },
  closeText: {
    color: '#fff',
    fontWeight: '600',
  },
});
