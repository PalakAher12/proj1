import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import auth from '@react-native-firebase/auth';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import Onboard from './Src/SiddhiScreens/Onboard.jsx';
import Signup from './Src/SiddhiScreens/Signup.jsx';
import Login from './Src/SiddhiScreens/Login.jsx';
import ForgotPassword from './Src/SiddhiScreens/ForgotPassword.jsx';
import OtpVerification from './Src/SiddhiScreens/OtpVerification.jsx';
import Terms from './Src/PalakScreens/Terms.jsx';
import PersonalDetails from './Src/Screens/PersonalDetails.jsx';
import Maintab from './Src/Screen/Maintab.jsx';
import MultiplePolicy from './Src/Screens/MultiplePolicy.jsx';
import EmergencyContact from './Src/Screens/EmergencyContact.jsx';
import InsuranceSrc1 from './Src/Screens/InsuranceSrc1.jsx';
import InsurancePreview from './Src/Screens/InsurancePreview.jsx';
import MedicalInfo from './Src/Screens/MedicalInfo.jsx';
import MedicalReportPreview from './Src/PalakScreens/MedicalReportPreview.jsx';
import TermsSrc2 from './Src/PalakScreens/TermsSrc2.jsx';
import StartInsuranceFile from './Src/PalakScreens/StartInsuranceFile.jsx';
import DoctorSuggestionScreen from './Src/Screen/DoctorSuggestionScreen.jsx';
import EmergencyContactScreen from './Src/Screen/EmergencyContactScreen.jsx';
import Locationex from './Src/SiddhiScreens/Locationex.jsx';
import MeasureScreen from './Src/Screen/MeasureScreen.jsx';
import Waterintake from './Src/Screen/Waterintake.jsx';
import Bloodoxy from './Src/Screen/Bloodoxy.jsx';
import Bloodpress from './Src/Screen/Bloodpress.jsx';
import NotificationScreen from './Src/Screen/NotificationScreen.jsx';
import ChangePasswordScreen from './Src/Screen/ChangePasswordScreen.jsx';
import DoctorBookingScreen from './Src/Screen/DoctorBookingScreen.jsx';
import AllRecentVisits from './Src/Screen/AllRecentVisits.jsx';
import DocRecommendationScreen from './Src/Screen/DocRecommendationScreen.jsx';
import QRScreen from './Src/Screen/QRScreen.jsx';
import AccountDetailsScreen from './Src/Screen/AccountDetailsScreen.jsx';
import Customloader from './Src/Animations/Customloader.js';

const Stack = createNativeStackNavigator();

const App = () => {
  const [initialRoute, setInitialRoute] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    // ✅ No need to manually initialize Firebase with @react-native-firebase
    const unsubscribe = auth().onAuthStateChanged(user => {
      if (user) {
        setInitialRoute('Maintab'); // user is signed in
      } else {
        setInitialRoute('Onboard'); // user not signed in
      }
      setCheckingAuth(false);
    });

    return unsubscribe;
  }, []);

  if (checkingAuth) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Customloader />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
        {/* Auth screens */}
        <Stack.Screen name="Onboard" component={Onboard} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="OtpVerification" component={OtpVerification} />
        <Stack.Screen name="Terms" component={Terms} />
        <Stack.Screen name="PersonalDetails" component={PersonalDetails} />

        {/* Main app */}
        <Stack.Screen name="Maintab" component={Maintab} />

        {/* Other screens */}
        <Stack.Screen name="MultiplePolicy" component={MultiplePolicy} />
        <Stack.Screen name="EmergencyContact" component={EmergencyContact} />
        <Stack.Screen name="InsuranceSrc1" component={InsuranceSrc1} />
        <Stack.Screen name="InsurancePreview" component={InsurancePreview} />
        <Stack.Screen name="MedicalInfo" component={MedicalInfo} />
        <Stack.Screen name="MedicalReportPreview" component={MedicalReportPreview} />
        <Stack.Screen name="TermsSrc2" component={TermsSrc2} />
        <Stack.Screen name="StartInsuranceFile" component={StartInsuranceFile} />
        <Stack.Screen name="DoctorSuggestionScreen" component={DoctorSuggestionScreen} />
        <Stack.Screen name="EmergencyContactScreen" component={EmergencyContactScreen} />
        <Stack.Screen name="Locationex" component={Locationex} />
        <Stack.Screen name="MeasureScreen" component={MeasureScreen} />
        <Stack.Screen name="Waterintake" component={Waterintake} />
        <Stack.Screen name="Bloodoxy" component={Bloodoxy} />
        <Stack.Screen name="Bloodpress" component={Bloodpress} />
        <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
        <Stack.Screen name="ChangePasswordScreen" component={ChangePasswordScreen} />
        <Stack.Screen name="DoctorBookingScreen" component={DoctorBookingScreen} />
        <Stack.Screen name="AllRecentVisits" component={AllRecentVisits} />
        <Stack.Screen name="DocRecommendationScreen" component={DocRecommendationScreen} />
        <Stack.Screen name="QRScreen" component={QRScreen} />
        <Stack.Screen name="AccountDetailsScreen" component={AccountDetailsScreen} />
        <Stack.Screen name="Customloader" component={Customloader} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
