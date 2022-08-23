import React, { useEffect, useState, useRef } from "react";
import {
	ActivityIndicator,
	StyleSheet,
	View,
	Alert,
	Dimensions,
} from "react-native";
// import { captureScreen } from "react-native-view-shot";
// import * as MediaLibrary from "expo-media-library";
// import * as Sharing from "expo-sharing";
import { GLView } from "expo-gl";
import { Renderer } from "expo-three";
import * as THREE from "three";
import matchAll from "string.prototype.matchall";

import Axios from "axios";
import Colors from "../utils/cpkColorsDetails.json";
import { mapAtoms } from "../utils/mapAtoms"
import { getConnect } from "../utils/getConnect"
import parsePdb from "parse-pdb";
import OrbitControlsView from "expo-three-orbit-controls";
import Footer from '../components/footer'

const LigandScreen = ({ route, colorsLight, setColorsLight, jmolRasmol }) => {
	const RefScreen = useRef(null);
	const [connects, setConnects] = useState([]);
	const [loading, setLoading] = useState(true);
  const ConnectRegex = /^CONECT(:?\s*\d+.+)+/gm
	const [Atoms, setAtoms] = useState([]);
	const { item } = route.params
	const [width, setWidth] = useState(Dimensions.get("screen").width);
	const [height, setHeight] = useState(Dimensions.get("screen").height);
	const [aspectRatio, setCameraRatio] = useState(
		width < height ? width / height : height / width
	);
	const renderRef = useRef(null);
  
	useEffect(() => {
		Axios(`https://files.rcsb.org/ligands/view/${item}_model.pdb`)
			.then((res) => {
				if (res.data) {
					let array = [...matchAll(res.data, ConnectRegex)];
					let atomsPdb = parsePdb(res.data);
					let newAtoms = mapAtoms(atomsPdb.atoms);
					setAtoms(newAtoms);
					array = array.filter((el, key) => key < atomsPdb.atoms?.length);
					setConnects(getConnect(array));
					setLoading(false);
				}
			})
			.catch((er) => alert(er));
	}, []);

	const styles = StyleSheet.create({
		background: {
			flex: 1,
			backgroundColor: "#F4F1DE",
		},
		header: {
			paddingHorizontal: 21,
			paddingTop: 50,
			paddingBottom: 25,
			flexDirection: "row",
			justifyContent: "space-between",
			alignItems: "center",
			position: "absolute",
			top: 0,
			left: 0,
			width: "100%",
			zIndex: 1,
			backgroundColor: "#F4F1DE",
		},
		button: {
			backgroundColor: "#DCDCDC",
			width: 50,
			height: 50,
			justifyContent: "center",
			alignItems: "center",
			borderRadius: 25,
			flexDirection: "row",
		},
		buttons_group: {
			flexDirection: "row",
			justifyContent: "center",
			alignItems: "center",
			height: 50,
			backgroundColor: "#DCDCDC",
			borderRadius: 25,
		},
		buttons_group_item: {
			marginHorizontal: 10,
			fontSize: 20,
			color: "#343434",
		},
		qalb: {
			width: 50,
			height: 50,
		},
		content: {
			backgroundColor: "#F4F1DE",
			flex: 1,
			zIndex: 1,
		},
		
		spinner: {
			position: "absolute",
			top: "50%",
			left: "50%",
			transform: [{ translateX: -10 }],
		},
	});

	useEffect(() => {
		const dimensions = Dimensions.addEventListener("change", () => {
			setWidth(Dimensions.get("screen").width);
			setHeight(Dimensions.get("screen").height);
			setCameraRatio(
				Dimensions.get("screen").width / Dimensions.get("screen").height
			);
		});
		return () => dimensions?.remove();
	}, [width, height]);

	const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(90, aspectRatio, 0.01, 1000);
	const raycaster = new THREE.Raycaster();

  const showAtomsInfo = ({ nativeEvent }) => {
    let pointer = new THREE.Vector2();
    pointer.x = (nativeEvent.locationX / width) * 2 - 1;
    pointer.y = -(nativeEvent.locationY / height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    // calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects(scene.children);
    if (intersects.length > 0) {
      let element = intersects[0].object;
      if (element.AtomsInfos != undefined) {
        
        Alert.alert(
          "Atom Details",
          `
          Name: ${Colors[intersects[0].object.AtomsInfos.element]?.name}
          Element: ${intersects[0].object.AtomsInfos.element}
          Appearance: ${Colors[intersects[0].object.AtomsInfos.element]?.appearance}
          Category: ${Colors[intersects[0].object.AtomsInfos.element]?.category}
          Discovered by: ${Colors[intersects[0].object.AtomsInfos.element]?.discovered_by}
          Named by: ${Colors[intersects[0].object.AtomsInfos.element]?.named_by}
          Phase: ${Colors[intersects[0].object.AtomsInfos.element]?.phase}
          Number: ${Colors[intersects[0].object.AtomsInfos.element]?.number}
          Summary: ${Colors[intersects[0].object.AtomsInfos.element]?.summary}
          `,
          [
            {
              text: "Cancel",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel",
            },
            { text: "OK", onPress: () => console.log("OK Pressed") },
          ],
          { cancelable: false }
        );
      }
    }
  };

	return (
		<View style={styles.background}>
				<View style={styles.content}>
					{loading ? (
						<ActivityIndicator color="#3D405B" size="large" style={{
              width: "100%", height: "100%", alignItems:"center", justifyContent: 'center'
            }}/>
					) : (
						<>
							<OrbitControlsView
								style={{ flex: 1 }}
								camera={camera}
								onTouchEndCapture={showAtomsInfo}
                key={renderRef.current}
							>
								<GLView
									ref={RefScreen}
									style={{ flex: 1 }}
									onContextCreate={async (gl) => {
										
										
										// GL Parameter disruption
										const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;
                    gl.canvas = { width: gl.drawingBufferWidth, height: gl.drawingBufferHeight };
										
                    const sceneColor = "#F4F1DE";
                    // Create a WebGLRenderer without a DOM element
										// Renderer declaration and set properties
										const renderer = new Renderer({ gl });
										renderRef.current = renderer;
										renderer.setClearColor(sceneColor);
										renderer.setSize(width, height);

										camera.position.set(0, 0, 50);

										scene.add(camera)

										const ambientLight = new THREE.PointLight(0xffffff, 1);

										scene.add(ambientLight);
										// render ligand 

										const position = new THREE.Vector3();
										for (let i = 0; i < Atoms?.length; i++) {
											let cpk_color = jmolRasmol
												? Colors[Atoms[i].element].jmol
												: Colors[Atoms[i].element].rasmol;
											
											position.x = Atoms[i].x;
											position.y = Atoms[i].y;
											position.z = Atoms[i].z;
											let color = new THREE.Color("#" + cpk_color);

											const material = new THREE.MeshPhongMaterial({
												color: color,
											});

											let object = new THREE.Mesh(
												new THREE.SphereGeometry(),
												material
											);

											object.position.copy(position);

											// position circle
											object.position.multiplyScalar(height / width + 1);
											// circle scale
											object.scale.multiplyScalar(width / height + 0.2);

											object.AtomsInfos = Atoms[i];
											scene.add(object);
										}

										const start = new THREE.Vector3();
										const end = new THREE.Vector3();

											for (let j = 0; j < connects.length; j++) {
												for (let i = 1; i < connects[j].length; i++) {
													if (connects[j][i] - 1 < Atoms.length) {
														start.x = Atoms[connects[j][0] - 1].x;
														start.y = Atoms[connects[j][0] - 1].y;
														start.z = Atoms[connects[j][0] - 1].z;

														end.x = Atoms[connects[j][i] - 1].x;
														end.y = Atoms[connects[j][i] - 1].y;
														end.z = Atoms[connects[j][i] - 1].z;

														start.multiplyScalar(height / width + 1);
														end.multiplyScalar(height / width + 1);
														const boxGeometry = new THREE.BoxGeometry(
															0.6,
															0.6,
															start.distanceTo(end)
														);
														const object = new THREE.Mesh(
															boxGeometry,
															new THREE.MeshPhongMaterial({ color: 0xffffff })
														);
														object.position.copy(start);
														object.position.lerp(end, 0.5);
														object.lookAt(end);
														scene.add(object);
													}
												}
											}

										const render = () => {
											requestAnimationFrame(render);
											ambientLight.position.set(
												camera.position.x,
												camera.position.y,
												camera.position.z
											);
											renderer.render(scene, camera);
											gl.endFrameEXP();
										};
										render(); 
									}}
									
								/>
							</OrbitControlsView>
						</>
					)}
				</View>
        <Footer camera={camera} renderRef={renderRef} colorsLight={colorsLight} setColorsLight={setColorsLight}/>
		</View>
	);
};

export default LigandScreen;