import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  ScrollView, 
  RefreshControl, 
  ActivityIndicator
} from 'react-native';
import React, { useState, useEffect } from 'react';

import Icon from 'react-native-vector-icons/MaterialIcons';
import FirestoreService, { USER_DATA_TYPES } from '../Services/firestoreService';

const firestoreService = new FirestoreService();

const MedicalReportPreview = ({ navigation }) => {
  const [medicalInfo, setMedicalInfo] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [checkingFirstTime, setCheckingFirstTime] = useState(true);
  const [error, setError] = useState(null);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchMedicalData();
    setRefreshing(false);
  };

  useEffect(() => {
    checkFirstTimeAndLoadData();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (!checkingFirstTime) {
        fetchMedicalData();
      }
    });
    return unsubscribe;
  }, [navigation, checkingFirstTime]);

  const checkFirstTimeAndLoadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const userData = await firestoreService.getUserDataByType(USER_DATA_TYPES.MEDICAL);
      
      // Check if this is first time (no data exists)
      const hasData = userData && Object.keys(userData).length > 0 && 
                     Object.values(userData).some(value => value && value.toString().trim() !== '');
      
      if (!hasData) {
        // First-time user, redirect to form
        navigation.replace('MedicalInfo');
        return;
      } else {
        setMedicalInfo(userData);
        console.log('Loaded existing medical data for preview');
      }
    } catch (error) {
      console.log('Error checking medical data:', error);
      setError('Failed to load medical data');
      setMedicalInfo({});
    } finally {
      setLoading(false);
      setCheckingFirstTime(false);
    }
  };

  const fetchMedicalData = async () => {
    try {
      setLoading(true);
      setError(null);

      const userData = await firestoreService.getUserDataByType(USER_DATA_TYPES.MEDICAL);
      
      if (userData) {
        setMedicalInfo(userData);
        console.log('Refreshed medical data from Firestore');
      } else {
        setMedicalInfo({});
      }
    } catch (error) {
      console.log('Error loading medical info:', error);
      setError('Failed to load medical data');
      setMedicalInfo({});
    } finally {
      setLoading(false);
    }
  };

const handleBack = () => {
  navigation.reset({
    index: 0,
    routes: [{ name: 'Maintab' }],
  });
};


  const getMedicalFields = (medicalInfo) => [
    ['Medical Conditions', medicalInfo.medicalConditions],
    ['Allergies', medicalInfo.allergies],
    ['Past Surgeries', medicalInfo.pastSurgery],
    ['Chronic Illnesses', medicalInfo.chronicIllnesses],
    ['Family Medical History', medicalInfo.familyMedicalHistory],
  ];

  if (checkingFirstTime) {
    return (
      <View style={styles.loaderScreen}>
        <ActivityIndicator size="large" color="#0A66C2" />
        <Text style={styles.loaderText}>Loading your medical report...</Text>
      </View>
    );
  }

  return (
    <View style={styles.viewStyle}>
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.btnStyle} onPress={handleBack}>
          <Icon name="arrow-back" size={24} color="#2E3A59" />
        </TouchableOpacity>
        <Text style={styles.header}>Medical Report</Text>
        <View style={styles.btnStyle} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#1C75BC']} tintColor="#1C75BC" />
        }
        style={styles.scrollContainer}
      >
        <View style={styles.heroContainer}>
          <View style={styles.iconWrapper}>
            <Icon name="medical-services" size={80} color="#1C75BC" />
          </View>
          <Text style={styles.heroTitle}>Medical Report Card</Text>
          <Text style={styles.heroSubtitle}>Report Details</Text>
        </View>

        
            <View style={styles.container}>
              {loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#1C75BC" />
                  <Text style={styles.loadingText}>Loading medical data...</Text>
                </View>
              ) : error ? (
                <View style={styles.errorContainer}>
                  <Icon name="error" size={24} color="#ff3b30" />
                  <Text style={styles.errorText}>{error}</Text>
                  <TouchableOpacity onPress={fetchMedicalData} style={styles.retryButton}>
                    <Text style={styles.retryText}>Retry</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                getMedicalFields(medicalInfo).map(([label, value], index) => (
                  <View key={label} style={styles.dataRow}>
                    <Text style={styles.label}>{label}</Text>
                    <Text style={[styles.value, !value || value.toString().trim() === '' ? styles.noDataText : null]}>
                      {value && value.toString().trim() !== '' ? value : '-- Not Provided --'}
                    </Text>
                  </View>
                ))
              )}
            </View>
          

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate('MedicalInfo')}
          >
            <Icon name="edit" size={20} color="#1C75BC" />
            <Text style={styles.editButtonText}>Edit Medical Info</Text>
          </TouchableOpacity>
          
        </View>
      </ScrollView>
    </View>
  );
};

export default MedicalReportPreview;

const styles = StyleSheet.create({
  viewStyle: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 10,
  },
  header: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2E3A59',
    textAlign: 'center',
    flex: 1,
    letterSpacing: 0.5,
  },
  heroContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginBottom: 10,
  },
  iconWrapper: {
    backgroundColor: 'transparent',
    borderRadius: 50,
    padding: 15,
    marginBottom: 15,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
  },
  scrollContainer: {
    flex: 1,
  },
  container: {
    padding: 10,
  },

  dataRow: {
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  label: {
    fontWeight: '600',
    fontSize: 15,
    color: '#444',
    flex: 1,
  },
  value: {
    fontSize: 15,
    color: '#1C75BC',
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  noDataText: {
    color: '#ff3b30',
    fontWeight: '400',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    justifyContent: 'center',
  },
  editButtonText: {
    color: '#1C75BC',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  btnStyle: {
    padding: 8,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    marginVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    color: '#666',
    fontSize: 16,
    fontStyle: 'italic',
    marginTop: 8,
  },
  loaderScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  loaderText: {
    marginTop: 12,
    fontSize: 16,
    color: '#1C75BC',
    fontWeight: '600',
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 16,
    marginTop: 8,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#1C75BC',
    borderRadius: 6,
  },
  retryText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },

});
