
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Share,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Ionicons from "react-native-vector-icons/Ionicons";
import Feather from "react-native-vector-icons/Feather";
import QRCode from 'react-native-qrcode-svg';
import auth from '@react-native-firebase/auth';

import Customloader from '../Animations/Customloader'; // Adjust the import path as necessary
const QRScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const qrRef = useRef();
  const uid = auth().currentUser?.uid;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const docRef = firestore().collection('Siddhi').doc(uid);
        const docSnap = await docRef.get();

        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.updatedAt?.toDate) {
            data.updatedAt = data.updatedAt.toDate().toISOString();
          }
          setUserData(data);
        } else {
          console.log("No document found for UID:", uid);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleShareLink = async () => {
    try {
      const qrLink = ` https://internpro-e969e.web.app?uid=${uid}`;
      await Share.share({
        message: `Emergency QR: ${qrLink}`,
      });
    } catch (error) {
      console.log('Error sharing link:', error);
    }
  };

  return (
    <View style={style.Screen}>
      <View style={style.Header}>
        <TouchableOpacity style={style.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={35} color="#000" />
        </TouchableOpacity>
        <Text style={{ fontSize: 22, fontWeight: '600', color: '#000' }}>My QR Code</Text>
      </View>

      {loading ? (
        <View style={style.loaderContainer}>
<Customloader width={200} height={200} visible={loading} minVisibleTime={10} />
          <Text style={{ marginTop: 10, color: '#555' }}>Loading QR...</Text>
        </View>
      ) : (
        <>
          <Text style={style.slogan}>Your Health, One Scan Away</Text>
          <View style={style.QRcard}>
            {userData ? (
              <QRCode
                value={` https://internpro-e969e.web.app?uid=${uid}`}
                size={200}
                color="#4D94CC"
                backgroundColor="#FFFFFF"
                getRef={(c) => (qrRef.current = c)}
              />
            ) : (
              <Text style={{ color: '#999', textAlign: 'center' }}>No data available</Text>
            )}
          </View>

          <View style={style.btnContainer}>
            <TouchableOpacity style={style.qrBtn} onPress={handleShareLink}>
              <Text style={style.qrBtnText}>Share QR</Text>
              <Feather name="share-2" size={18} color="#fff" style={style.icon} />
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

export default QRScreen;

const style = StyleSheet.create({
  Screen: { flex: 1, backgroundColor: '#fff' },
  Header: { justifyContent: 'center', alignItems: 'center', paddingVertical: 20, backgroundColor: '#fff' },
  backButton: { position: 'absolute', left: 20, top: '70%' },
  QRcard: {
    marginTop: 20, alignSelf: 'center', alignItems: 'center', justifyContent: 'center',
    width: '80%', height: '40%', backgroundColor: '#fff', borderRadius: 50, borderWidth: 2,
  },
  btnContainer: { flexDirection: 'row', justifyContent: 'center', paddingHorizontal: 20, marginTop: 30 },
  qrBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1C75BC', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 12, elevation: 4 },
  qrBtnText: { color: '#fff', fontSize: 16, fontWeight: '600', marginRight: 8 },
  icon: { marginRight: 4 },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  slogan: { textAlign: 'center', fontSize: 18, fontWeight: '800', color: '#4D94CC', marginTop: 40 },
});
