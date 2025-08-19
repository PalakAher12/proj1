// components/HealthCard.js
import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';

export default function HealthCard({ title, backgroundColor, subtitle, onPress, imageSource,imageStyle }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          transform: [{ scale: pressed ? 0.97 : 1 }],
          backgroundColor: pressed ? backgroundColor || backgroundColor : '#F8F8F9',
          elevation: pressed ? 5 : 3,
        },
      ]}
    >
      {/* Image at top */}
      {imageSource && (
<Image source={imageSource} style={[styles.image, imageStyle]} resizeMode="contain" />
      )}

      {/* Title */}
      <Text style={styles.title}>{title}</Text>

      {/* Subtitle */}
      <Text style={styles.subtitle}>{subtitle || 'Tap to explore'}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 150,
    paddingHorizontal: 16,
    height: 190,
    borderRadius: 25,
    padding: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    margin: 10,
  },

  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '400',
    color: '#A0A0A0',
    textAlign: 'center',
    marginTop: 5,
  },
});
