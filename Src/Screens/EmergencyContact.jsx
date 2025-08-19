import React, { useCallback, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Keyboard,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Styling from "./Styling";
import { useForm, Controller } from "react-hook-form";

const EmergencyContact = ({ navigation }) => {
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
      const savedData = await AsyncStorage.getItem('emergencyContact');
      if (savedData) {
        const data = JSON.parse(savedData);
        reset(data);
      }
    } catch (error) {
      console.log('Error loading data:', error);
    }
  };

  const onSubmit = useCallback(async (data) => {
    try {
      await AsyncStorage.setItem('emergencyContact', JSON.stringify(data));
      Keyboard.dismiss();
      console.log("Emergency Contact Data:", data);
      navigation.navigate("MedicalInfo");
    } catch (error) {
      console.log('Error saving data:', error);
    }
  }, [navigation]);

  const handlePrevious = useCallback(() => {
    navigation.navigate("PersonalDetails");
  }, [navigation]);

  return (
    <ScrollView nestedScrollEnabled={true} contentContainerStyle={styles.container}>
      <View style={styles.viewStyle}>
        <Text style={styles.heading}>Emergency Contacts</Text>
        <Styling />

        {/* Emergency Contact Name */}
        <Text style={styles.HeaderStyle}>Emergency Contact Name</Text>
        <Controller
          control={control}
          name="emergencyName"
          rules={{ required: "Contact name is required" }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Full Name"
              placeholderTextColor="grey"
              style={styles.textInputStyle}
              onBlur={onBlur}
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        {errors.emergencyName && (
          <Text style={styles.error}>{errors.emergencyName.message}</Text>
        )}

        {/* Emergency Contact Number */}
        <Text style={styles.HeaderStyle}>Emergency Contact Number</Text>
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
              placeholder="Phone Number"
              placeholderTextColor="grey"
              style={styles.textInputStyle}
              onBlur={onBlur}
              value={value}
              keyboardType="phone-pad"
              onChangeText={onChange}
            />
          )}
        />
        {errors.emergencyPhone && (
          <Text style={styles.error}>{errors.emergencyPhone.message}</Text>
        )}

        {/* Emergency Contact Relation */}
        <Text style={styles.HeaderStyle}>Emergency Contact Relation</Text>
        <Controller
          control={control}
          name="emergencyRelation"
          rules={{ required: "Relation is required" }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.textInputStyle}
              placeholder="eg: Wife, Brother, Father"
              placeholderTextColor="grey"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
            />
          )}
        />
        {errors.emergencyRelation && (
          <Text style={styles.error}>{errors.emergencyRelation.message}</Text>
        )}

        {/* Navigation Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.btnStyle}
            onPress={handlePrevious}
          >
            <Text style={styles.btnTextLeft}>Previous</Text>
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
  );
};

export default EmergencyContact;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "white",
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
  error: {
    color: "#ff3b30",
    fontSize: 14,
    marginLeft: 20,
    marginTop: -5,
    marginBottom: 10,
  },
  btnStyle: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 40,
    paddingHorizontal: 20,
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
});