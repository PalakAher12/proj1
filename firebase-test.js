// Quick Firebase connectivity test
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const testFirebaseConnection = async () => {
  try {
    // Test Firebase Auth
    console.log('Testing Firebase Auth...');
    const user = auth().currentUser;
    console.log('Current user:', user ? user.uid : 'No user signed in');
    
    // Test Firestore connection
    console.log('Testing Firestore connection...');
    const testDoc = await firestore().collection('test').doc('connectivity').get();
    console.log('Firestore connection successful');
    
    return true;
  } catch (error) {
    console.error('Firebase test failed:', error);
    return false;
  }
};

export default testFirebaseConnection;