import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, Modal, FlatList, Alert } from 'react-native';
import { firebaseAuth, firestore } from '../config';
import { useNavigation } from '@react-navigation/native';
import Homepage from './Homepage';
import imageUrls from '../profilePicData'; // Assuming the file is in the same directory

const Signup = () => {
  const [name, setname] = useState('');
  const [email, setemail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [profilePicUrl, setProfilePicUrl] = useState('https://firebasestorage.googleapis.com/v0/b/textit-365aa.appspot.com/o/blankProfile.png?alt=media&token=58ca9867-3baa-4b70-b166-52e8ae907d45');
  const navigation = useNavigation();


  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleSignup = () => {
    if (password === confirmPassword) {
      firebaseAuth
        .createUserWithEmailAndPassword(email, password)
        .then(() => {
          Alert.alert('User Generated');
          addDataToUserList();
          navigation.navigate('Homepage');
        })
        .catch((err) => {
          console.warn(err.message);
        });
    } else {
      Alert.alert('Password does not match');
    }
  };

  const addDataToUserList = async () => {
    try {
      const userRef = firestore.collection('UsersList');
      await userRef.add({
        name: name,
        email: email,
        profilePicUrl:profilePicUrl,
      });
      console.log('Document added to collection');
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  const setProfilePic = (url) => {
    setProfilePicUrl(url);
  }
  const renderImage = ({ item }) => (
    <TouchableOpacity onPress={() => setProfilePic(item)}>
    <Image
        style={{ width: 100, height: 100, margin: 5 }}
        source={{ uri: item }}
      />
    </TouchableOpacity>
    
  );

  return (
    <View style={{ flex: 1 }}>
      <View style={{ alignItems: 'center', marginTop: '10%' }}>
        <Text style={{ color: '#3D4A7A', fontSize: 25, fontWeight: '900' }}>Sign up with email</Text>
        <Text style={{ marginTop: 20, textAlign: 'center', marginLeft: 30, marginRight: 30, fontSize: 20, color: 'grey' }}>
          Get chatting with friends and family today by signing up for our chat app!
        </Text>
        <TouchableOpacity onPress={openModal} style={{ width: 90, height: 90, borderRadius: 50, marginTop: 10 }}>
          <Image
            style={{ width: 90, height: 90, borderRadius: 50 }}
            source={{ uri: profilePicUrl }}
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

      <Text style={{ marginTop: '12%', marginLeft: 15, fontSize: 15, color: '#3D4A7A', fontWeight: 500 }}>Your Name</Text>
      <TextInput value={name} onChangeText={setname} style={{ borderBottomWidth: 1, marginLeft: 20, marginRight: 20, borderBottomColor: 'grey' }} />

      <Text style={{ marginTop: '8%', marginLeft: 15, fontSize: 15, color: '#3D4A7A', fontWeight: 500 }}>Your Email</Text>
      <TextInput value={email} onChangeText={setemail} style={{ borderBottomWidth: 1, marginLeft: 20, marginRight: 20, borderBottomColor: 'grey' }} />

      <Text style={{ marginTop: '8%', marginLeft: 15, fontSize: 15, color: '#3D4A7A', fontWeight: 500 }}>Password</Text>
      <TextInput value={password} secureTextEntry={true} onChangeText={setPassword} style={{ borderBottomWidth: 1, marginLeft: 20, marginRight: 20, borderBottomColor: 'grey' }} />

      <Text style={{ marginTop: '8%', marginLeft: 15, fontSize: 15, color: '#3D4A7A', fontWeight: 500 }}>Confirm Password</Text>
      <TextInput value={confirmPassword} secureTextEntry={true} onChangeText={setConfirmPassword} style={{ borderBottomWidth: 1, marginLeft: 20, marginRight: 20, borderBottomColor: 'grey' }} />

      <View style={{ alignItems: 'center', marginTop: '8%', width: '100%' }}>
        <TouchableOpacity onPress={handleSignup} style={{ backgroundColor: '#3D4A7A', width: '80%', alignItems: 'center', height: 40, justifyContent: 'center', borderRadius: 100 }}>
          <Text style={{ color: 'white', fontWeight: 500 }}>Create an account</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={{ marginTop: 20 }}>
          <Text style={{ color: '#3D4A7A' }}>Already have an account? Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Signup;

const styles = StyleSheet.create({});
