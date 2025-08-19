import firestore from '@react-native-firebase/firestore';
import database from '@react-native-firebase/database';

class FirebaseService {
  // Firestore methods
  async addDocument(collection, data) {
    try {
      const docRef = await firestore().collection(collection).add(data);
      return docRef.id;
    } catch (error) {
      console.error('Error adding document:', error);
      throw error;
    }
  }

  async getDocuments(collection) {
    try {
      const snapshot = await firestore().collection(collection).get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting documents:', error);
      throw error;
    }
  }

  // Realtime Database methods
  async writeData(path, data) {
    try {
      await database().ref(path).set(data);
    } catch (error) {
      console.error('Error writing data:', error);
      throw error;
    }
  }

  async readData(path) {
    try {
      const snapshot = await database().ref(path).once('value');
      return snapshot.val();
    } catch (error) {
      console.error('Error reading data:', error);
      throw error;
    }
  }
}

export default new FirebaseService();