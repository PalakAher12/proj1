import React, { useCallback, useEffect, useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Keyboard,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Modal,
  RefreshControl,
  Linking,
} from "react-native";
import { Divider, Avatar, Card, TextInput, FAB } from "react-native-paper";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useForm, Controller } from "react-hook-form";
import FirestoreService, { USER_DATA_TYPES } from '../Services/firestoreService';

const firestoreService = new FirestoreService();

const EmergencyContact = ({ navigation }) => {
  const [modalVisible,setModalVisible]=useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);


  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      emergencyName: "",
      emergencyPhone: "",
      emergencyRelation: "",
    },
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await firestoreService.getEmergencyContacts();
      setContacts(data);
    } catch (error) {
      console.log('Error loading data:', error);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, []);

  const handleSaveContact = useCallback(async (data) => {
    try {
      const sanitizedData = {
        emergencyName: encodeURIComponent(data.emergencyName || ''),
        emergencyPhone: encodeURIComponent(data.emergencyPhone || ''),
        emergencyRelation: encodeURIComponent(data.emergencyRelation || '')
      };
      console.log('Attempting to save contact:', sanitizedData);
      
      if (!data.emergencyName || !data.emergencyPhone || !data.emergencyRelation) {
        console.error('Missing required fields:', data);
        alert('Please fill in all required fields: Name, Phone, and Relation');
        return;
      }
      
      console.log('Emergency contact validation passed, attempting to save...');
      
      let savedContact;
      if (isEditing && selectedContact) {
        const contactWithId = { 
          ...data, 
          id: selectedContact.id,
          createdAt: selectedContact.createdAt 
        };
        savedContact = await firestoreService.saveEmergencyContact(contactWithId);
        setIsEditing(false);
        setSelectedContact(null);
      } else {
        savedContact = await firestoreService.saveEmergencyContact(data);
      }
      
      console.log('Contact saved successfully:', encodeURIComponent(savedContact?.id || 'unknown'));
      await loadData();
      reset({ emergencyName: "", emergencyPhone: "", emergencyRelation: "" });
      setModalVisible(false);
      Keyboard.dismiss();
    } catch (error) {
      console.error('Error in handleSaveContact:', error.message || error);
      alert(`Error saving contact: ${error.message || error}`);
      // Don't close modal on error so user can retry
    }
  }, [isEditing, selectedContact, loadData, reset]);

  const handlePrevious = useCallback(() => {
    navigation.navigate("PersonalDetails");
  }, [navigation]);

  const addContact = () => {
    setModalVisible(true);
  };

  const handleCall = (phone) => {
    Linking.openURL(`tel:${phone}`);
    setDetailModalVisible(false);
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardAvoidStyle}
    >
      <StatusBar backgroundColor="#FFF" barStyle="dark-content" />
      
      <View style={styles.viewStyle}>
        <View style={styles.headerContainer}>
          <TouchableOpacity style={styles.backBtn} onPress={handlePrevious}>
            <Icon name="arrow-back" size={24} color="#2E3A59" />
          </TouchableOpacity>
          <Text style={styles.mainHeading}>Emergency Contacts</Text>
          <View style={styles.placeholder} />
        </View>
        
        <View style={styles.heroContainer}>
          <View style={styles.iconWrapper}>
            <Avatar.Icon 
              size={80} 
              icon="contacts" 
              color="#FFF"
              style={styles.avatar}
            />
          </View>
          <Text style={styles.heroTitle}>Emergency Contacts</Text>
          <Text style={styles.heroSubtitle}>Add your emergency contact information for safety</Text>
        </View>
        
        <ScrollView 
          showsVerticalScrollIndicator={false} 
          style={styles.scrollContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#1C75BC']}
              tintColor="#1C75BC"
            />
          }>
          {contacts.map((contact) => (
            <TouchableOpacity 
              key={contact.id} 
              onPress={() => {
                setSelectedContact(contact);
                setDetailModalVisible(true);
              }}
             
              style={styles.contactTouchable}
            >
              <Card style={styles.contactCard}>
                <Card.Content style={styles.contactContent}>
                  <View style={styles.contactHeader}>
                    <Icon name="person" size={24} color="#1C75BC" />
                    <Text style={styles.contactName}>{contact.emergencyName}</Text>
                  </View>
                  <View style={styles.contactDetails}>
                    <View style={styles.contactRow}>
                      <Icon name="phone" size={18} color="#6B7280" />
                      <Text style={styles.contactInfo}>{contact.emergencyPhone}</Text>
                    </View>
                    {contact.emergencyRelation && (
                      <View style={styles.contactRow}>
                        <Icon name="family-restroom" size={18} color="#6B7280" />
                        <Text style={styles.contactInfo}>{contact.emergencyRelation}</Text>
                      </View>
                    )}
                  </View>
                </Card.Content>
              </Card>
            </TouchableOpacity>
          ))}
        </ScrollView>
        
        <Modal 
          visible={modalVisible}
          animationType="fade" 
          transparent={true}>
          <TouchableOpacity 
            style={styles.modalOverlay} 
            activeOpacity={1} 
            onPress={() => setModalVisible(false)}>
            <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
              <Card style={styles.modalCard} elevation={2}>
                <Card.Content>
                  <TouchableOpacity 
                    style={styles.closeButton} 
                    onPress={() => setModalVisible(false)}
                    activeOpacity={0.7}>
                    <Icon name="close" size={24} color="#6B7280" />
                  </TouchableOpacity>
                  <Text style={styles.modalTitle}>Add Emergency Contact</Text>
              <View style={styles.modalInputContainer}>
                <Controller
                  control={control}
                  name="emergencyName"
                  rules={{ required: "Contact name is required" }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      label="Contact Name"
                      value={value}
                      mode="outlined"
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="Enter full name"
                      left={<TextInput.Icon icon={() => <Icon name="person" size={22} color="#1C75BC" />} />}
                      style={styles.modalPaperInput}
                      outlineColor="#D1D5DB"
                      activeOutlineColor="#1C75BC"
                      theme={{
                        roundness: 12,
                        colors: {
                          primary: '#1C75BC',
                          background: '#FAFBFC',
                          outline: '#D1D5DB',
                          onSurfaceVariant: '#6B7280'
                        }
                      }}
                      error={!!errors.emergencyName}
                      contentStyle={{ fontSize: 16, color: '#1F2937' }}
                    />
                  )}
                />
                {errors.emergencyName && (
                  <Text style={styles.modalError}>{errors.emergencyName.message}</Text>
                )}
              </View>

              <View style={styles.modalInputContainer}>
                <Controller
                  control={control}
                  name="emergencyPhone"
                  rules={{
                    required: "Phone number is required",
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: "Enter a valid 10-digit number",
                    },
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      label="Phone Number"
                      value={value}
                      mode="outlined"
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="Enter phone number"
                      keyboardType="phone-pad"
                      left={<TextInput.Icon icon={() => <Icon name="phone" size={22} color="#1C75BC" />} />}
                      style={styles.modalPaperInput}
                      outlineColor="#D1D5DB"
                      activeOutlineColor="#1C75BC"
                      theme={{
                        roundness: 12,
                        colors: {
                          primary: '#1C75BC',
                          background: '#FAFBFC',
                          outline: '#D1D5DB',
                          onSurfaceVariant: '#6B7280'
                        }
                      }}
                      error={!!errors.emergencyPhone}
                      contentStyle={{ fontSize: 16, color: '#1F2937' }}
                    />
                  )}
                />
                {errors.emergencyPhone && (
                  <Text style={styles.modalError}>{errors.emergencyPhone.message}</Text>
                )}
              </View>

              <View style={styles.modalInputContainer}>
                <Controller
                  control={control}
                  name="emergencyRelation"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      label="Relationship (Optional)"
                      value={value}
                      mode="outlined"
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="e.g., Spouse, Parent, Sibling"
                      left={<TextInput.Icon icon={() => <Icon name="family-restroom" size={22} color="#1C75BC" />} />}
                      style={styles.modalPaperInput}
                      outlineColor="#D1D5DB"
                      activeOutlineColor="#1C75BC"
                      theme={{
                        roundness: 12,
                        colors: {
                          primary: '#1C75BC',
                          background: '#FAFBFC',
                          outline: '#D1D5DB',
                          onSurfaceVariant: '#6B7280'
                        }
                      }}
                      contentStyle={{ fontSize: 16, color: '#1F2937' }}
                    />
                  )}
                />
                <View style={styles.modalButtonContainer}>
                  <TouchableOpacity 
                    style={styles.modalButton} 
                    onPress={handleSubmit(handleSaveContact)}
                    activeOpacity={0.8}>
                    <Icon name={isEditing ? "save" : "add"} size={20} color="#FFF" />
                    <Text style={styles.modalButtonText}>{isEditing ? "Save Changes" : "Add Contact"}</Text>
                  </TouchableOpacity>
                </View>
              </View>
                </Card.Content>
              </Card>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
        
        <FAB style={styles.fab} icon="plus" color='white' onPress={addContact}/>
        
        {/* Detail Modal */}
        <Modal 
          visible={detailModalVisible}
          animationType="fade" 
          transparent={true}>
          <TouchableOpacity 
            style={styles.modalOverlay} 
            activeOpacity={1} 
            onPress={() => {
              setDetailModalVisible(false);
              setIsEditing(false);
            }}>
            <TouchableOpacity  onPress={(e) => e.stopPropagation()}>
              <Card style={styles.modalCard}>
                <Card.Content>
                  <TouchableOpacity 
                    style={styles.closeButton} 
                    onPress={() => {
                      setDetailModalVisible(false);
                      setIsEditing(false);
                    }}
                   
                    >
                    <Icon name="close" size={20} color="#6B7280" />
                  </TouchableOpacity>

                  <Text style={styles.modalTitle}>Contact Details</Text>
                  
                  {selectedContact && (
                    <>
                      <View style={styles.detailRow}>
                        <Icon name="person" size={20} color="#1C75BC" />
                        <Text style={styles.detailLabel}>Name:</Text>
                        <Text style={styles.detailValue}>{selectedContact.emergencyName}</Text>
                      </View>
                      
                      <View style={styles.detailRow}>
                        <Icon name="phone" size={20} color="#1C75BC" />
                        <Text style={styles.detailLabel}>Phone:</Text>
                        <Text style={styles.detailValue}>{selectedContact.emergencyPhone}</Text>
                      </View>
                      
                      {selectedContact.emergencyRelation && (
                        <View style={styles.detailRow}>
                          <Icon name="family-restroom" size={20} color="#1C75BC" />
                          <Text style={styles.detailLabel}>Relation:</Text>
                          <Text style={styles.detailValue}>{selectedContact.emergencyRelation}</Text>
                        </View>
                      )}
                      
                      <View style={styles.detailButtonContainer}>

                        <TouchableOpacity
                          style={styles.callButton}
                          onPress={() => handleCall(selectedContact.emergencyPhone)}
                          activeOpacity={0.8}>
                            <Icon name="phone" size={18} color="#FFF" />
                            <Text style={styles.callButtonText}>Call</Text>
                          </TouchableOpacity>

                        <TouchableOpacity 
                          style={styles.editButton} 
                          onPress={() => {
                            reset(selectedContact);
                            setDetailModalVisible(false);
                            setIsEditing(true);
                            setModalVisible(true);
                          }}
                          activeOpacity={0.8}>
                          <Icon name="edit" size={18} color="#1C75BC" />
                          <Text style={styles.editButtonText}>Edit</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                          style={styles.deleteButton} 
                          onPress={async () => {
                            try {
                              const success = await firestoreService.deleteEmergencyContact(selectedContact.id);
                              if (success) {
                                await loadData();
                                setDetailModalVisible(false);
                              } else {
                                console.error('Failed to delete contact');
                              }
                            } catch (error) {
                              console.error('Error deleting contact:', error);
                            }
                          }}
                          activeOpacity={0.8}>
                          <Icon name="delete" size={16} color="#FFF" />
                          <Text style={styles.deleteButtonText}>Delete</Text>
                        </TouchableOpacity>
                      </View>
                    </>
                  )}
                </Card.Content>
              </Card>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
        

      </View>
    </KeyboardAvoidingView>
  );
};

