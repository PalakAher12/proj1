import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Keyboard,
  Modal,
  FlatList,
} from "react-native";
import { TextInput } from "react-native-paper";
import Icon from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useForm, Controller, useController } from "react-hook-form";
import FirestoreService, { USER_DATA_TYPES } from "../Services/firestoreService";

const firestoreService = new FirestoreService();

const PersonalDetails = ({ navigation }) => {
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);
  const [showBloodDropdown, setShowBloodDropdown] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
const [selectedDate, setSelectedDate] = useState(new Date());

  const genderItems = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
    { label: "Other", value: "other" },
  ];

  const bloodItems = [
    { label: "A+", value: "A+" },
    { label: "A-", value: "A-" },
    { label: "B+", value: "B+" },
    { label: "B-", value: "B-" },
    { label: "O+", value: "O+" },
    { label: "O-", value: "O-" },
    { label: "AB+", value: "AB+" },
    { label: "AB-", value: "AB-" },
  ];

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: "",
      height: "",
      weight: "",
      birthDate: "",
      address: "",
      gender: "",
      bloodGrp: "",
    },
  });
const handleShowDatePicker = () => {
  setShowDatePicker(true);
};
  useEffect(() => {
    (async () => {
      try {
        const userData = await firestoreService.getUserDataByType(
          USER_DATA_TYPES.PERSONAL
        );
        if (userData) {
          reset(userData);
          console.log("Loaded personal details from Firestore");
        }
      } catch (error) {
        console.log("Error loading personal details:", error);
      }
    })();
  }, [reset]);

  const onSubmit = useCallback(
    async (data) => {
      try {
        await firestoreService.saveUserData(USER_DATA_TYPES.PERSONAL, data);
        console.log("Personal details saved successfully");
        Keyboard.dismiss();
        navigation.navigate("Maintab");
      } catch (error) {
        console.log("Error saving personal details:", error);
        navigation.navigate("Maintab");
      }
    },
    [navigation]
  );

  // ✅ UseController for faster date handling
  const { field: birthDateField } = useController({
    name: "birthDate",
    control,
    rules: { required: "Birth date is required" },
  });

  // ✅ Parse the date only once using useMemo
  const dateValue = useMemo(() => {
    if (birthDateField.value) {
      const parsed = new Date(birthDateField.value);
      return isNaN(parsed.getTime()) ? new Date() : parsed;
    }
    return new Date();
  }, [birthDateField.value]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.viewStyle}>
        <Text style={styles.heading}>User Details</Text>
        <Text style={styles.subtitle}>
          "Your health is an investment, not an expense"
        </Text>

        {/* Full Name */}
        <View style={styles.inputContainer}>
          <Controller
            control={control}
            name="fullName"
            rules={{ required: "Full name is required" }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                mode="outlined"
                label="Full Name"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                left={
                  <TextInput.Icon
                    icon={() => <Icon name="person" size={20} color="#1C75BC" />}
                  />
                }
                style={styles.paperInput}
                outlineColor="#E2E8F0"
                activeOutlineColor="#1C75BC"
                theme={{
                  roundness: 12,
                  colors: { primary: "#1C75BC", background: "white" },
                }}
              />
            )}
          />
        </View>
        {errors.fullName && (
          <Text style={styles.error}>{errors.fullName.message}</Text>
        )}

        {/* Height */}
        <View style={styles.inputContainer}>
          <Controller
            control={control}
            name="height"
            rules={{ required: "Height is required" }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                mode="outlined"
                label="Height (cm)"
                keyboardType="numeric"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                left={
                  <TextInput.Icon
                    icon={() => <Icon name="height" size={20} color="#1C75BC" />}
                  />
                }
                style={styles.paperInput}
                outlineColor="#E2E8F0"
                activeOutlineColor="#1C75BC"
                theme={{
                  roundness: 12,
                  colors: { primary: "#1C75BC", background: "white" },
                }}
              />
            )}
          />
        </View>
        {errors.height && (
          <Text style={styles.error}>{errors.height.message}</Text>
        )}

        {/* Weight */}
        <View style={styles.inputContainer}>
          <Controller
            control={control}
            name="weight"
            rules={{ required: "Weight is required" }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                mode="outlined"
                label="Weight (kg)"
                keyboardType="numeric"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                left={
                  <TextInput.Icon
                    icon={() => (
                      <Icon name="monitor-weight" size={20} color="#1C75BC" />
                    )}
                  />
                }
                style={styles.paperInput}
                outlineColor="#E2E8F0"
                activeOutlineColor="#1C75BC"
                theme={{
                  roundness: 12,
                  colors: { primary: "#1C75BC", background: "white" },
                }}
              />
            )}
          />
        </View>
        {errors.weight && (
          <Text style={styles.error}>{errors.weight.message}</Text>
        )}

        {/* Birth Date - Fast Response */}

        
       <View style={styles.inputContainer}>
  <Controller
    control={control}
    name="birthDate"
    rules={{ required: "Birth date is required" }}
    render={({ field: { value } }) => (
      <TouchableOpacity onPress={handleShowDatePicker} activeOpacity={0.7}>
        <TextInput
          mode="outlined"
          label="Birth Date"
          value={value}
          editable={false}
          left={<TextInput.Icon icon={() => <Icon name="event" size={20} color="#1C75BC" />} />}
          style={styles.paperInput}
          outlineColor="#E2E8F0"
          activeOutlineColor="#1C75BC"
          theme={{
            roundness: 12,
            colors: { primary: '#1C75BC', background: 'white' }
          }}
          placeholder="Select Birth Date"
        />
      </TouchableOpacity>
    )}
  />
