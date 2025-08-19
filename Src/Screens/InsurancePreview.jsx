import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, RefreshControl, Alert } from 'react-native';
import { Card } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FirestoreService from '../Services/firestoreSrevice'; // Adjust the import path as necessary

const InsurancePreview = ({ navigation, route }) => {
  const [userId, setUserId] = useState(null);
  const [formData, setFormData] = useState(route.params?.formState || {});
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const initializeAndLoadData = useCallback(async () => {
    try {
      const id = await FirestoreService.getUserId();
      setUserId(id);
      await loadInsuranceData(id);
    } catch (error) {
     console.log('Error initializing:', error);
      if (route.params?.formState) {
        setFormData(route.params.formState);
      }
    } finally {
      setLoading(false);
    }
  }, [route.params?.formState]);

  const loadInsuranceData = useCallback(async (id) => {
    if (!id) return;
    
    try {
      if (route.params?.formState) {
        setFormData(route.params.formState);
        console.log('Loaded policy data from params');
      } else {
        setFormData({});
      }
    } catch (error) {
      console.log('Error loading insurance data:', error);
      setFormData({});
    }
  }, [route.params?.formState]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    if (userId) {
      await loadInsuranceData(userId);
    }
    setRefreshing(false);
  }, [userId, loadInsuranceData]);

  useEffect(() => {
    initializeAndLoadData();
  }, [initializeAndLoadData]);
  


 const handleBack = () => {
    navigation.navigate('MultiplePolicy');
  };
  return (
    <View style={styles.viewStyle}>
      <StatusBar backgroundColor="#F8FAFC" barStyle="dark-content" />
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#1C75BC']}
           tintColor="#1C75BC"
         />
        }
        style={styles.scrollContainer}
      >
        <View style={styles.heroContainer}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Icon name="arrow-back" size={24} color="#2E3A59" />
          </TouchableOpacity>
            
          <View style={styles.iconWrapper}>
            <MaterialCommunityIcons name="shield-account" size={60} color="#1C75BC" />
          </View>
          <Text style={styles.heroTitle}>Health Insurance Card</Text>
          <Text style={styles.heroSubtitle}>Policy Details</Text>
        </View>

            <View style={styles.container}>
              {loading ? (
                <Text style={styles.loadingText}>Loading insurance data...</Text>
              ) : (
                getOrderedFields(formData).map(([key, value, isEmpty], index) => (
                  <View key={key} style={styles.dataRow}>
                    <Text style={styles.label}>{formatKey(key)}</Text>
                    <Text style={[styles.value, isEmpty && styles.noDataText]}>{value}</Text>
                  </View>
                ))
              )}
            </View>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => {
              navigation.navigate('InsuranceSrc1', {
                policyData: formData,
                createNew: false
              });
            }}
          >
            <Icon name="edit" size={24} color="#1C75BC" />
            <Text style={styles.editButtonText}>Edit </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.nextButton}
            onPress={() => navigation.navigate('MultiplePolicy')}
          >
            <Icon name="list" size={24} color="#1C75BC" />
            <Text style={styles.nextButtonText}>All Policies</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

// 🔤 Convert camelCase to readable labels
const formatKey = (key) => {
 return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
};

// 📋 Get fields in specific order 
const getOrderedFields = (formState) => {
  const fieldOrder = [
    'companyName',
    'serviceNumber', 
    'emailOfCompany',
    'policyHolderName',  
    'policyNumber',
    'policyType',
    'sumInsured',
    'policyStartDate',
    'policyEndDate',
    'nomineeName',
    'nomineeRelation',
    'nomineePhn',
    'claimAmount',
    'claimLink',
    'claimHelpPhn',
    'adharcardNo',
    'pancardNo'
  ];
  
  return fieldOrder.map(key => {
    const hasData = formState[key] && formState[key].toString().trim() !== '';
    return [
      key, 
      hasData ? formState[key] : '-- Not Provided --',
      !hasData // isEmpty flag
    ];
  });
};

export default InsurancePreview;

const styles = StyleSheet.create({
  viewStyle: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  backButton: {
    position: 'absolute',
    top: 15,
    left: 20,
    padding: 8,
    zIndex: 2,
  },
  heroContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
    marginBottom: 10,
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
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
  evenRow: {
    backgroundColor: '#F8FAFF',
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
    fontWeight: '300',
  },
  editButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    justifyContent: 'center',
    marginRight: 10,
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
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  nextButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    justifyContent: 'center',
    marginLeft: 10,
  },
  nextButtonText: {
    color: '#1C75BC',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  loadingText: {
    color: '#666',
    fontSize: 16,
    fontStyle: 'italic',
    marginTop: 8,
  },
});
