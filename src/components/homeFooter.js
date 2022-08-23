import React, { useState } from 'react'
import {
  Pressable,
	StyleSheet,
	Text,
	View,
  Alert,
} from "react-native";
import { GLView } from "expo-gl";
import * as Sharing from "expo-sharing";
import { usePreventScreenCapture } from 'expo-screen-capture';
import * as ScreenCapture from 'expo-screen-capture';
import * as MediaLibrary from 'expo-media-library';
import { captureScreen } from "react-native-view-shot";
import { AntDesign } from '@expo/vector-icons'; 
import { Fontisto } from '@expo/vector-icons'
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import { MaterialIcons } from '@expo/vector-icons'; 
import { Entypo } from '@expo/vector-icons'; 
import { Ionicons } from '@expo/vector-icons'; 
import { cpk_coloryng, cpk_coloryng_es } from '../utils/cpkColorings'


const HomeFooter = ({ colorsLight, setColorsLight, jmolRasmol, setJmolRasmol, translateApp, setTranslateApp }) => {
  const [colorPress, setColorPress] = useState(0)

  const handlePressableJmol = () => {
    setJmolRasmol(!jmolRasmol) 
  }

  const handlePressableInfo = () => {
    setColorPress(4)
    Alert.alert(
      "CPK coloring",
      `${!translateApp ? cpk_coloryng_es : cpk_coloryng}`,
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "OK", onPress: () => setColorPress(0) },
      ],
      { cancelable: false }
    );
  }

  return (
    <View style={{ flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    backgroundColor: !colorsLight ? "#3D405B" : '#81B29A',
    paddingVertical: 15,
    bottom: 0,
    zIndex: 1,
    alignSelf: "center",
    justifyContent: "center"} }>
      <Pressable
          style={{ alignItems: 'center', flex: 1 }}
          onPress={() => setColorsLight(!colorsLight)}
        >
          <MaterialCommunityIcons name="theme-light-dark" size={24} color={!colorsLight ? "#F2CC8F" : "white"} />
      </Pressable>
      <Pressable
          style={{ alignItems: 'center', flex: 1 }}
          onPress={() => setTranslateApp(!translateApp)}
        >
          <Entypo name="language" size={24} color={!translateApp ? "#F2CC8F" : "white"} />
      </Pressable>
      <Pressable
          style={{ alignItems: 'center', flex: 1 }}
          onPress={handlePressableJmol}
        >
          <Text style={{ color: "#fff" }}>
              {jmolRasmol ? <Ionicons name="color-filter-outline" size={24} color="white" /> : <Ionicons name="color-filter-sharp" size={24} color="white" /> }
          </Text> 
      </Pressable>
      <Pressable
          style={{ alignItems: 'center', flex: 1 }}
          onPress={handlePressableInfo}
        >
          <AntDesign name="infocirlceo" size={24} color={colorPress ? "#F2CC8F" : "white" } />
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    backgroundColor: '#81B29A',
    paddingVertical: 15,
    bottom: 0,
    zIndex: 1,
    alignSelf: "center",
    justifyContent: "center"
  }}
)

export default HomeFooter