export default EmergencyContact;

const styles = StyleSheet.create({
  keyboardAvoidStyle: {
    flex: 1
  },
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
  placeholder: {
    width: 40,
  },
  mainHeading: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2E3A59',
    flex: 1,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  heroContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  iconWrapper: {
    backgroundColor: 'transparent',
    borderRadius: 35,
    padding: 8,
    marginBottom: 8,
  },
  avatar: {
    backgroundColor: '#1C75BC',
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  contactTouchable: {
    marginBottom: 16,
  },

  modalInputContainer: {
    marginBottom: 18,
    width: '100%',
    paddingHorizontal: 16,
  },
  modalPaperInput: {
    backgroundColor: '#FAFBFC',
    width: '100%',
    fontSize: 16,
    height: 56,
  },

  backBtn: {
    padding: 8,
  },
  fab: {
    position: 'absolute',
    right: 14,
    bottom: 30,
    backgroundColor: '#1C75BC',
    elevation: 8,
    borderRadius: 28,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 20,
    
  },
  modalCard: {
    borderRadius: 16,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 10,
    borderWidth: 0.5,
    borderColor: '#E5E7EB',
    paddingVertical: 8,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 24,
    marginTop: 8,
    letterSpacing: 0.3,
    paddingHorizontal: 16,
  },
  modalButtonContainer: {
    marginTop: 24,
    marginBottom: 8,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  modalButton: {
    flexDirection: 'row',
    backgroundColor: '#1C75BC',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxWidth: 280,
    shadowColor: '#1C75BC',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },
  modalButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
    letterSpacing: 0.3,
  },
  modalError: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 6,
    marginLeft: 12,
    fontWeight: '500',
  },
  contactCard: {
    borderRadius: 16,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    width: '100%',
    // shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    // elevation: 1,
  },
  contactContent: {
    padding: 16,
  },
  contactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginLeft: 12,
    flex: 1,
  },
  contactDetails: {
    marginLeft: 36,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  contactInfo: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    paddingHorizontal: 20,
    paddingVertical: 4,
    width: '100%',
   
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 12,
    Width: '100%',
  },
  detailValue: {
    fontSize: 14,
    color: '#1F2937',
    marginLeft: 8,
   
  },
  detailButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
    marginBottom: 8,
    paddingHorizontal: 0,
    gap: 8,
  },
  callButton: {
    flexDirection: 'row',
    backgroundColor: '#10B981',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  callButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 6,
  },
  editButton: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#1C75BC',
    flex: 1,
    shadowColor: '#1C75BC',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  editButtonText: {
    color: '#1C75BC',
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 6,
  },
  deleteButton: {
    flexDirection: 'row',
    backgroundColor: '#EF4444',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  deleteButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 6,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },

});