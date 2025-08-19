import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export const USER_DATA_TYPES = {
  PERSONAL: 'personalDetails',
  MEDICAL: 'medicalInfo',
  INSURANCE: 'insuranceInfo',
  INSURANCE_POLICIES: 'insurancePolicies',
  EMERGENCY: 'emergencyContact',
};

class FirestoreService {
  constructor() {
    this.initialized = false;
    this.initializeFirestore();
  }

  // ---------- INITIALIZE FIRESTORE ----------
  async initializeFirestore() {
    try {
      if (!this.initialized) {
        // Persistence is already enabled by default in React Native Firebase
        await firestore().settings({
          cacheSizeBytes: firestore.CACHE_SIZE_UNLIMITED,
        });

        this.initialized = true;
        console.log('🔥 Firestore initialized with persistence');
      }
    } catch (error) {
      console.error('Firestore initialization error:', error);
    }
  }

  // ---------- AUTHENTICATE USER ----------
  async authenticateUser() {
    await this.initializeFirestore();
    const firebaseUser = auth().currentUser;

    if (!firebaseUser) {
      console.error('❌ Authentication Error: No user signed in');
      throw new Error('No Firebase user authenticated. Please sign in first.');
    }
    console.log('✅ User authenticated:', firebaseUser.uid);
    return firebaseUser.uid;
  }

  async getUserId() {
    return await this.authenticateUser();
  }

  // ---------- SAVE USER DATA ----------
  async saveUserData(dataType, data) {
    try {
      console.log(`📝 Attempting to save ${dataType}:`, data);
      const userId = await this.getUserId();
      const userRef = firestore().collection('Siddhi').doc(userId);

      const updateData = {
        [dataType]: data,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      };

      const docSnap = await userRef.get().catch(() => ({ exists: false }));
      if (!docSnap.exists) {
        updateData.createdAt = firestore.FieldValue.serverTimestamp();
        updateData.userId = userId;
      }

      await userRef.set(updateData, { merge: true });
      console.log(`✅ ${dataType} saved successfully`);
      return true;
    } catch (error) {
      console.error(`❌ Error saving ${dataType}:`, error);
      if (error.code) {
        console.error(`Firebase Error Code: ${error.code}`);
      }
      if (error.message) {
        console.error(`Firebase Error Message: ${error.message}`);
      }
      throw error;
    }
  }

  // ---------- GET USER DATA BY TYPE ----------
  async getUserDataByType(dataType, forceServer = false) {
    try {
      const userId = await this.getUserId();
      const docRef = firestore().collection('Siddhi').doc(userId);

      let docSnap;
      if (forceServer) {
        docSnap = await docRef.get({ source: 'server' });
      } else {
        try {
          docSnap = await docRef.get({ source: 'cache' });
          if (!docSnap.exists) {
            docSnap = await docRef.get({ source: 'server' });
          }
        } catch {
          docSnap = await docRef.get();
        }
      }

      if (!docSnap.exists) return null;

      const userData = docSnap.data();
      return userData[dataType] || null;
    } catch (error) {
      console.error(`❌ Error getting ${dataType}:`, error);
      return null;
    }
  }

  // ---------- GET ALL USER DATA ----------
  async getAllUserData(forceServer = false) {
    try {
      const userId = await this.getUserId();
      const docRef = firestore().collection('Siddhi').doc(userId);

      let docSnap;
      if (forceServer) {
        docSnap = await docRef.get({ source: 'server' });
      } else {
        try {
          docSnap = await docRef.get({ source: 'cache' });
          if (!docSnap.exists) {
            docSnap = await docRef.get({ source: 'server' });
          }
        } catch {
          docSnap = await docRef.get();
        }
      }

      if (!docSnap.exists) {
        const emptyData = {};
        Object.values(USER_DATA_TYPES).forEach(type => (emptyData[type] = null));
        return emptyData;
      }

      const data = docSnap.data();
      Object.values(USER_DATA_TYPES).forEach(type => {
        if (!data[type]) data[type] = null;
      });
      return data;
    } catch (error) {
      console.error('❌ Error getting all user data:', error);
      throw error;
    }
  }

  // ---------- INSURANCE POLICIES ----------
  async saveInsurancePolicy(policyData) {
    try {
      const userId = await this.getUserId();
      const userRef = firestore().collection('Siddhi').doc(userId);

      const docSnap = await userRef.get().catch(() => ({ exists: false }));
      let policies = [];

      if (docSnap.exists && Array.isArray(docSnap.data()?.insurancePolicies)) {
        policies = docSnap.data().insurancePolicies;
      }

      const policyWithId = {
        ...policyData,
        id: policyData.id || `policy_${Date.now()}`,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      };

      const existingIndex = policies.findIndex(p => p.id === policyWithId.id);
      if (existingIndex >= 0) {
        policies[existingIndex] = { ...policies[existingIndex], ...policyWithId };
      } else {
        policyWithId.createdAt = firestore.FieldValue.serverTimestamp();
        policies.push(policyWithId);
      }

      await userRef.set(
        {
          insurancePolicies: policies,
          updatedAt: firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      );

      return policyWithId;
    } catch (error) {
      console.error('❌ Error saving insurance policy:', error);
      throw error;
    }
  }

  async getInsurancePolicies(forceServer = false) {
    try {
      const data = await this.getUserDataByType('insurancePolicies', forceServer);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('❌ Error getting insurance policies:', error);
      return [];
    }
  }

  async deleteInsurancePolicy(policyId) {
    try {
      const policies = await this.getInsurancePolicies();
      const filteredPolicies = policies.filter(p => p.id !== policyId);

      await this.saveUserData('insurancePolicies', filteredPolicies);
      return true;
    } catch (error) {
      console.error('❌ Error deleting insurance policy:', error);
      return false;
    }
  }

  // ---------- EMERGENCY CONTACTS ----------
  async saveEmergencyContact(contactData) {
    try {
      const contacts = await this.getEmergencyContacts();

      const contactWithId = {
        ...contactData,
        id: contactData.id || `contact_${Date.now()}`,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      };

      const existingIndex = contacts.findIndex(c => c.id === contactWithId.id);
      if (existingIndex >= 0) {
        contacts[existingIndex] = { ...contacts[existingIndex], ...contactWithId };
      } else {
        contactWithId.createdAt = firestore.FieldValue.serverTimestamp();
        contacts.push(contactWithId);
      }

      await this.saveUserData('emergencyContact', contacts);
      return contactWithId;
    } catch (error) {
      console.error('❌ Error saving emergency contact:', error);
      throw error;
    }
  }

  async getEmergencyContacts(forceServer = false) {
    try {
      const data = await this.getUserDataByType('emergencyContact', forceServer);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('❌ Error getting emergency contacts:', error);
      return [];
    }
  }

  async deleteEmergencyContact(contactId) {
    try {
      const contacts = await this.getEmergencyContacts();
      const filteredContacts = contacts.filter(c => c.id !== contactId);

      await this.saveUserData('emergencyContact', filteredContacts);
      return true;
    } catch (error) {
      console.error('❌ Error deleting emergency contact:', error);
      return false;
    }
  }

  // ---------- SYNC DATA ----------
  async syncData() {
    try {
      await firestore().enableNetwork();
      console.log('🔄 Data sync enabled');
      return true;
    } catch (error) {
      console.error('❌ Sync error:', error);
      return false;
    }
  }
}

export default FirestoreService;
