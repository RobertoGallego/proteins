import React, { useRef, useState, useEffect } from 'react'
import { StatusBar } from 'expo-status-bar'

import { StyleSheet, View, LogBox } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import HomeScreen from './src/screens/homeScreen'
import LigandScreen from './src/screens/ligandScreen'
import SignInScreen from './src/screens/signInScreen'

console.disableYellowBox = true

export default function App() {
  const Stack = createNativeStackNavigator()
  
  const [translateApp, setTranslateApp] = useState(false)
  const [colorsLight, setColorsLight] = useState(false)
  const [jmolRasmol, setJmolRasmol] = useState(false)

  LogBox.ignoreAllLogs() 

  return (
    <View style={styles.container}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="SignInScreen"
            options={{orientation: 'false'}} 
            screenOptions={{ headerShown: true, orientation: "portrait",  }}
        >
          {/* ACTIVAR AL FINAL */}
          {/* <Stack.Screen name="Signin" options={() => ({
            // title: translateApp ? 'Proteinas' : 'Proteins',
            headerStyle: {
              backgroundColor: colorsLight ? '#F4F1DE' : '#81B29A',
            },
            headerTitleStyle: {
              fontWeight: 'normal',
            },
            headerTintColor: colorsLight ? '#81B29A' : '#fff',
          })}>
              {(props) => <SignInScreen {...props} />}
          </Stack.Screen> */}
          <Stack.Screen name={"Home"} options={{
            // title: translateApp ? 'Contacto' : 'Contact',
            headerStyle: {
              backgroundColor: colorsLight ? '#81B29A' : "#3D405B",
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'normal',
            },
            headerBackVisible: false
          }}>
            {(props) => <HomeScreen {...props} colorsLight={colorsLight} translateApp={translateApp} setTranslateApp={setTranslateApp} setColorsLight={setColorsLight} jmolRasmol={jmolRasmol} setJmolRasmol={setJmolRasmol}/>}
          </Stack.Screen>
          <Stack.Screen name="Protein" options={{
            // title: translateApp ? 'Mi Contacto' : 'My contact',
            headerStyle: {
              backgroundColor: colorsLight ? '#81B29A' : "#3D405B",
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'normal',
            },
          }}>
            {(props) => <LigandScreen {...props} colorsLight={colorsLight} setColorsLight={setColorsLight} jmolRasmol={jmolRasmol} setJmolRasmol={setJmolRasmol}/>}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="auto" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

// #F4F1DE #E07A5F #3D405B #81B29A #F2CC8F