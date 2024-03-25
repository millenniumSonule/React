import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { firebaseAuth } from '../config';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation from @react-navigation/native
import Homepage from './Homepage';
import Signup from './Signup';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();

    useEffect(() => {
        const unsubscribe = firebaseAuth.onAuthStateChanged(user => {
            if (user) {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Homepage' }],
                });
            }
        });

        return unsubscribe;
    }, [navigation]);

    const handleLogin = () => {
        firebaseAuth.signInWithEmailAndPassword(email, password)
            .then(() => {
                Alert.alert("Login as " + email);
                navigation.navigate('Homepage');
            })
            .catch(err => {
                Alert.alert(err.message);
            });
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ alignItems: 'center', marginTop: '20%' }}>
                <Text style={{ color: '#3D4A7A', fontSize: 25, fontWeight: '900' }}>Log in to Chatbox</Text>
                <Text style={{ marginTop: 20, textAlign: 'center', marginHorizontal: '10%', fontSize: 20, color: 'grey' }}>
                    Welcome back! Sign in using your social account or email to continue us
                </Text>
            </View>

            {/* Email  */}
            <Text style={{ marginTop: '8%', marginLeft: '10%', fontSize: 15, color: '#3D4A7A', fontWeight: 500 }}>Your Email</Text>
            <TextInput value={email} onChangeText={setEmail} style={{ borderBottomWidth: 1, marginLeft: '10%', marginRight: '10%', borderBottomColor: 'grey', width: '80%' }} />

            {/* Password  */}
            <Text style={{ marginTop: '8%', marginLeft: '10%', fontSize: 15, color: '#3D4A7A', fontWeight: 500 }}>Password</Text>
            <TextInput value={password} secureTextEntry={true} onChangeText={setPassword} style={{ borderBottomWidth: 1, marginLeft: '10%', marginRight: '10%', borderBottomColor: 'grey', width: '80%' }} />

            <View style={{ alignItems: 'center', marginTop: '20%', width: '100%' }}>
                <TouchableOpacity onPress={handleLogin} style={{ backgroundColor: '#3D4A7A', width: '80%', alignItems: 'center', height: 40, justifyContent: 'center', borderRadius: 100 }}>
                    <Text style={{ color: 'white', fontWeight: 500 }}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ marginTop: 20 }}>
                    <Text style={{ color: '#3D4A7A' }}>Forgot Password</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Signup')} style={{ marginTop: 20 }}>
                    <Text style={{ color: '#3D4A7A' }}>Don't have an account? Sign up</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

export default Login;
