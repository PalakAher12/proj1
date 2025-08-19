// FirestoreService Usage Examples
import firestoreService, { USER_DATA_TYPES } from './firestoreService';

// Example usage of the updated FirestoreService

// 1. Save Medical Information
const saveMedicalData = async () => {
  try {
    const medicalData = {
      bloodType: 'O+',
      allergies: ['Peanuts', 'Shellfish'],
      medications: ['Aspirin'],
      conditions: ['Hypertension'],
      lastCheckup: '2024-01-15'
    };
    
    await firestoreService.saveUserData(USER_DATA_TYPES.MEDICAL, medicalData);
    console.log('✅ Medical data saved successfully');
  } catch (error) {
    console.error('❌ Error saving medical data:', error);
  }
};

// 2. Get Medical Information
const getMedicalData = async () => {
  try {
    const medicalData = await firestoreService.getUserDataByType(USER_DATA_TYPES.MEDICAL);
    console.log('📋 Medical Data:', medicalData);
    return medicalData;
  } catch (error) {
    console.error('❌ Error getting medical data:', error);
    return null;
  }
};

// 3. Save Personal Details
const savePersonalData = async () => {
  try {
    const personalData = {
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1990-05-15',
      phone: '+1234567890',
      address: '123 Main St, City, State'
    };
    
    await firestoreService.saveUserData(USER_DATA_TYPES.PERSONAL, personalData);
    console.log('✅ Personal data saved successfully');
  } catch (error) {
    console.error('❌ Error saving personal data:', error);
  }
};

// 4. Save Insurance Policy
const saveInsurancePolicy = async () => {
  try {
    const policyData = {
      policyNumber: 'POL123456',
      provider: 'Health Insurance Co.',
      coverage: 'Full Coverage',
      expiryDate: '2025-12-31'
    };
    
    const savedPolicy = await firestoreService.saveInsurancePolicy(policyData);
    console.log('✅ Insurance policy saved:', savedPolicy);
  } catch (error) {
    console.error('❌ Error saving insurance policy:', error);
  }
};

// 5. Get All User Data
const getAllData = async () => {
  try {
    const allData = await firestoreService.getAllUserData();
    console.log('📊 All User Data:', allData);
    return allData;
  } catch (error) {
    console.error('❌ Error getting all data:', error);
    return null;
  }
};

// 6. Save Emergency Contact
const saveEmergencyContact = async () => {
  try {
    const contactData = {
      name: 'Jane Doe',
      relationship: 'Spouse',
      phone: '+1987654321',
      email: 'jane@example.com'
    };
    
    const savedContact = await firestoreService.saveEmergencyContact(contactData);
    console.log('✅ Emergency contact saved:', savedContact);
  } catch (error) {
    console.error('❌ Error saving emergency contact:', error);
  }
};

// Export functions for use in components
export {
  saveMedicalData,
  getMedicalData,
  savePersonalData,
  saveInsurancePolicy,
  getAllData,
  saveEmergencyContact
};