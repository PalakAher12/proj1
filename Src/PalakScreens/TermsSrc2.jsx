import React from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import Icons from "react-native-vector-icons/Ionicons";

const TermsSrc2 = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
       onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icons name="arrow-back" size={26} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms & Conditions</Text>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Section
          title="1. Introduction"
          text="Welcome to Health Card. This app allows users to securely store, manage, and access their personal health information, including medical history, emergency contacts, and insurance details. By downloading, installing, or using this app, you agree to comply with and be bound by these Terms & Conditions."
        />
        <Section
          title="2. Acceptance of Terms"
          text={`By using our app, you:\n\n• Confirm that you are at least 18 years of age or have the consent of a parent/guardian.\n• Agree to use the app only for lawful and legitimate purposes.\n• Accept these Terms & Conditions in full.`}
        />
        <Section
          title="3. User Responsibilities"
          text={`• You are responsible for providing accurate and up-to-date personal, medical, and insurance information.\n• You agree not to use this app for illegal, unauthorized, or harmful purposes.\n• You are responsible for maintaining the confidentiality of your login credentials.`}
        />
        <Section
          title="4. Privacy & Data Protection"
          text={`We are committed to protecting your privacy and securing your personal health data:\n\n• Your data is stored securely using encrypted cloud storage (e.g., Firebase/Firestore).\n• We do not share your personal information with third parties without your consent, except as required by law.\n• For more information, please review our Privacy Policy.`}
        />
        <Section
          title="5. Health Disclaimer"
          text={`This app is intended only as a tool for storing and managing health-related information. It:\n\n• Does not provide medical advice, diagnosis, or treatment.\n• Should not be used as a substitute for professional medical advice. Always consult a qualified healthcare provider for any medical concerns.`}
        />
        <Section
          title="6. Limitation of Liability"
          text={`We are not liable for:\n\n• Any inaccuracies or incompleteness of the data you provide.\n• Loss of data due to technical failures, unauthorized access, or other unforeseen events.\n• Any direct, indirect, or consequential damages arising from the use of this app.`}
        />
        <Section
          title="7. Intellectual Property Rights"
          text={`All content, trademarks, and designs in this app belong to [Your Company/App Name] and are protected by applicable intellectual property laws. Unauthorized use, reproduction, or modification of our content is strictly prohibited.`}
        />
        <Section
          title="8. Changes to Terms"
          text={`We may update these Terms & Conditions from time to time. Continued use of the app after changes are published constitutes acceptance of the new terms.`}
        />
        <Section
          title="9. Termination"
          text={`We reserve the right to suspend or terminate your account if you violate these Terms & Conditions or misuse the app.`}
        />
        <Section
          title="10. Contact Information"
          text={`If you have any questions about these Terms & Conditions, please contact us at:\nEmail: your-support-email@example.com\nPhone: your support number`}
        />
      </ScrollView>
    </View>
  );
};

const Section = ({ title, text }) => (
  <View style={styles.section}>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.text}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
header: {
    backgroundColor: "#F8FAFC", // तुमचा बॅकग्राउंड कलर
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
},
  backButton: {
    marginRight: 10,
    padding: 4,
  },
headerTitle: {
    color: "#000", // ब्लॅक टेक्स्ट
    fontSize: 20,
    fontWeight: "bold",
    letterSpacing: 0.5,
},
  scroll: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 18,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
  },
  title: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#1C75BC",
    marginBottom: 6,
  },
  text: {
    fontSize: 15,
    lineHeight: 22,
    color: "#333",
  },
});

export default TermsSrc2;
