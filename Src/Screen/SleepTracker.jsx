import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import LottieView from 'lottie-react-native';

const getSleepStatus = (hours) => {
  if (hours >= 7.5) return { text: 'Good sleep', color: 'green' };
  if (hours >= 5) return { text: 'Average \n sleep', color: 'orange' };
  return { text: 'Poor sleep', color: 'red' };
};

const SleepTracker = ({ sleepmodaldata }) => {
  const [sleepHours, setSleepHours] = useState(0);
  const [timepop, setTimepop] = useState(false);

  useEffect(() => {
    const newSleepHours = sleepmodaldata?.[0]?.sleepHours ?? 0;
    setSleepHours(newSleepHours);
  }, [sleepmodaldata]); // updates whenever props change

  const hasData = sleepmodaldata?.[0]?.sleepHours !== undefined;

  const { text, color } = getSleepStatus(sleepHours);
  const fill = Math.min((sleepHours / 8) * 100, 100); // updated to use real hours

  return (
    <View style={{ alignItems: 'center', marginTop: 7 }}>
       {hasData ? (
      <AnimatedCircularProgress
        size={120}
        width={12}
        fill={fill}
        tintColor={color}
        backgroundColor="#ddd"
        lineCap="round"
        rotation={0}
      >
        {() => (
          <View style={{ alignItems: 'center' }}>
            <Text
              onPress={() => setTimepop(!timepop)}
              style={{ color, fontSize: 15, fontWeight: 'bold', textAlign: 'center' }}
            >
              {text}
            </Text>
            <View style={{ flexDirection: 'row' }}>
              <Text style={{ color: '#E6A72F', fontSize: 15, fontWeight: 'bold' }}>{sleepHours}</Text>
              <Text style={{ color: 'grey', fontSize: 14 }}> Hrs</Text>
            </View>
          </View>
        )}
      </AnimatedCircularProgress>
       ) : (
           <TouchableOpacity onPress={() => setTimepop(true)}>
          <LottieView
            source={require('../img/sleeplotie.json')}
            autoPlay
            loop
            style={{ width: 130, height: 130,alignItems:'center',justifyContent:'center' }}
          />
         
        </TouchableOpacity>
       )}
    </View>
  );
};

export default SleepTracker;