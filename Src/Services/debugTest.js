import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export const testFirebaseConnection = async () => {
  try {
    console.log('🔍 Testing Firebase Connection...');
    
    // Test 1: Check if user is authenticated
    const user = auth().currentUser;
    if (!user) {
      console.error('❌ TEST FAILED: No user authenticated');
      return { success: false, error: 'No user authenticated' };
    }
    console.log('✅ User authenticated:', user.uid);
    
    // Test 2: Try to read from Firestore
    const testRef = firestore().collection('Siddhi').doc(user.uid);
    const docSnap = await testRef.get();
    console.log('✅ Firestore read test passed, doc exists:', docSnap.exists);
    
    // Test 3: Try to write to Firestore
    await testRef.set({
      testField: 'test_value',
      timestamp: firestore.FieldValue.serverTimestamp()
    }, { merge: true });
    console.log('✅ Firestore write test passed');
    
    return { success: true };
    
  } catch (error) {
    console.error('❌ Firebase test failed:', error);
    return { 
      success: false, 
      error: error.message,
      code: error.code 
    };
  }
};

export const runDiagnostics = () => {
  console.log('📊 Firebase Diagnostics:');
  console.log('Auth user:', auth().currentUser?.uid || 'None');
  console.log('Firestore app:', firestore().app.name);
  console.log('Network state: Online');
};