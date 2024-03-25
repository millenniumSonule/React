import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Image, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { firebaseAuth } from '../config';

const Splashscreen = () => {
    const navigation = useNavigation();
    const [currentUserName, setCurrentUserName] = useState('');

    useEffect(() => {
        const unsubscribe = firebaseAuth.onAuthStateChanged(user => {
            if (user) {
                setCurrentUserName(user.email);
            } else {
                setCurrentUserName(null);
            }
            setTimeout(() => {
                navigation.navigate(currentUserName ? 'Homepage' : 'Login');
            }, 3000);
        });

        return () => unsubscribe(); // Cleanup function to unsubscribe from the listener
    }, []);

    return (
        <ImageBackground source={require('../assets/Splash.jpg')} style={{ flex: 1 }}>
            <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                <Image style={{ width: 350, height: 400, position: 'absolute', resizeMode: 'contain' }} source={require('../assets/splashVec.png')} />
                <Text style={{ color: 'white', fontSize: 72, lineHeight: 78, textAlign: 'center', fontFamily: 'acme', marginBottom: 50 }}>Textit</Text>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default Splashscreen;
