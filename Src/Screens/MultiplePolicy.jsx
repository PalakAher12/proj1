import { StyleSheet, 
  Text, 
  TouchableOpacity, 
  View, FlatList,
  ScrollView,
  SafeAreaView,
  ImageBackground,
  StatusBar,
  Modal,
  Alert,
  RefreshControl, } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Button, Card, FAB } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';

import FirestoreService, { USER_DATA_TYPES } from '../Services/firestoreService';

const firestoreService = new FirestoreService();

const MultiplePolicy = () => {
  const navigation=useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  
  const [policies, setPolicies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const loadPolicies = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const policiesData = await firestoreService.getInsurancePolicies();
      const formattedPolicies = policiesData.map((data) => ({
        id: data.id,
        name: data.policyHolderName || data.companyName || 'Policy Holder',
        policyNumber: data.policyNumber || 'N/A',
        insuranceType: data.policyType || 'General Insurance',
        ...data
      }));
      setPolicies(formattedPolicies);
    } catch (error) {
      console.log('Error loading policies:', error);
      setPolicies([]);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await loadPolicies();
    setRefreshing(false);
  }, [loadPolicies]);

  useEffect(() => {
    loadPolicies();
  }, [loadPolicies]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadPolicies);
    return unsubscribe;
  }, [navigation, loadPolicies]);

  const handleAddPolicy = React.useCallback(() => {
    navigation.navigate('InsuranceSrc1', { createNew: true });
  }, [navigation]);

  const handleViewPolicy = React.useCallback((policy) => {
    navigation.navigate('InsurancePreview', { 
      formState: policy
    });
  }, [navigation]);

  const handleLongPress = React.useCallback((policy) => {
    setSelectedPolicy(policy);
    setModalVisible(true);
  }, []);

  const handleGoBack = React.useCallback(() => {
    navigation.navigate("Maintab");
  }, [navigation]);

  const handleDeletePolicy = React.useCallback(async () => {
    if (selectedPolicy) {
      try {
        await firestoreService.deleteInsurancePolicy(selectedPolicy.id);
        await loadPolicies();
        console.log('Policy deleted successfully');
      } catch (error) {
        console.log('Error deleting policy:', error);
      }
      
      setModalVisible(false);
      setSelectedPolicy(null);
    }
  }, [selectedPolicy, loadPolicies]);

  return (
    <SafeAreaView style={styles.viewStyle1}>
      <StatusBar backgroundColor="#F8FAFC" barStyle="dark-content" />
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.btnStyle} onPress={handleGoBack}>
          <Icon name="arrow-back" size={24} color="#2E3A59" />
        </TouchableOpacity>
        <Text style={styles.header}>Insurances</Text>
        <View style={styles.placeholder} />
      </View>
      
      <View style={styles.heroContainer}>
        <View style={styles.iconWrapper}>
          <MaterialCommunityIcons name="shield-account" size={70} color="#1C75BC" />
        </View>
        <Text style={styles.heroTitle}>Insurance Policies</Text>
        <Text style={styles.heroSubtitle}>Manage your insurance coverage</Text>
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{policies.length}</Text>
            <Text style={styles.statLabel}>Total Policies</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>Active</Text>
            <Text style={styles.statLabel}>Status</Text>
          </View>
        </View>

        <Card style={styles.card2}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Your Policies</Text>
            {isLoading ? (
              <Text style={styles.loadingText}>Loading policies...</Text>
            ) : policies.length === 0 ? (
              <View style={styles.emptyContainer}>
                <MaterialCommunityIcons name="shield-off" size={60} color="#ccc" />
                <Text style={styles.emptyText}>No policies found</Text>
                <Text style={styles.emptySubtext}>Tap the + button to add your first policy</Text>
              </View>
            ) : (
              <FlatList
                data={policies}
                renderItem={({ item }) => (
                  <Card 
                    style={styles.container} 
                    onPress={() => handleViewPolicy(item)}
                    onLongPress={() => handleLongPress(item)}
                  >
                    <Card.Content style={styles.policyCard}>
                      <View style={styles.iconContainer}>
                        <MaterialCommunityIcons 
                          name={item.insuranceType?.toLowerCase().includes('health') ? 'medical-bag' : 'shield-account'} 
                          size={30} 
                          color="#1C75BC" 
                        />
                      </View>
                      <View style={styles.policyDetails}>
                        <Text style={styles.policyName}>{item.name}</Text>
                        <Text style={styles.policyType}>{item.insuranceType}</Text>
                        <Text style={styles.policyNumber}>Policy #: {item.policyNumber}</Text>
                      </View>
                      <Icon name="chevron-right" size={24} color="#1C75BC" />
                      
                    </Card.Content>
                  </Card>
                )}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ paddingBottom: 20 }}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={['#1C75BC']}
                    tintColor="#1C75BC"
                  />
                }
                removeClippedSubviews={true}
                maxToRenderPerBatch={10}
                windowSize={10}
              />
              
            )}
          </Card.Content>
        </Card>
      </View>

      <FAB style={styles.fab} icon="plus" color='white' onPress={handleAddPolicy} />
      
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Delete Policy</Text>
            <Text style={styles.modalText}>Are you sure you want to delete this policy?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.deleteButton]} 
                onPress={handleDeletePolicy}
              >
                <Icon name="delete" size={18} color="#FFF" />
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default MultiplePolicy;

const styles = StyleSheet.create({
  viewStyle1: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  contentContainer: {
    flex: 1,
    padding: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 5,
  },
  placeholder: {
    width: 40,
  },
  header: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2E3A59',
    marginLeft: 15,
    letterSpacing: 0.5,
  },
  heroContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 5,
    paddingBottom: 10,
  },
  iconWrapper: {
    borderRadius: 25,
    padding: 8,
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
  btnStyle: {
    padding: 8,
  },
  textStyle: {
    fontSize: 16,
    fontWeight: '500',
    padding: 5,
    color: 'white',
    textAlign: 'left',
  },
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#1C75BC',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#1C75BC',
    elevation: 8,
  },
  card2: {
    borderRadius: 15,
    padding: 0,
    width: '100%',
    backgroundColor: 'white',
    elevation: 4,
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    width: '48%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1C75BC',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
    color: '#1C75BC',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  policyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
  },
  iconContainer: {
    backgroundColor: '#E8F4FD',
    padding: 10,
    borderRadius: 10,
    marginRight: 15,
  },
  policyDetails: {
    flex: 1,
  },
  policyName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  policyType: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  policyNumber: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    width: '80%',
    alignItems: 'center',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    minWidth: 100,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#a39a9aff',
  },
  deleteButton: {
    backgroundColor: '#ff3b30',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: 'white',
    marginLeft: 5,
  },
  loadingText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    padding: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
});