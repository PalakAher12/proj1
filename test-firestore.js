// Simple test script to verify Firestore connection
import FirestoreService from './Src/Services/FirestoreService';

const testFirestore = async () => {
  try {
    console.log('Testing Firestore connection...');
    
    // Test user ID retrieval
    const userId = await FirestoreService.getUserId();
    console.log('✅ User ID retrieved:', userId);
    
    // Test data saving
    const testData = {
      testField: 'test value',
      timestamp: new Date().toISOString()
    };
    
    const docId = await FirestoreService.saveUserData('test', testData);
    console.log('✅ Data saved with ID:', docId);
    
    // Test data retrieval
    const retrievedData = await FirestoreService.getUserDataByType('test');
    console.log('✅ Data retrieved:', retrievedData);
    
    console.log('🎉 All tests passed!');
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

export default testFirestore;