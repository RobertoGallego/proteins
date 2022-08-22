import React, { useRef } from 'react'
import {
  Pressable,
	StyleSheet,
	Text,
	View,
} from "react-native";
import { GLView } from "expo-gl";
import * as Sharing from "expo-sharing";
import { usePreventScreenCapture } from 'expo-screen-capture';
import * as ScreenCapture from 'expo-screen-capture';
import * as MediaLibrary from 'expo-media-library';
import { captureScreen } from "react-native-view-shot";

import { Fontisto } from '@expo/vector-icons'

const Footer = ({ camera, renderRef, glSnapShot, colorsLight, setColorsLight }) => {
  const scene = new THREE.Scene();
  const handleZoomLingands = zoomDirection => {
    console.log(camera.fov)
    if (camera.fov >= 60 && zoomDirection) camera.fov -= 5
    if (camera.fov <= 120 && !zoomDirection) camera.fov += 5;

    camera.updateProjectionMatrix();
    renderRef.current && renderRef.current.render(scene, camera);
  }

  const shareScreen = async () => {
    const localUri = await captureScreen({ format: "jpg" })
    const { status } = await MediaLibrary.requestPermissionsAsync();
    
    if (status === 'granted') {
      Sharing.shareAsync(localUri, {}).finally(async() =>
        await MediaLibrary.saveToLibraryAsync(localUri)
      )
    }
  }
  
	// useEffect(() => {
	// 	if (modul > 0 && modul < 4) {
	// 		setModulisation(modul);
	// 		setKeyrender(!keyRender);
	// 	} else if (modul === 4) {
	// 		change_color();
	// 	} else return;
	// }, [modul]);

  return (
    <View style={styles.footer}>
          <Pressable
              style={{ alignItems: 'center', flex: 1, backgroundColor: "#81B29A", paddingVertical: 14, marginHorizontal: 10,
              borderRadius: 100,  }}
              onPress={() => handleZoomLingands(true)}
            > 
              <Fontisto name="zoom-plus" size={24} color="white" />
          </Pressable>
          <Pressable
              style={{ alignItems: 'center', flex: 1, backgroundColor: "#90bda7", paddingVertical: 14, marginHorizontal: 10,
              borderRadius: 100,}}
              onPress={() => handleZoomLingands(false)}
            >
              <Fontisto name="zoom-minus" size={24} color="white" />
          </Pressable>
          <Pressable
              style={{ alignItems: 'center', flex: 1, backgroundColor: "#81B29A", paddingVertical: 14, marginHorizontal: 10,
              borderRadius: 100, }}
              onPress={shareScreen}
            >
              {/* <Entypo name="language" size={24} color={"white"} /> */}
              <Text style={{ color: "#fff" }}>{'EN'}</Text>
          </Pressable>
          <Pressable
              style={{ alignItems: 'center', flex: 1, backgroundColor: "#81B29A", paddingVertical: 14, marginHorizontal: 10,
              borderRadius: 100, }}
              onPress={() => {}}
            >
              <Text style={{ color: "#fff" }}>
                 Jmol
              </Text> 
              {/* {Jmol ? JmolCOlor : JemolColor} */}
              {/* <Entypo name="language" size={24} color={"white"} /> */}
          </Pressable>

        </View>
  )
}

	{/* <View style={styles.footer}>
					<View style={styles.buttons_group}>
						<TouchableOpacity
							style={styles.buttons_group_item}
							onPress={() => setModulisation(1)}
						>
							<Text style={styles.buttons_group_item}>1</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.buttons_group_item}
							onPress={() => setModulisation(2)}
						>
							<Text style={styles.buttons_group_item}>2</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.buttons_group_item}
							onPress={() => setModulisation(3)}
						>
							<Text style={styles.buttons_group_item}>3</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.buttons_group_item}
							onPress={() => setModulisation(4)}
						>
							<Text style={styles.buttons_group_item}>4</Text>
						</TouchableOpacity>
					</View>
					<TouchableOpacity style={styles.button} onPress={snapshot}>
						<Feather
							name="share-2"
							size={24}
							color={"#343434"}
						/>
					</TouchableOpacity>
				</View> */}


const styles = StyleSheet.create({
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",

    // borderColor: '#81B29A',
    // borderWidth: 5,
    // borderRadius: 100,

    bottom: 10,
    // left: 0,
    zIndex: 1,
    width: "90%",
    alignSelf: "center",
    justifyContent: "center"
  }}
)

export default Footer