import { StyleSheet, Linking, Text,TouchableWithoutFeedback, View, Pressable, TextInput, TouchableOpacity, Dimensions, ScrollView, Modal } from 'react-native'
import React, { useState } from 'react'
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import SleepTracker from "./SleepTracker"
import LottieView from 'lottie-react-native';
import SleepWakeTimeModal from '../compoenents/SleepWakeTimeModal';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as Animatable from 'react-native-animatable';

const { width } = Dimensions.get('window');

const ActivityCard = () => {

  // sleep card values passed to sleep tracker
  const [modalSleep, setmodalSleep] = useState(false)
  const [sleepmodaldata, setsleepmodaldata] = useState([]);
  const handleModalSubmit = (data) => {
    setsleepmodaldata([data]);  // ✅ ensures data is an array
  };

  //  stress Guide card
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [modalOpen, setModalOpen] = useState(false)
  const [alertModalVisible, setAlertModalVisible] = useState(false);
  const [alertModalTitle, setAlertModalTitle] = useState('');
  const [alertModalMessage, setAlertModalMessage] = useState('');
  const [alertModalType, setAlertModalType] = useState('success'); // 'success' | 'warning'
  const [lowLevelModalVisible, setLowLevelModalVisible] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState('');
  const [breathingVisible, setBreathingVisible] = useState(false);
  const [groundingVisible, setGroundingVisible] = useState(false);
  const [groundingResponses, setGroundingResponses] = useState({
    see: '',
    touch: '',
    hear: '',
    smell: '',
    taste: '',
  });
  const [veryHighVisible, setVeryHighVisible] = useState(false);

  const stressLevels = [
    { emoji: '😊', label: 'Low' },
    { emoji: '😐', label: 'Medium' },
    { emoji: '😟', label: 'High' },
    { emoji: '😣', label: 'Very High' },
  ];
  const lowStressQuotes = [
    "“Peace begins with a smile.” – Mother Teresa",
    "“Your calm mind is the ultimate weapon.”",
    "“You’re doing great. Keep breathing.”",
    "“Rest and self-care are so important.”",
  ];

  const breathingAnimations = [
    require('../asset/breath1.json'),
    require('../asset/breath2.json'),
    require('../asset/breath3.json'),
  ];
  const [selectedBreathingAnim, setSelectedBreathingAnim] = useState(breathingAnimations[0]);


  const submitStress = () => {

    if (selectedLevel === 0) {
      const randomIndex = Math.floor(Math.random() * lowStressQuotes.length);
      setSelectedQuote(lowStressQuotes[randomIndex]);
      setLowLevelModalVisible(true);
      setModalOpen(false); // close parent modal too

    }
    else if (selectedLevel === 1) {
      setGroundingVisible(true);
      setModalOpen(false); // close parent modal too

    }
    else if (selectedLevel === 2) {
      const randomIndex = Math.floor(Math.random() * breathingAnimations.length);
      setSelectedBreathingAnim(breathingAnimations[randomIndex]);
      setBreathingVisible(true);
      setModalOpen(false); // close parent modal too

    }
    else if (selectedLevel === 3) {
      setVeryHighVisible(true);
      setModalOpen(false); // close parent modal too

    }
    else {
      setAlertModalTitle('Selection Missing');
      setAlertModalMessage('Please select a stress level.');
      setAlertModalType('warning');
      setAlertModalVisible(true);
    }
  };

  const getSuggestion = () => {
    if (selectedLevel === null) return "";

    const suggestions = {
      0: "Great! Keep up the positivity! 😊",
      1: "Use this exercise to bring yourself back to the present moment.",
      2: "Feeling better by Breathing exersice 😊.                       Try it on whenever u feel stressed",
      3: "Feeling better? Try such Guided Meditation Three times daily.",
    };

    return suggestions[selectedLevel];
  };

  return (

    <View style={HomeStyle.horizontalContainer}>

      {/* sleep card */}
      <Pressable
        style={({ pressed }) => [
          HomeStyle.rectangle,
          {
            transform: [{ scale: pressed ? 1 : 0.95 }],
            backgroundColor: pressed ? '#FFF1D6' : '#F8F8F9',
            elevation: pressed ? 5 : 3,
          },
        ]}
        onPress={() => setmodalSleep(true)}
      >
        <View style={{ flexDirection: 'row', }}>
          <Text style={HomeStyle.Card_title}>sleep Tracker</Text>
          <FontAwesome5 name='moon' size={18} color="#E6A72F" style={HomeStyle.Card_icon} />
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <SleepTracker sleepmodaldata={sleepmodaldata} />

        </View>
      </Pressable>
      <SleepWakeTimeModal
        visible={modalSleep}
        onClose={() => setmodalSleep(false)}
        onSubmit={handleModalSubmit}
      />


      {/* stress level card */}
      <Pressable
        onPress={() => setModalOpen(!modalOpen)}
        style={({ pressed }) => [
          HomeStyle.rectangle,
          {
            transform: [{ scale: pressed ? 1 : 0.95 }],
            backgroundColor: pressed ? '#d6f0fa' : '#F8F8F9',
            elevation: pressed ? 5 : 3,
          },
        ]}
      >

        <View style={{ flexDirection: 'row', }}>
          <Text style={{
            marginLeft: 13,
            fontSize: 14,
            fontWeight: 'bold',
            marginTop: 10
          }}>Stress Guide</Text>
          <FontAwesome5 name="spa" size={18} color="#0d6e9c" style={HomeStyle.Card_icon} />
        </View>
        {selectedLevel !== null && (
          <Text style={{
            marginLeft: 13,
            marginTop: 5,
            fontSize: 15,
            color: 'grey'
          }}>
            {getSuggestion()}
          </Text>
        )}
        {selectedLevel === null && (
          <LottieView
            source={require('../img/stresslotie')}
            autoPlay
            loop
            style={{
              width: 150, height: 150, alignItems: 'center',
              justifyContent: 'center', marginTop: 7
            }}
          />

        )}
        <Modal
          visible={modalOpen}
          animationType='fade'
          transparent={true}

        ><TouchableWithoutFeedback onPress={() => setModalOpen(false)}>
          <View style={HomeStyle.container}>
            <View style={HomeStyle.innercontainer}>
              <Text style={HomeStyle.heading}>How stressed are you feeling?</Text>
              <View style={HomeStyle.emojiContainer}>
                {stressLevels.map((level, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      HomeStyle.emojiButton,
                      selectedLevel === index && HomeStyle.selectedEmoji
                    ]}
                    onPress={() => setSelectedLevel(index)}
                  >
                    <Text style={HomeStyle.emoji}>{level.emoji}</Text>
                    <Text>{level.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity
                style={HomeStyle.stressSubmitButton}
                onPress={submitStress}
              >
                <Text style={HomeStyle.stressSubmitButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
          </TouchableWithoutFeedback>
        </Modal>

        {/* low level stress modal=======================        */}
        <Modal
          visible={lowLevelModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setLowLevelModalVisible(false)}
        >
          <View style={HomeStyle.lowModalBackdrop}>
            <View style={HomeStyle.lowModalCard}>
              <Animatable.Text
                animation="pulse"
                iterationCount="infinite"
                style={HomeStyle.lowEmoji}
              >
                😊
              </Animatable.Text>
              <Text style={HomeStyle.lowQuote}>{selectedQuote}</Text>
              <TouchableOpacity
                style={HomeStyle.lowButton}
                onPress={() =>
                  setLowLevelModalVisible(false)} >
                <Text style={HomeStyle.lowButtonText}>Got it</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        {/* medium level modall======================================== */}
        <Modal visible={breathingVisible} transparent animationType="fade">
          <View style={HomeStyle.breathingBackdrop}>
            <View style={HomeStyle.breathingCard}>
              <LottieView
                source={selectedBreathingAnim}
                autoPlay
                loop
                style={{ width: 200, height: 200 }}
              />
              <Text style={HomeStyle.breathingText}>Breathe In... Hold... Breathe Out</Text>
              <TouchableOpacity
                style={HomeStyle.breathingButton}
                onPress={() => {
                  setBreathingVisible(false);

                }
                }
              >
                <Text style={HomeStyle.breathingButtonText}>End</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        {/* high level stress modal================================== */}
        <Modal visible={groundingVisible} transparent animationType="fade">
          <View style={HomeStyle.journalBackdrop}>

            <ScrollView contentContainerStyle={HomeStyle.journalCard} >
              <Text style={HomeStyle.journalTitle}>5-4-3-2-1 Grounding Exercise</Text>
              <Text style={HomeStyle.journalSubtitle}>Take a deep breath and respond to each:</Text>

              <TextInput
                placeholder="5 things you can SEE..."
                placeholderTextColor="#999"
                value={groundingResponses.see}
                onChangeText={(text) => setGroundingResponses({ ...groundingResponses, see: text })}
                style={HomeStyle.journalInput}
              />
              <TextInput
                placeholder="4 things you can TOUCH..."
                placeholderTextColor="#999"
                value={groundingResponses.touch}
                onChangeText={(text) => setGroundingResponses({ ...groundingResponses, touch: text })}
                style={HomeStyle.journalInput}
              />
              <TextInput
                placeholder="3 things you can HEAR..."
                placeholderTextColor="#999"
                value={groundingResponses.hear}
                onChangeText={(text) => setGroundingResponses({ ...groundingResponses, hear: text })}
                style={HomeStyle.journalInput}
              />
              <TextInput
                placeholder="2 things you can SMELL..."
                placeholderTextColor="#999"
                value={groundingResponses.smell}
                onChangeText={(text) => setGroundingResponses({ ...groundingResponses, smell: text })}
                style={HomeStyle.journalInput}
              />
              <TextInput
                placeholder="1 thing you can TASTE..."
                placeholderTextColor="#999"
                value={groundingResponses.taste}
                onChangeText={(text) => setGroundingResponses({ ...groundingResponses, taste: text })}
                style={HomeStyle.journalInput}
              />

              <TouchableOpacity
                style={HomeStyle.journalButton}
                onPress={() => {
                  setGroundingVisible(false);
                  setGroundingResponses({ see: '', touch: '', hear: '', smell: '', taste: '' });
                }}
              >
                <Text style={HomeStyle.journalButtonText}>Done</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </Modal>
        {/* Very high level modal ==================================== */}
        <Modal visible={veryHighVisible} transparent animationType="fade">
          <View style={HomeStyle.lowModalBackdrop}>

            <View style={HomeStyle.lowModalCard}>
              <Text style={HomeStyle.journalTitle}>Take a Deep Breath 😌</Text>
              <Text style={HomeStyle.journalSubtitle}>
                Here's something calming to help you unwind:
              </Text>

              <TouchableOpacity
                onPress={() => Linking.openURL('https://youtu.be/inpok4MKVLM')}
                style={HomeStyle.calmButton}
              >
                <Text style={HomeStyle.calmButtonText}>🎥 Try Guided Meditation</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => Linking.openURL('https://youtu.be/2OEL4P1Rz04')}
                style={HomeStyle.calmButton}
              >
                <Text style={HomeStyle.calmButtonText}>🎧 Play Calming Music</Text>
              </TouchableOpacity>


              <Text style={[HomeStyle.journalSubtitle, { marginTop: 20 }]}>
                🌙 You can also...
              </Text>
              <Text style={HomeStyle.journalTip}>• Take a warm shower</Text>
              <Text style={HomeStyle.journalTip}>• Journal your thoughts</Text>
              <Text style={HomeStyle.journalTip}>• Talk to a friend or breathe deeply</Text>

              <TouchableOpacity
                style={[HomeStyle.journalButton, { marginTop: 25 }]}
                onPress={() => {
                  setVeryHighVisible(false)
                }}
              >
                <Text style={HomeStyle.journalButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

      </Pressable>

      {/* // ===================stress modal after submit butn========= */}

      <Modal
        visible={alertModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setAlertModalVisible(false)}
      >
        <View style={HomeStyle.stressBackdrop}>
          <View style={HomeStyle.stressCard}>
            <Ionicons
              name={alertModalType === 'success' ? 'checkmark-circle' : 'alert-circle'}
              size={60}
              color={alertModalType === 'success' ? 'green' : 'orange'}
            />
            <Text style={HomeStyle.stressTitle}>{alertModalTitle}</Text>
            <Text style={HomeStyle.stressSubtitle}>{alertModalMessage}</Text>
            <TouchableOpacity
              style={HomeStyle.stressButton}
              onPress={() => {
                setAlertModalVisible(false);
                setModalOpen(false); // close parent modal too
              }}
            >
              <TouchableOpacity
                style={HomeStyle.stressButton}
                onPress={() => {
                  setAlertModalVisible(false);

                  if (alertModalType === 'success') {
                    setModalOpen(false); // close main modal after success
                  } else if (alertModalType === 'warning') {
                    setModalOpen(true); // re-open previous modal
                  }
                }}
              >
                <Text style={HomeStyle.stressButtonText}>OK</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>



    </View>


  )
}

export default ActivityCard;

const HomeStyle = StyleSheet.create({
  rectangle: {
    padding: 5,
    width: 150,
    height: 180,
    borderRadius: 25,
    margin: 10,
    backgroundColor: '#f2f9ff',
    elevation: 4,
    position: 'relative',
  },
  horizontalContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginBottom: 10
  },

  Card_title: {
    marginLeft: 13,
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 10
  },
  Card_icon: {

    position: "absolute",
    top: 10,
    right: 10,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.4)'
  },
  innercontainer: {
    backgroundColor: 'white', // your modal content background
    padding: 20,
    borderRadius: 15,
    width: '90%',
    alignItems: 'center',
  },
  heading: {
    fontSize: 20,
    marginBottom: 30,
    textAlign: 'center'
  },
  emojiContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20
  },
  emojiButton: {
    alignItems: 'center',
    padding: 10
  },
  selectedEmoji: {
    backgroundColor: '#E0F7FA',
    borderRadius: 10
  },
  emoji: { fontSize: 30 },
  /////==============stress modal=========
  stressSubmitButton: {
    backgroundColor: '#1c75bc',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    elevation: 3, // subtle shadow on Android
  },

  stressSubmitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },

  // ===================stress modal after submit butn=========
  stressBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  stressCard: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 18,
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    elevation: 10,
  },

  stressTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 4,
    color: '#222',
  },

  stressSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },

  stressButton: {
    backgroundColor: '#3990d1',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 10,
  },

  stressButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  // low lwvwl stress======================
  lowModalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  lowModalCard: {
    width: '85%',
    backgroundColor: '#ffffff',
    padding: 25,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 10,
  },

  lowEmoji: {
    fontSize: 50,
    marginBottom: 15,
  },

  lowQuote: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
    marginBottom: 20,
  },

  lowButton: {
    backgroundColor: '#1c75bc',
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 10,
  },

  lowButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  // medium stress sathii modal ============================
  breathingBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  breathingCard: {
    backgroundColor: '#fff',
    width: '80%',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    elevation: 8,
  },

  breathingText: {
    fontSize: 18,
    color: '#333',
    marginVertical: 20,
    textAlign: 'center',
  },

  breathingButton: {
    backgroundColor: '#1c75bc',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 10,
  },

  breathingButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // high level stress modal=========================
  journalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: "center",
    alignItems: 'center',
  },

  journalCard: {
    backgroundColor: '#fff',
    width: '80%',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    elevation: 8,
  },

  journalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#0d6e9c',
    textAlign: 'center',
  },

  journalSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    textAlign: 'center',
  },

  journalInput: {
    width: '100%',
    minHeight: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#f8f8f8',
  },

  journalButton: {
    backgroundColor: '#1c75bc',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginTop: 10,
  },

  journalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  journalTip: {
    fontSize: 14,
    color: '#333',
    marginTop: 4,
    textAlign: 'left',
    width: '100%',
  },
  calmButton: {
    backgroundColor: '#f0f6fa', // very soft blue-gray
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 12,
    marginTop: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d0e2ed', // subtle border
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2, // subtle elevation
  },

  calmButtonText: {
    color: '#164d72', // deeper calming blue
    fontSize: 15,
    fontWeight: '500',
    letterSpacing: 0.3,
  },




})


