import React, { useEffect, useState } from "react";
import {
  View,
  Modal,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
  Alert,
  TextInput,
  ToastAndroid,
  Platform
} from "react-native";
import ImageCropPicker from 'react-native-image-crop-picker';
import Feather from "react-native-vector-icons/Feather";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import LogoutModal from '../Components/LogoutModal';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const ProfileScreen = ({ navigation }) => {
  const [isLogoutVisible, setLogoutVisible] = useState(false);
  const [profileImage, setProfileImage] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [fullName, setFullName] = useState('');
  const [userData, setUserData] = useState('');

  const userId = auth().currentUser?.uid;

  const handleImagePress = () => {
    setModalVisible(true);
  };

  const selectFromGallery = async () => {
    try {
      const image = await ImageCropPicker.openPicker({
        width: 300,
        height: 300,
        cropping: true,
        cropperCircleOverlay: true,
        compressImageQuality: 0.8,
        includeBase64: true,
      });

      if (image?.data) {
        const base64data = `data:${image.mime};base64,${image.data}`;

        // Save immediately to Firestore
        await saveProfileImageToFirestore(base64data);

        // Update state so it shows instantly
        setProfileImage(base64data);

        setModalVisible(false);
      }
    } catch (error) {
      console.log('Gallery cancelled or failed:', error);
    }
  };

  //saving pfp to firestore
  const saveProfileImageToFirestore = async (base64Image) => {
    try {
      await firestore().collection("Siddhi").doc(userId).set({
        profileImageBase64: base64Image
      }, { merge: true });
      showWarning("⚠️ Profile image updated ");

    } catch (error) {

    }
  };
  // fetcching pfp to firestore
  const fetchProfileFromFirestore = async () => {
    try {
      const docRef = firestore().collection("Siddhi").doc(userId);
      const docSnap = await docRef.get();

      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.profileImageBase64) {
          setProfileImage(data.profileImageBase64);
        }
      } else {
      }
    } catch (error) {

    }
  };
  useEffect(() => {
    fetchProfileFromFirestore();
  }, []);

  // removing pfp from firestore
  const removeProfileImage = async (userId) => {
    try {
      await firestore().collection("Siddhi").doc(userId).update({
        profileImageBase64: firestore.FieldValue.delete()
      });

      setProfileImage(""); // instantly remove from UI
      showWarning("⚠️ Profile image removed");
    } catch (error) {
      console.error("Error removing profile image:", error);
    }
  };

  //warning after uploding the image
  const showWarning = (message) => {
    if (Platform.OS === 'android') {
      ToastAndroid.showWithGravity(
        message,
        ToastAndroid.LONG,
        ToastAndroid.TOP
      );
    } else {
      console.warn(message); // For iOS fallback
    }
  };


  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const docRef = firestore().collection('Siddhi').doc(userId);
        const docSnap = await docRef.get();

        if (docSnap.exists()) {
          const userData = docSnap.data();
          setFullName(userData.fullName); //Set the name to state
        } else {
          // console.log('No such user!');
        }
      } catch (error) {
        // console.error('Error getting user data:', error);
      }
    };
    fetchUserName();
  }, []);

  // Fetch user data from Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const docRef = doc(db, "Siddhi", userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserData({
            height: data.personalDetails.height ,
            bloodGrp: data.personalDetails.bloodGrp ,
            weight: data.personalDetails.weight  
          });
        } else {
          setUserData({
            height: 'Not set',
            bloodGrp: 'Not set',
            weight: 'Not set'
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  return (
    <View style={style.screen}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={style.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={style.headerTitle}>Profile</Text>
        <View style={{ width: 24 }} /> {/* For balance */}
      </View>

      {/* Profile Info */}
      <View style={style.profileInfo}>
        <TouchableOpacity onPress={handleImagePress}>
          <Image
            source={
              profileImage
                ? { uri: profileImage }
                : require('../Images/placeholder.png')
            }
            style={style.avatarImage}
          />
        </TouchableOpacity>

        <View style={style.nameContainer}>
          {isEditingName ? (
            <TextInput
              style={style.nameInput}
              value={fullName}
              onChangeText={setFullName}
              autoFocus
              onBlur={async () => {
                try {
                  setIsEditingName(false);
                  if (userId && fullName.trim() !== '') {
                    await firestore().collection('Siddhi').doc(userId).set(
                      { fullName: fullName.trim() },
                      { merge: true }
                    );
                  }
                } catch (error) {
                  console.error('Error updating name:', error);
                }
              }}
            />
          ) : (
            <Text style={style.nameText}>{fullName}</Text>
          )}
          <TouchableOpacity onPress={() => setIsEditingName(true)}>
            <Feather name="edit" size={16} color="#000" style={style.editIcon} />
          </TouchableOpacity>
        </View>

      </View>

      {/* Health Info Cards */}
      <View style={style.cardsContainer}>
  {/* Height Card */}
  <View style={[style.card, { backgroundColor: '#F0F7FF' }]}>
    <Text style={style.cardTitle}>Height</Text>
    <Text style={style.cardValue}>
      {userData.height} {userData.height !== 'Not set' && 'cm'}
    </Text>
  </View>
  
  {/* Blood Group Card */}
  <View style={[style.card, { backgroundColor: '#FFF0F5' }]}>
    <Text style={style.cardTitle}>Blood Group</Text>
    <Text style={style.cardValue}>{userData?.bloodGrp && <Text>{userData.bloodGrp}</Text>}
</Text>
  </View>
  
  {/* Weight Card */}
  <View style={[style.card, { backgroundColor: '#F0FFF4' }]}>
    <Text style={style.cardTitle}>Weight</Text>
    <Text style={style.cardValue}>
      {userData.weight} {userData.weight !== 'Not set' && 'kg'}
    </Text>
  </View>
</View>

      {/* Menu Items */}
      <View style={style.menuContainer}>
        <TouchableOpacity
          style={style.menuItem}
          onPress={() => navigation.navigate('AccountDetailsScreen')}
        >
          <MaterialIcons name="account-circle" size={24} color="#7FBCE5" />
          <Text style={style.menuText}>Account Details</Text>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity
          style={style.menuItem}
          onPress={() => navigation.navigate('QRScreen')}
        >
          <FontAwesome6 name="qrcode" size={20} color="#7FBCE5" />
          <Text style={style.menuText}>QR Code</Text>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity
          style={style.menuItem}
          onPress={() => navigation.navigate('ChangePasswordScreen')}
        >
          <MaterialIcons name="edit" size={20} color="#7FBCE5" />
          <Text style={style.menuText}>Change Password</Text>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity
          style={style.menuItem}
          onPress={() => navigation.navigate('TermsSrc2')}
        >
          <MaterialIcons name="privacy-tip" size={20} color="#7FBCE5" />
          <Text style={style.menuText}>Privacy Policy</Text>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <TouchableOpacity
        style={style.logoutButton}
        onPress={() => setLogoutVisible(true)}
      >
        <Text style={style.logoutText}>Logout</Text>
      </TouchableOpacity>

      {/* Modals */}
      <LogoutModal
        visible={isLogoutVisible}
    onClose={() => setLogoutVisible(false)}
      />

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={style.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setModalVisible(false)}
        >
          <View style={style.modalContainer}>
            <TouchableOpacity style={style.modalButton} onPress={selectFromGallery}>
              <Text style={style.modalButtonText}>Add Image</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={style.modalButton}
              onPress={async () => {
                await removeProfileImage(userId);
                setProfileImage();
                setModalVisible(false);
              }}
            >
              <Text style={style.modalButtonText}>Remove Image</Text>
            </TouchableOpacity>
            <TouchableOpacity style={style.modalButton} onPress={() => setModalVisible(false)}>
              <Text style={[style.modalButtonText, { color: 'red' }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const style = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: 'white',
   
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  profileInfo: {
    alignItems: 'center',
    paddingVertical: 32,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  nameText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  editIcon: {
    marginLeft: 8,
  },
  locationText: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  menuContainer: {
    marginTop: 16,
    marginHorizontal: 16,
  },
  cardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 20,
    marginBottom: 20,
  },
  card: {
    width: '30%',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuText: {
    fontSize: 16,
    marginLeft: 16,
    flex: 1,
  },
  logoutButton: {
    marginTop: 3,
    marginHorizontal: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
  },
  logoutText: {
    color: 'red',
    fontSize: 16,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContainer: {
    backgroundColor: '#fff',
    width: 250,
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalButton: {
    paddingVertical: 10,
  },
  modalButtonText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
  },
  nameInput: {
    fontSize: 24,
    fontWeight: 'bold',
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
});

export default ProfileScreen;