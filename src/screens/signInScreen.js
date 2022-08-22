import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import * as LocalAuthentication from "expo-local-authentication";

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
      // if (!isCompatible) alert("Your device is not compatible")
    }
  
    deviceHardware()
      .catch(console.error);;
  }, [])

  if (!deviceHardwareState) return (
    <View style={styles.container}>
      <Text>Your device is not compatible :(</Text>
    </View>
  )

  return (
    <View style={styles.container}>
      <Text>Sign in</Text>
      <Button title="signin" onPress={onTouchID} />
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