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
        style={{ width: 270, height: 270 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    zIndex: 9999,
  },
});

export default HeartLoader;
