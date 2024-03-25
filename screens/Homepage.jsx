import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView,Modal, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { firebaseAuth, firestore } from '../config';
import { onSnapshot, collection, query, where, getDocs, updateDoc, doc  } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import ChatScreen from './ChatScreen';
import imageUrls from '../profilePicData'; // Assuming the file is in the same directory

const Homepage = () => {
  const [userData, setUserData] = useState([]);
  const [currentUserName, setCurrentUserName] = useState('');
  const [currentProfile, setCurrentProfile] = useState('https://firebasestorage.googleapis.com/v0/b/textit-365aa.appspot.com/o/blankProfile.png?alt=media&token=58ca9867-3baa-4b70-b166-52e8ae907d45');
  const [loading, setLoading] = useState(true); // State to track loading status
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);


  const updateUserProfilePic = async (newProfilePicUrl) => {
    try {
        const userRef = collection(firestore, 'UsersList');
        const querySnapshot = await getDocs(query(userRef, where('email', '==', firebaseAuth.currentUser.email)));
        
        if (!querySnapshot.empty) {
            querySnapshot.forEach((doc) => {
                // Update the profilePicUrl field for the document with the specified email
                updateDoc(doc.ref, { profilePicUrl: newProfilePicUrl })
                    .then(() => {
                        console.log('Profile picture updated successfully.');
                    })
                    .catch((error) => {
                        console.error('Error updating profile picture:', error);
                    });
            });
        } else {
            console.warn('No user found with the specified email: ' + firebaseAuth.currentUser.email);
        }
    } catch (error) {
        console.error('Error searching for user:', error);
    }
};


  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const fetchUserData = async () => {
    try {
      const querrySnapshot = await getDocs(collection(firestore, 'UsersList'));
      const userArray = [];
      querrySnapshot.forEach((doc) => {
        userArray.push(doc.data());
      });
      setUserData(userArray);
      setLoading(false); // Set loading to false after data is fetched

      const unsubscribe = onSnapshot(collection(firestore, 'UsersList'), (snapshot) => {
        const updatedUserArray = [];
        snapshot.forEach((doc) => {
          updatedUserArray.push(doc.data());
        });
        setUserData(updatedUserArray);
      });

      return () => unsubscribe();
    } catch (error) {
      console.warn(error);
    }
  };

  const chatScreen = (email, name, profilePicUrl) => {
    navigation.navigate('ChatScreen', { email: email, name: name, profilePicUrl:profilePicUrl });
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const renderList = ({ item }) => {
    if (item.email !== firebaseAuth.currentUser.email) {
      return (
        <TouchableOpacity onPress={() => chatScreen(item.email, item.name, item.profilePicUrl)}>
          <View style={{ marginBottom: 15, borderBottomColor: '#2B3357', width: '100%', height: 50 }}>
            <View style={{ flexDirection: 'row' }}>
              <Image
                source={{ uri: item.profilePicUrl }}
                style={{ width: 45, height: 45, borderRadius: 100, marginRight: 15 }}
              />
              <View style={{ flexDirection: 'column' }}>
                <Text style={{ color: 'black', fontSize: 20, fontFamily:'cabin' }}>{item.name}</Text>
                <Text style={{ color: 'grey', fontSize: 15, fontFamily:'cabin' }}>{item.email}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      );
    } else {
      setCurrentUserName(item.name);
      setCurrentProfile(item.profilePicUrl)
      return null;
    }
  };
  const renderImage = ({ item }) => (
    <TouchableOpacity onPress={() => {
      updateUserProfilePic(item);
      setCurrentProfile(item);
      closeModal(); // Close the modal after selecting an image
    }}>
      <Image
        style={{ width: 100, height: 100, margin: 5 }}
        source={{ uri: item }}
      />
    </TouchableOpacity>
  );
  

  return (
    <View style={{ flex: 1, backgroundColor: 'black' }}>
      <View style={{ justifyContent: 'space-between', flexDirection: 'row', padding: 10, alignItems: 'center',backgroundColor: 'black'}}>
        <Text style={{ color: 'white', fontSize: 30, fontWeight: 400,fontFamily:'cabin'}}>Chats</Text>
        <TouchableOpacity onPress={openModal}>
        <Image
          source={{ uri: currentProfile }}
          style={{ width: 60, height: 60, borderRadius: 100 }}
        />
        </TouchableOpacity>
      </View>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >

        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <View style={{ backgroundColor: '#fff', padding: 20, borderRadius: 10, maxHeight: '50%', alignItems: 'flex-end' }}>
            <TouchableOpacity onPress={closeModal}>
              <Text>Close (x)</Text>
            </TouchableOpacity>

            <FlatList

              data={imageUrls}
              renderItem={renderImage}
              keyExtractor={(item, index) => index.toString()}
              numColumns={2}
              contentContainerStyle={{ paddingVertical: 5 }}
            />

          </View>
        </View>
      </Modal>

      <View style={{ flex: 1, backgroundColor: 'white', padding: 20, borderTopEndRadius:50, borderTopLeftRadius:50}}>
        {loading ? ( // Show activity indicator while loading is true
          <ActivityIndicator size="large" color="#2B3357" /> // Use a large size and color of your choice
        ) : (
          <FlatList
            data={userData}
            renderItem={renderList}
          />
        )}
      </View>
    </View>
  );
};

export default Homepage;

const styles = StyleSheet.create({});
