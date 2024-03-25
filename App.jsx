import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { NavigationContainer } from "@react-navigation/native";
import { useNavigation } from '@react-navigation/native'; // Import useNavigation from @react-navigation/native
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Splashscreen from './screens/Splashscreen';
import signup from './screens/Signup';
import Login from './screens/Login'
import Homepage from './screens/Homepage';
import ChatScreen from './screens/ChatScreen';
const Stack = createNativeStackNavigator();


const App = () => {
  return (
    <NavigationContainer>
      
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        
        <Stack.Screen name="Splashscreen" component={Splashscreen} />
        <Stack.Screen name="signup" component={signup} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Homepage" component={Homepage} />
        <Stack.Screen name="ChatScreen" component={ChatScreen} />

      </Stack.Navigator>

    </NavigationContainer>
  )
}

export default App

const styles = StyleSheet.create({})