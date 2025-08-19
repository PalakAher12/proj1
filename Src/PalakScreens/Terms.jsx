import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import LottieView from 'lottie-react-native';
import { Card, Checkbox } from 'react-native-paper';

const Terms = ({ navigation }) => {
  const [checked, setChecked] = useState(false);

  const handleAccept = () => {
    if (checked) {
      navigation.navigate('PersonalDetails');
    }
  };

  return (
    <View style={styles.container}>
        <Card.Content>
          <Text style={styles.heading}>Terms and Conditions</Text>

          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <LottieView
              source={require('./HandshakeLoop.json')}
              autoPlay
              loop
              style={{ width: 180, height: 200 }}
            />
          </View>

          <Text style={styles.HeaderStyle}>
            To use this Health Card App, you must agree to our{' '}
            <Text
              style={styles.link}
              onPress={() => navigation.navigate('TermsSrc2')}
            >
              Terms & Conditions
            </Text>
            .
          </Text>

          <Text style={styles.normalText}>
            These include how we handle your personal health data, your
            responsibilities, and important disclaimers regarding the use of the app.
          </Text>
          <Text style={styles.normalText}>By accepting, you confirm that:</Text>

          <Text style={styles.HeaderStyle}>
            • You are providing accurate health and personal details.
          </Text>
          <Text style={styles.HeaderStyle}>
            • You understand this app is not a substitute for professional medical advice.
          </Text>
          <Text style={styles.HeaderStyle}>
            • Your personal and medical data is securely stored using encrypted cloud services to protect your privacy.
          </Text>

          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
            <Checkbox
              status={checked ? 'checked' : 'unchecked'}
              onPress={() => setChecked(!checked)}
              color="#0A66C2"
              uncheckedColor="#0A66C2"
            />
            <Text>I agree to the Terms & Conditions</Text>
          </View>

          <TouchableOpacity
            style={[
              styles.btnStyle,
              { backgroundColor: checked ? '#0A66C2' : '#ccc' },
            ]}
            onPress={handleAccept}
            disabled={!checked}
          >
            <Text style={styles.btnText}>Accept</Text>
          </TouchableOpacity>
        </Card.Content>
     
    </View>
  );
};

export default Terms;

const styles = StyleSheet.create({
  container: {
    padding: 13,
    backgroundColor: '#fff',
    flex: 1,
  },
  heading: {
     marginTop: 20,
    marginBottom: 16,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#0A66C2',
  },
  HeaderStyle: {
    fontWeight: '500',
    fontSize: 16,
    color: '#333',
    marginBottom: 7,
  
  },
  normalText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
   
  },
  btnStyle: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    alignSelf: 'center',
  },
  btnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },

  link: {
    color: '#007BFF',
    textDecorationLine: 'underline',
  },
});
