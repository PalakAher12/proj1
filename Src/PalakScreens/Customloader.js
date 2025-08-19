import React from 'react';
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

const HeartLoader = () => {
  return (
    <View style={styles.container}>
   <LottieView
  source={require('./Loader.json')}
  autoPlay
  loop
  style={{ width: 210, height: 210}}
/>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
   

  },
});

export default HeartLoader;