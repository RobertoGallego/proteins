import React, { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import * as LocalAuthentication from "expo-local-authentication";
import { FontAwesome5 } from '@expo/vector-icons'; 

const SignInScreen =  ({navigation}) => {
  const [deviceHardwareState, setDeviceHardwareState] = useState(false)

  const onTouchID = async () => {
    try {
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      if (!isEnrolled) {
        throw new Error("Your device is not Enrolled");
      }
      const worked = await LocalAuthentication.authenticateAsync();
      if (worked){
        navigation.navigate('Home');
      // alert("you're logged in");
    }
    } catch (error) {
      alert("warning authentication failed");
    }
  };

  useEffect(() => {
    const deviceHardware = async () => {
      const isCompatible =  await LocalAuthentication.hasHardwareAsync();
      setDeviceHardwareState(isCompatible)
      if (!isCompatible) alert("Your device is not compatible")
    }
  
    deviceHardware()
      .catch(console.error);;
  }, [])

  if (!deviceHardwareState) return (
    <View style={styles.container}>
      <Text>Your device is not compatible</Text>
    </View>
  )

  return (
    <View style={styles.container}>
      <Pressable style={{ color: '#000', fontSize: 18, backgroundColor: '#81B29A', alignItems: 'center',
        borderRadius: 100, padding: 20
      }} onPress={onTouchID} >
        <FontAwesome5 name="fingerprint" size={24} color="white" />
        <Text style={{ marginTop: 5, fontWeight: '700', color: 'white' }}>SIGN IN</Text></Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    }
})

export default SignInScreen;