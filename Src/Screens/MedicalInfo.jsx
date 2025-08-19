import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from "react-native";
import { Divider, Avatar, Card, TextInput, Button } from "react-native-paper";

import Icon from 'react-native-vector-icons/MaterialIcons'
import FirestoreService, { USER_DATA_TYPES } from '../Services/firestoreSrevice';

const MedicalInfo = ({ navigation, route }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditable, setIsEditable] = useState(true);
  const [validationErrors, setValidationErrors] = useState({});
  
  const [formState, setFormState] = useState({
    medicalConditions: '',
    allergies: '',
    pastSurgery: '',
    chronicIllnesses: '',
    familyMedicalHistory: '',
  });

  const medicalConditionsRef = useRef(null);
  const allergiesRef = useRef(null);
  const familyMedicalHistoryRef = useRef(null);

  useEffect(() => {
    loadExistingData();
  }, []);

  const loadExistingData = useCallback(async () => {
    try {
      const userData = await FirestoreService.getUserDataByType(USER_DATA_TYPES.MEDICAL);
      if (userData) {
        setFormState(userData);
        console.log('Loaded existing medical data');
      }
    } catch (error) {
      console.log('Error loading medical data:', error);
    }
  }, []);

  const validateForm = () => {
    const errors = {};
    
    if (!formState.medicalConditions.trim()) {
      errors.medicalConditions = 'Medical conditions field is required';
    }
    
    if (!formState.allergies.trim()) {
      errors.allergies = 'Allergies field is required';
    }
    
    if (!formState.familyMedicalHistory.trim()) {
      errors.familyMedicalHistory = 'Family medical history field is required';
    }
    
    setValidationErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      const fieldRefs = {
        medicalConditions: medicalConditionsRef,
        allergies: allergiesRef,
        familyMedicalHistory: familyMedicalHistoryRef
      };
      
      const firstErrorField = Object.keys(errors)[0];
      fieldRefs[firstErrorField]?.current?.focus();
    }
    
    return Object.keys(errors).length === 0;
  };

  const handleChange = useCallback((field, value) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }));
    
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [validationErrors]);

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const onSubmit = useCallback(async () => {
    if (!validateForm()) {
      return;
    }
    
    try {
      await FirestoreService.saveUserData(USER_DATA_TYPES.MEDICAL, formState);
      setModalVisible(true);
      setTimeout(() => {
        setModalVisible(false);
        navigation.navigate('MedicalReportPreview', { formState });
      }, 2000);
    } catch (error) {
      console.log('Error saving medical info:', error);
    }
  }, [formState, navigation, validateForm]);


  return (
     <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardAvoidStyle}
    >
      <StatusBar backgroundColor="#FFF" barStyle="dark-content" />
      
      <View style={styles.viewStyle}>
        <View style={styles.headerContainer}>
          <TouchableOpacity style={styles.btnStyle} onPress={handleGoBack}>
            <Icon name="arrow-back" size={24} color="#2E3A59" />
          </TouchableOpacity>
          <Text style={styles.mainHeading}>Medical Information</Text>
          <View style={styles.placeholder} />
        </View>
        
        <View style={styles.heroContainer}>
          <View style={styles.iconWrapper}>
            <Avatar.Icon 
              size={80} 
              icon="medical-bag" 
              color="#FFF"
              style={styles.avatar}
            />
          </View>
          <Text style={styles.heroTitle}>Your Health Profile</Text>
          <Text style={styles.heroSubtitle}>Complete your medical information for better care</Text>
        </View>
        
        <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollContainer}>
          {/* <Card style={styles.sectionCard} elevation={2}>
            <Card.Content> */}
              <Text style={styles.HeaderStyle}>MEDICAL CONDITIONS :</Text>
              {/* <Divider style={styles.divider}/> */}
              
              <View style={styles.inputContainer}>
                <TextInput
                  ref={medicalConditionsRef}
                  label="Existing Medical Condition(If Any/None)"
                  value={formState.medicalConditions}
                  mode="outlined"
                  disabled={!isEditable}
                  onChangeText={(text) => handleChange('medicalConditions', text)}
                  placeholder="e.g. Asthma, Diabetes / None"
                  left={<TextInput.Icon icon={() => <Icon name="local-hospital" size={20} color="#1C75BC" />} />}
                  style={styles.paperInput}
                  outlineColor="#E2E8F0"
                  activeOutlineColor="#1C75BC"
                  theme={{roundness:12, colors: { primary: '#1C75BC', background: 'white' } }}
                />
                {validationErrors.medicalConditions && (
                  <Text style={styles.errorText}>{validationErrors.medicalConditions}</Text>
                )}
              </View>

              <View style={styles.inputContainer}>
                <TextInput
                  ref={allergiesRef}
                  label="Allergies(If Any)"
                  value={formState.allergies}
                  mode="outlined"
                  disabled={!isEditable}
                  onChangeText={(text) => handleChange('allergies', text)}
                  placeholder="e.g. Pollen, Milk, Dust"
                  left={<TextInput.Icon icon={() => <Icon name="warning" size={20} color="#1C75BC" />} />}
                  style={styles.paperInput}
                  outlineColor="#E2E8F0"
                  activeOutlineColor="#1C75BC"
                  theme={{roundness:12, colors: { primary: '#1C75BC', background: 'white' } }}
                />
                {validationErrors.allergies && (
                  <Text style={styles.errorText}>{validationErrors.allergies}</Text>
                )}
              </View>

              <View style={styles.inputContainer}>
                <TextInput
                  label="Past Surgeries"
                  value={formState.pastSurgery}
                  mode="outlined"
                  disabled={!isEditable}
                  onChangeText={(text) => handleChange('pastSurgery', text)}
                  placeholder="If any"
                  left={<TextInput.Icon icon={() => <Icon name="healing" size={20} color="#1C75BC" />} />}
                  style={styles.paperInput}
                  outlineColor="#E2E8F0"
                  activeOutlineColor="#1C75BC"
                  theme={{roundness:12, colors: { primary: '#1C75BC', background: 'white' } }}
                />
              </View>

              <View style={styles.inputContainer}>
                <TextInput
                  label="Chronic Illness"
                  value={formState.chronicIllnesses}
                  mode="outlined"
                  disabled={!isEditable}
                  onChangeText={(text) => handleChange('chronicIllnesses', text)}
                  placeholder="If any"
                  left={<TextInput.Icon icon={() => <Icon name="favorite" size={20} color="#1C75BC" />} />}
                  style={styles.paperInput}
                  outlineColor="#E2E8F0"
                  activeOutlineColor="#1C75BC"
                  theme={{roundness:12, colors: { primary: '#1C75BC', background: 'white' } }}
                />
              </View>

              <View style={styles.inputContainer}>
                <TextInput
                  ref={familyMedicalHistoryRef}
                  label="Family Medical History (If Any)"
                  value={formState.familyMedicalHistory}
                  mode="outlined"
                  disabled={!isEditable}
                  onChangeText={(text) => handleChange('familyMedicalHistory', text)}
                  placeholder="If any"
                  left={<TextInput.Icon icon={() => <Icon name="family-restroom" size={20} color="#1C75BC" />} />}
                  style={styles.paperInput}
                  outlineColor="#E2E8F0"
                  activeOutlineColor="#1C75BC"
                  theme={{roundness:12, colors: { primary: '#1C75BC', background: 'white' } }}
                />
                {validationErrors.familyMedicalHistory && (
                  <Text style={styles.errorText}>{validationErrors.familyMedicalHistory}</Text>
                )}
              </View>
            {/* </Card.Content>
          </Card> */}


          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={onSubmit}
              activeOpacity={0.8}
            >
             <Icon name="save" size={24} color="#1C75BC" />
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          </View>

          <Modal
            visible={modalVisible}
            transparent
            animationType="fade"
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}> ✅Data Saved Successfully </Text>
              </View>
            </View>
          </Modal>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

export default MedicalInfo;

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
    paddingHorizontal: 20,
  },
  HeaderStyle: {
    fontWeight: '700',
    fontSize: 18,
    color: '#1E293B',
    marginBottom: 20,
    letterSpacing: 0.3,
  },
  inputContainer: {
    marginBottom: 16,
  },
  paperInput: {
    backgroundColor: 'white',
  },
  buttonContainer: {
    marginVertical: 30,
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F4FD',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  buttonText: {
    color: '#1C75BC',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    fontSize: 18,
    color: '#1C75BC',
    fontWeight: '600',
    textAlign: 'center',
  },
  btnStyle: {
    padding: 8,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});
