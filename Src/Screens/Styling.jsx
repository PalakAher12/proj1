import React from 'react';
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import Icon1 from './Icon2.json'



const Styling = () => {
  return (
    <View style={styles.container}>
      
      <LottieView
        source={require('./Icon2.json')}  // Path to your JSON file
        autoPlay
        loop={false}
        style={{ width: 270, height: 270 }}
      />
    </View>
  );
};

export default Styling;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
   
    padding:20,
    marginTop:-100,
  },
});