</View>
        {errors.birthDate && (
          <Text style={styles.error}>{errors.birthDate.message}</Text>
        )}

        {/* Date Picker */}
   {showDatePicker && (
  <DateTimePicker
    value={selectedDate}
    mode="date"
    display="default"
    maximumDate={new Date()}
    onChange={(event, date) => {
      setShowDatePicker(false);
      if (date) {
        setSelectedDate(date);
        const formattedDate = date.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        });
        setValue('birthDate', formattedDate);
      }
    }}
  />
)}
        {/* Address */}
        <View style={styles.inputContainer}>
          <Controller
            control={control}
            name="address"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                mode="outlined"
                label="Address"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                multiline
                numberOfLines={3}
                left={
                  <TextInput.Icon
                    icon={() => (
                      <Icon name="location-on" size={20} color="#1C75BC" />
                    )}
                  />
                }
                style={styles.paperInput}
                outlineColor="#E2E8F0"
                activeOutlineColor="#1C75BC"
                theme={{
                  roundness: 12,
                  colors: { primary: "#1C75BC", background: "white" },
                }}
                placeholder="Enter your address"
              />
            )}
          />
        </View>

        {/* Gender */}
        <View style={styles.inputContainer}>
          <Controller
            control={control}
            name="gender"
            render={({ field: { value } }) => (
              <TouchableOpacity
                onPress={() => setShowGenderDropdown(true)}
                activeOpacity={1}
              >
                <TextInput
                  label="Gender"
                  value={value}
                  mode="outlined"
                  editable={false}
                  right={<TextInput.Icon icon="menu-down" />}
                  left={
                    <TextInput.Icon
                      icon={() => (
                        <Icon name="person-outline" size={20} color="#1C75BC" />
                      )}
                    />
                  }
                  style={styles.paperInput}
                  outlineColor="#E2E8F0"
                  activeOutlineColor="#1C75BC"
                  theme={{
                    roundness: 12,
                    colors: { primary: "#1C75BC", background: "white" },
                  }}
                  placeholder="Select Gender"
                />
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Blood Group */}
        <View style={styles.inputContainer}>
          <Controller
            control={control}
            name="bloodGrp"
            render={({ field: { value } }) => (
              <TouchableOpacity
                onPress={() => setShowBloodDropdown(true)}
                activeOpacity={1}
              >
                <TextInput
                  label="Blood Group"
                  value={value}
                  mode="outlined"
                  editable={false}
                  right={<TextInput.Icon icon="menu-down" />}
                  left={
                    <TextInput.Icon
                      icon={() => (
                        <Icon name="bloodtype" size={20} color="#1C75BC" />
                      )}
                    />
                  }
                  style={styles.paperInput}
                  outlineColor="#E2E8F0"
                  activeOutlineColor="#1C75BC"
                  theme={{
                    roundness: 12,
                    colors: { primary: "#1C75BC", background: "white" },
                  }}
                  placeholder="Select Blood Group"
                />
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Save Button */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.btnStyle, styles.btnFilled]}
            onPress={handleSubmit(onSubmit)}
            activeOpacity={0.8}
          >
            <Text style={styles.btnTextFilled}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Gender Modal */}
      <Modal visible={showGenderDropdown} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setShowGenderDropdown(false)}
        >
          <View style={styles.modalContent}>
            <FlatList
              data={genderItems}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => {
                    setValue("gender", item.value);
                    setShowGenderDropdown(false);
                  }}
                >
                  <Text style={styles.dropdownItemText}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Blood Group Modal */}
      <Modal visible={showBloodDropdown} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setShowBloodDropdown(false)}
        >
          <View style={styles.modalContent}>
            <FlatList
              data={bloodItems}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => {
                    setValue("bloodGrp", item.value);
                    setShowBloodDropdown(false);
                  }}
                >
                  <Text style={styles.dropdownItemText}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </ScrollView>
  );
};

export default PersonalDetails;

// Styles same as yours
const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#F8FAFC",
    flex: 1,
    justifyContent: "center",
  },
  heading: {
    fontSize: 24,
    fontWeight: "500",
    textAlign: "center",
    margin: 5,
    color: "#1C75BC",
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 50,
    color: "#64748B",
  },
  viewStyle: {
    flex: 1,
    justifyContent: "center",
  },
  inputContainer: {
    marginBottom: 8,
    marginTop: 4,
    width: "100%",
  },
  paperInput: {
    backgroundColor: "white",
  },
  error: {
    color: "#EF4444",
    fontSize: 13,
    marginTop: 2,
    marginBottom: 10,
    textAlign: "left",
    marginLeft: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 15,
    width: "80%",
    maxHeight: "70%",
    overflow: "hidden",
    elevation: 5,
  },
  dropdownItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  dropdownItemText: {
    fontSize: 16,
    color: "#333",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  btnStyle: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    minWidth: 120,
    alignItems: "center",
    justifyContent: "center",
  },
  btnFilled: {
    backgroundColor: "transparent",
    elevation: 0,
  },
  btnTextFilled: {
    color: "#1C75BC",
    fontWeight: "bold",
    fontSize: 20,
  },
});
