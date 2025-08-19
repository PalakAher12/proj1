import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const funFacts = [
  { text: "Bananas are berries, but strawberries aren't.", keyword: "banana" },
  { text: "Honey never spoils.", keyword: "honey" },
  { text: "Octopuses have three hearts.", keyword: "octopus" },
  { text: "A day on Venus is longer than a year on Venus.", keyword: "venus" },
  { text: "Sharks existed before trees.", keyword: "shark" }
];

export default function FlipCardBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const flipAnim = useRef(new Animated.Value(0)).current;
  const autoFlipTimeout = useRef(null);

  // Rotation interpolation
  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg']
  });
  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg']
  });

  const flipCard = () => {
    // Clear any pending auto-flip
    if (autoFlipTimeout.current) {
      clearTimeout(autoFlipTimeout.current);
    }

    Animated.spring(flipAnim, {
      toValue: isFlipped ? 0 : 180,
      friction: 8,
      tension: 10,
      useNativeDriver: true
    }).start(() => {
      setIsFlipped(!isFlipped);
      
      // Auto-advance after showing fact for 3 seconds
      if (!isFlipped) {
        autoFlipTimeout.current = setTimeout(() => {
          advanceToNextFact();
        }, 3000);
      }
    });
  };

  const advanceToNextFact = async () => {
    const nextIndex = (currentIndex + 1) % funFacts.length;
    setCurrentIndex(nextIndex);
    await AsyncStorage.setItem('funFactIndex', nextIndex.toString());
    
    // Flip back to front immediately
    Animated.spring(flipAnim, {
      toValue: 0,
      friction: 8,
      tension: 10,
      useNativeDriver: true
    }).start(() => {
      setIsFlipped(false);
    });
  };

  useEffect(() => {
    // Load saved index
    const loadIndex = async () => {
      const savedIndex = await AsyncStorage.getItem('funFactIndex');
      if (savedIndex) setCurrentIndex(parseInt(savedIndex));
    };
    loadIndex();

    return () => {
      if (autoFlipTimeout.current) {
        clearTimeout(autoFlipTimeout.current);
      }
    };
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity activeOpacity={0.9} onPress={flipCard}>
        <View>
          {/* Front Card */}
          <Animated.View style={[styles.card, styles.frontCard, {
            transform: [{ rotateY: frontInterpolate }],
            opacity: flipAnim.interpolate({
              inputRange: [0, 180],
              outputRange: [1, 0]
            })
          }]}>
            <Text style={styles.cardIcon}>💡</Text>
            <Text style={styles.cardTitle}>Tap to Reveal Fact!</Text>
          </Animated.View>

          {/* Back Card */}
          <Animated.View style={[styles.card, styles.backCard, {
            transform: [{ rotateY: backInterpolate }],
            opacity: flipAnim.interpolate({
              inputRange: [0, 180],
              outputRange: [0, 1]
            })
          }]}>
            <Text style={styles.factText}>{funFacts[currentIndex].text}</Text>
          </Animated.View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 20,
    marginBottom:0,
    marginTop: 10,
    alignItems: 'center'
  },
  card: {
    width: 320,
    height: 150,
    borderRadius: 16,
    padding: 20,
    backfaceVisibility: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5
  },
  frontCard: {
    backgroundColor: '#9be0fcff'
  },
  backCard: {
    backgroundColor: '#9be0fcff',
    position: 'absolute',
    top: 0,
    left: 0
  },
  cardIcon: {
    fontSize: 40,
    marginBottom: 10
  },
  cardTitle: {
    fontSize: 22,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  factText: {
    fontSize: 18,
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 24
  }
});