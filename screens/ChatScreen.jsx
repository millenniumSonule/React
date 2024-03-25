import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, FlatList, ActivityIndicator, KeyboardAvoidingView } from 'react-native';
import Homepage from './Homepage';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation from @react-navigation/native
import { firebaseAuth, firestore } from '../config';
import { Firestore, collection, doc, getDoc, getDocs } from 'firebase/firestore'; // Import collection and getDocs from the correct path
import { serverTimestamp } from 'firebase/firestore';

// Then use the Icon component in your JSX

const ChatScreen = ({ route }) => {
  const { email } = route.params;
  const { name } = route.params;
  const { profilePicUrl } = route.params;
  const [currentMessage, setCurrentMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation();


  const naviGateBack = () => {
    navigation.navigate('Homepage');
  }


  useEffect(() => {
    documentExist();
    getMessages();
  }, []);


  const documentExist = async () => {

    const currentUserEmail = firebaseAuth.currentUser.email;
    const roomIdx = [email, currentUserEmail].sort().join('-');
    const docRef = doc(firestore, 'Messages', roomIdx);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {

    } else {
      // console.warn('not exist, adding one');

      try {

        const userRef = firestore.collection('Messages'); // 1st collection
        const specificDocRef = userRef.doc(roomIdx); // docs in 1st collection
        await specificDocRef.set({                    // adding blank data to 1st collection docs
        });

        const subCollectionRef = specificDocRef.collection('msgRecords'); //adding collection to 1st docs
        await subCollectionRef.add({      //adding blank data to that collection
        });

      } catch (error) {

      }

    }

  }

  const sendMessage = async () => {

    if (currentMessage.length > 0) {
      const currentUserEmail = firebaseAuth.currentUser.email;
      const roomIdx = [email, currentUserEmail].sort().join('-');
      // console.warn(currentMessage);

      try {
        //Messages>roomIdx>msgRecords> adding doc to it

        // in one line -> const msgRecordsCollection = firestore.collection('Messages').doc(roomIdx).collection('msgRecords');

        const msgCollection = firestore.collection('Messages');
        const roomIdDoc = msgCollection.doc((roomIdx));
        const msgRecordsCollection = roomIdDoc.collection('msgRecords')
        const currentTimeStamp = serverTimestamp();

        await msgRecordsCollection.add({
          // Document data for msgRecords collection
          createdAt: currentTimeStamp,
          sender: currentUserEmail,
          receiver: email,
          message: currentMessage,
        });
        setCurrentMessage('');

      } catch (error) {
        console.log('error : ' + error)
      }
    }

  }


  const getMessages = async () => {


    const currentUserEmail = firebaseAuth.currentUser.email;
    const roomIdx = [email, currentUserEmail].sort().join('-');

    const refMsgData = firestore.collection('Messages').doc(roomIdx).collection('msgRecords');

    const unsubscribe = refMsgData.orderBy('createdAt', 'asc').onSnapshot(snapshot => {
      const data = snapshot.docs.map(doc => doc.data());
      setMessages(data);
    });

    return unsubscribe; // Return the unsubscribe function

  };

  const renderMessage = ({ item }) => {
    const currentUserEmail = firebaseAuth.currentUser.email;

    if (item.sender === currentUserEmail) {
      return (
        <View style={{ alignItems: 'flex-end' }}>
          <View style={{ backgroundColor: '#3D4A7A', padding: 10, borderRadius: 100 }}>
            <Text style={{ color: 'white', fontFamily:'cabin' }}>{item.message}</Text>
          </View>
          <Text style={{ color: 'black', fontSize: 10, marginBottom: 10, marginTop: 5, fontFamily:'cabin'}}>
            {item.createdAt ? item.createdAt.toDate().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) : ''}
          </Text>
        </View>
      );
    } else {
      return (
        <View style={{ alignItems: 'flex-start' }}>
          <View style={{ backgroundColor: '#F2F7FB', padding: 10, borderRadius: 100 }}>
            <Text style={{ color: 'black',fontFamily:'cabin' }}>{item.message}</Text>
          </View>
          <Text style={{ color: 'black', fontSize: 10, marginBottom: 10, marginTop: 5, fontFamily:'cabin'}}>
            {item.createdAt ? item.createdAt.toDate().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) : ''}
          </Text>
        </View>
      );
    }
  };
  1

  return (


    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      {/* Your existing code */}
      <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>

        {/* Top Bar */}
        <View style={{ flexDirection: 'row', marginLeft: 15, marginTop: 15, marginBottom: 10, alignItems: 'center', justifyContent: 'space-between', marginRight: 15 }}>

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={naviGateBack}>
              <Image
                source={require('../assets/Back.png')}
                style={{ width: 40, height: 40 }}

              />
            </TouchableOpacity>

            <Image
              source={{ uri: profilePicUrl }}
              style={{ width: 50, height: 50, borderRadius: 100 }}
            />
            <View>
              <Text style={{ marginLeft: 10, color: 'black', fontSize: 25, fontFamily:'cabin' }}>{name}</Text>
              <Text style={{ marginLeft: 10, fontFamily:'acme' }}>{email}</Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row' }}>
            <Image
              source={require('../assets/Call.png')}
              style={{ width: 30, height: 30,  marginRight: 10 }}

            />
            <Image
              source={require('../assets/Video.png')}
              style={{ width: 35, height: 35, borderRadius: 100 }}

            />
          </View>
        </View>

        {/* Chat text box and message area */}
        <View style={{ flex: 1, backgroundColor: 'white', padding: 10 }}>

          {/* render message using flatlist */}

          <FlatList
            data={messages}
            renderItem={renderMessage}
            keyExtractor={item => item.id} // Extracts unique key for each item

          />

          {/* message text box */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'white', borderRadius: 100, borderColor: 'grey', borderWidth: 1, paddingRight: 10 }}>
            <TextInput onChangeText={setCurrentMessage} value={currentMessage} placeholder='Write your message...' placeholderTextColor='black' style={{ flex: 1, height: 50, padding: 10, paddingLeft: 20, paddingRight: 50, backgroundColor: 'white', borderRadius: 100, borderWidth: 0, color: 'black' }} />
            <TouchableOpacity onPress={sendMessage} style={{ position: 'absolute', right: 15, height: '100%', justifyContent: 'center' }}>
              <Image
                source={require('../assets/send.png')}
                style={{ width: 20, height: 20 }}
              />
            </TouchableOpacity>
          </View>
        </View>


      </View>
    </View>

  );
};

export default ChatScreen;

const styles = StyleSheet.create({});
