import React, { useState, useCallback, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Keyboard,
} from "react-native";
import { Divider } from "react-native-paper";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Styling from "../Screens/Styling";
import { useForm, Controller } from "react-hook-form";
import FirestoreService from '../Services/firestoreSrevice';


const StartInsuranceFile = ({ navigation }) => {
  const [userId, setUserId] = useState(null);

     const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
      } = useForm({
        defaultValues: {
          insuranceProvider: "",
          policyNumber: "",
          insuranceContact: "",
        },
      });

  useEffect(() => {
    initializeUser();
  }, []);

  const initializeUser = async () => {
    try {
      const id = await FirestoreService.getUserId();
      setUserId(id);
      loadData(id);
    } catch (error) {
      console.log('Error initializing user:', error);
    }
  };

  const loadData = async (userIdParam = userId) => {
    if (!userIdParam) return;
    try {
      const userData = await FirestoreService.getUserDataByType(userIdParam, 'insuranceInfo');
      if (userData) {
        const { id, userId: uid, dataType, createdAt, updatedAt, ...formData } = userData;
        reset(formData);
        console.log('Loaded insurance info from Firestore');
      } else {
        const savedData = await AsyncStorage.getItem('StartInsuranceFile');
        if (savedData) {
          const data = JSON.parse(savedData);
          reset(data);
          console.log('Loaded insurance info from AsyncStorage');
        }
      }
    } catch (error) {
      console.log('Error loading insurance info:', error);
      try {
        const savedData = await AsyncStorage.getItem('StartInsuranceFile');
        if (savedData) {
          const data = JSON.parse(savedData);
          reset(data);
        }
      } catch (fallbackError) {
        console.log('Fallback load also failed:', fallbackError);
      }
    }
  };

   const getAllFormData = async () => {
      try {
         const insuranceData = await AsyncStorage.getItem('StartInsuranceFile');
        
        return {
          StartInsuranceFile: insuranceData ? JSON.parse(insuranceData) : {},
        };
      } catch (error) {
        console.log('Error getting all form data:', error);
        return {};
      }
    };

  const onSubmit = useCallback(async (data) => {
    try {
      await AsyncStorage.setItem('StartInsuranceFile', JSON.stringify(data));
      
      const docId = await FirestoreService.saveUserData(userId, 'insuranceInfo', data);
      
      console.log('Insurance info saved to Firestore with ID:', docId);
      Keyboard.dismiss();
      navigation.navigate("HomeScreen");
    } catch (error) {
      console.log('Error saving insurance info:', error);
      navigation.navigate("HomeScreen");
    }
  }, [navigation, userId]);

   const handlePrevious = useCallback(async () => {
      try {
        const currentValues = control._formValues;
        await AsyncStorage.setItem('StartInsuranceFile', JSON.stringify(currentValues));
        
        const docId = await FirestoreService.saveUserData(userId, 'insuranceInfo', currentValues);
        
        console.log('Insurance info (previous) saved to Firestore with ID:', docId);
        Keyboard.dismiss();
        navigation.navigate("MedicalInfo");
      } catch (error) {
        console.log('Error saving insurance info on previous:', error);
        navigation.navigate("MedicalInfo");
      }
    }, [navigation, control, userId]);

    const handleSkip = useCallback(async () => {
      try {
        const currentValues = control._formValues;
        await AsyncStorage.setItem('StartInsuranceFile', JSON.stringify(currentValues));
        
        const docId = await FirestoreService.saveUserData(userId, 'insuranceInfo', currentValues);
        
        console.log('Insurance info (skipped) saved to Firestore with ID:', docId);
        Keyboard.dismiss();
        navigation.navigate("HomeScreen");
      } catch (error) {
        console.log('Error saving insurance info on skip:', error);
        navigation.navigate("HomeScreen");
      }
    }, [navigation, control, userId]);
  
  return (
          
      <ScrollView nestedScrollEnabled={true} contentContainerStyle={styles.container}>
      <View style={styles.viewStyle}>
        
        <Divider />
        <Text style={styles.heading}>Medical Insurance</Text>
        <Divider />
         <Styling />

        {/* Insurance Provider */}
        <Text style={styles.HeaderStyle}>Insurance Provider Company:</Text>
        <Controller
          control={control}
          name="insuranceProvider"
          rules={{ required: "Insurance provider is required" }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Name"
              placeholderTextColor="grey"
              style={styles.textInputStyle}
              onBlur={onBlur}
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        {errors.insuranceProvider && (
          <Text style={styles.error}>{errors.insuranceProvider.message}</Text>
        )}

        {/* Policy Number (Optional) */}
        <Text style={styles.HeaderStyle}>Policy Number</Text>
        <Controller
          control={control}
          name="policyNumber"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Policy no."
              placeholderTextColor="grey"
              style={styles.textInputStyle}
              onBlur={onBlur}
              value={value}
              onChangeText={onChange}
            />
          )}
        />
      

        {/* Contact for Insurance Claims (Optional) */}
        <Text style={styles.HeaderStyle}>Contact for Insurance Claims</Text>
        <Controller
          control={control}
          name="insuranceContact"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Contact no."
              placeholderTextColor="grey"
              style={styles.textInputStyle}
              onBlur={onBlur}
              value={value}
              onChangeText={onChange}
            />
          )}
        />

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.btnStyle}
            onPress={handlePrevious}
          >
            <Text style={styles.btnTextLeft}>Previous</Text>
          </TouchableOpacity>

           <TouchableOpacity 
            style={styles.btnStyle} 
            onPress={handleSkip}
            activeOpacity={0.7}
          >
            <Text style={styles.btnTextRight}>Skip</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.btnStyle} 
            onPress={handleSubmit(onSubmit)}
            activeOpacity={0.7}
          >
            <Text style={styles.btnTextRight}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>

  )
}

export default StartInsuranceFile

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "white",
  },
  card: {
    padding: 16,
    borderRadius: 12,
    elevation: 3,
    backgroundColor: "#fff",
    marginBottom: 20,
  },
  heading: {
    marginBottom: 16,
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
    color: "#0A66C2",
  },
  viewStyle: {
    flex: 1,
    backgroundColor: "white",
  },
  HeaderStyle: {
    fontWeight: "500",
    fontSize: 16,
    marginTop: 12,
    color: "#333",
    marginBottom: 10,
    margin: 20,
  },
  textInputStyle: {
    color: "black",
    backgroundColor: "#F5F5F5",
    padding: 10,
    marginTop: 5,
    marginBottom: 10,
    borderRadius: 10,
    height: 40,
    width: "90%",
    alignSelf: "center",
  },
  btnStyle: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  error: {
    color: "#ff3b30",
    fontSize: 14,
    marginLeft: 20,
    marginTop: -5,
    marginBottom: 10,
  },
  btnText: {
    color: "#0A66C2",
    fontWeight: "bold",
    fontSize: 16,
  },
  btnTextLeft: {
    color: "#0A66C2",
    fontWeight: "bold",
    fontSize: 16,
  },
  btnTextRight: {
    color: "#0A66C2",
    fontWeight: "bold",
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 200,
    paddingHorizontal: 20,
  },
});
