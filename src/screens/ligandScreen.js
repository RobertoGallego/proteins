import React, { useContext, useEffect, useState, useRef } from "react";
import {
  Pressable,
	ActivityIndicator,
	StyleSheet,
	Text,
	TouchableOpacity,
	useColorScheme,
	View,
	StatusBar as RNStatusBar,
	Alert,
	Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// import Feather from "react-native-vector-icons/Feather";
// import useOrientation from "../hooks/useOrientation";
import { setStatusBarNetworkActivityIndicatorVisible, StatusBar } from "expo-status-bar";
// import { captureScreen } from "react-native-view-shot";
// import * as MediaLibrary from "expo-media-library";
// import * as Sharing from "expo-sharing";
import { GLView } from "expo-gl";
import { Renderer } from "expo-three";
import * as THREE from "three";
import matchAll from "string.prototype.matchall";

import Axios from "axios";
import Colors from "../components/CPK_Colors.json";
import { getConnect, mapAtoms } from "../components/PdbParse_Connect";
import parsePdb from "parse-pdb";
import OrbitControlsView from "expo-three-orbit-controls";
// Feather.loadFont();

import Footer from '../components/footer'

const LigandScreen = ({ navigation, route }) => {
	const colorScheme = useColorScheme();
	// const orientation = useOrientation();
	const RefScreen = useRef(null);
	const [modul, setModulisation] = useState(1);

	const [connects, setConnects] = useState([]);
	const [mount, setMounted] = useState(true);
	const [Atoms, setAtoms] = useState([]);
	const [keyRender, setKeyrender] = useState(false);
	const [jmol, setJmol] = useState(true);

	const { item } = route.params
  console.log("item", item)
	const url1 = `https://files.rcsb.org/ligands/view/${item}_model.pdb`;
	const [width, setWidth] = useState(Dimensions.get("screen").width);
	const [height, setHeight] = useState(Dimensions.get("screen").height);

	const [aspectRatio, setCameraRatio] = useState(
		width < height ? width / height : height / width
	);
	const renderRef = useRef(null);



	useEffect(() => {
		Axios(url1)
			.then((res) => {
				if (res.data) {
					let array = [...matchAll(res.data, /^CONECT(:?\s*\d+.+)+/gm)];
					let atomsPdb = parsePdb(res.data);
					let newAtoms = mapAtoms(atomsPdb.atoms);
					setAtoms(newAtoms);

					array = array.filter((el, key) => key < atomsPdb.atoms?.length);
					setConnects(getConnect(array));
					setMounted(false);
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
			// fontFamily: "Bold",
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
			// position: "absolute",
			// top: 0,
			// left: 0,
			zIndex: 1,
		},
		
		spinner: {
			position: "absolute",
			top: "50%",
			left: "50%",
			transform: [{ translateX: -10 }],
		},
	});

	const styles_landscape = StyleSheet.create({
		go_back: {
			position: "absolute",
			top: 20,
			left: 20,
			zIndex: 1,
		},
	});
	
	const change_color = () => {
		setJmol(!jmol);
		setKeyrender(!keyRender);
	};


	useEffect(() => {
		const subscription = Dimensions.addEventListener("change", () => {
			setWidth(Dimensions.get("screen").width);
			setHeight(Dimensions.get("screen").height);
			setCameraRatio(
				Dimensions.get("screen").width / Dimensions.get("screen").height
			);
			console.log("Camera", camera.position.z);
			setKeyrender(!keyRender);
		});
		return () => subscription?.remove();
	}, [width, height]);
	const geo = new THREE.SphereGeometry();
	const geo2 = new THREE.BoxGeometry();
	const scene = new THREE.Scene();
	// const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000); 
  const camera = new THREE.PerspectiveCamera(90, aspectRatio, 0.01, 1000);
	const raycaster = new THREE.Raycaster();
	function capitalizeFirstLetter(string) {
		return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
	}
	const handleStateChange = ({ nativeEvent }) => {
		let mouse = new THREE.Vector2();
		mouse.x = (nativeEvent.pageX / width) * 2 - 1;
		mouse.y = -(nativeEvent.pageY / height) * 2 + 1;
		raycaster.setFromCamera(mouse, camera);
		// calculate objects intersecting the picking ray
		const intersects = raycaster.intersectObjects(scene.children);
		if (intersects[0]?.object?.AtomsInfos) {
			let elemnt = capitalizeFirstLetter(
				intersects[0].object.AtomsInfos.element
			);
			console.log(elemnt);
			Alert.alert(
				"Atom Details",
				`Element : ${elemnt}
				Discovered by: ${Colors[elemnt]?.discoverd_by}
				Phase: ${Colors[elemnt]?.phase}`,
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
	};
  const [glSnapShot, setGlSnapShot] = React.useState(null);

	// const snapshot = async () => {
	// 	try {
	// 		let uri = await captureScreen({
	// 			format: "jpg",
	// 			quality: 0.8,
	// 		});
	// 		await Sharing.shareAsync(uri, { dialogTitle: "Share this image" });
	// 		let result = await MediaLibrary.requestPermissionsAsync(true);
	// 		if (result.status === "granted") {
	// 			let r = await MediaLibrary.saveToLibraryAsync(uri);
	// 			console.log(r);
	// 		}
	// 	} catch (e) {
	// 		console.log(e);
	// 	}
	// };

	return (
		<View style={styles.background}>
			{/* <SafeAreaView style={{ flex: 1 }}> */}
				{/* <StatusBar style={colorScheme === "dark" ? "light" : "dark"} /> */}
				{/* {orientation === "portrait" ? ( */}
					{/* <View style={styles.header}>
						<TouchableOpacity
							style={styles.button}
							onPress={() => {
								navigation.goBack();
							}}
						>
							<Feather
								name="chevron-left"
								size={24}
								color={"#E5E5E5"}
							/>
						</TouchableOpacity>
						<View style={styles.qalb}></View>
					</View> */}
				{/* ) : null} */}
				<View style={styles.content}>
					{/* {orientation === "portrait" ? null : ( */}
						{/* <TouchableOpacity
							style={[styles.button, styles_landscape.go_back]}
							onPress={() => {
								navigation.goBack();
							}}
						>
							<Feather
								name="chevron-left"
								size={24}
								color={"#343434"}
							/>
						</TouchableOpacity> */}
					{/* )} */}
					{/* <ActivityIndicator style={styles.spinner} color="white" /> */}
					{/* Drawing Protein */}
					{mount ? (
						<ActivityIndicator color="#3D405B" size="large" style={{
              width: "100%", height: "100%", alignItems:"center", justifyContent: 'center'
            }}/>
					) : (
						<>
							<OrbitControlsView
								key={keyRender}
								style={{ flex: 1 }}
								camera={camera}
								onTouchEndCapture={handleStateChange}
							>
								<GLView
									ref={RefScreen}
									key={keyRender}
									style={{ flex: 1 }}
									onContextCreate={async (gl) => {
										
										

										const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;
                    gl.canvas = { width: gl.drawingBufferWidth, height: gl.drawingBufferHeight };
										
                    const sceneColor = "#000";
                    // Create a WebGLRenderer without a DOM element
										const renderer = new Renderer({ gl });
										renderRef.current = renderer;
										renderer.setClearColor(sceneColor);
										renderer.setSize(width, height);

										camera.position.set(0, 0, 50);
                    // const scene = new THREE.Scene();

                    // scene.fog = new Fog(sceneColor, 1, 10000);
										camera.lookAt(scene.position);
                    // camera.lookAt(0, -15, 0);

										const ambientLight = new THREE.DirectionalLight(
											0xffffff,
											0.9
										);
										ambientLight.position.copy(camera.position);
										scene.add(ambientLight);
										/********** Use PDB PARSER */
										const position = new THREE.Vector3();
										for (let i = 0; i < Atoms?.length; i++) {
											/**
											 * Make the first letter of the element uppercase amd the rest lowercase
											 */
											const element =
												Atoms[i].element.charAt(0).toUpperCase() +
												Atoms[i].element.slice(1).toLowerCase();
											let colorCpk = jmol
												? Colors[element].jmol
												: Colors[element].rasmol;
											position.x = Atoms[i].x;
											position.y = Atoms[i].y;
											position.z = Atoms[i].z;
											let color = new THREE.Color("#" + colorCpk);
											const mtrl = new THREE.MeshPhongMaterial({
												color: color,
												shininess: 50,
											});

											let object = new THREE.Mesh(
												// modul === 3 ? geo2 : geo,
												geo,
												mtrl
											);

											position.multiplyScalar(
												width > height ? width / height + 1 : height / width + 1
											);

											object.position.copy(position);
											object.AtomsInfos = Atoms[i];
											scene.add(object);
										}
										const start = new THREE.Vector3();
										const end = new THREE.Vector3();
										// if (modul !== 2) {
											for (let j = 0; j < connects.length; j++) {
												for (let i = 1; i < connects[j].length; i++) {
													if (connects[j][i] - 1 < Atoms.length) {
														start.x = Atoms[connects[j][0] - 1].x;
														start.y = Atoms[connects[j][0] - 1].y;
														start.z = Atoms[connects[j][0] - 1].z;
														end.x = Atoms[connects[j][i] - 1].x;
														end.y = Atoms[connects[j][i] - 1].y;
														end.z = Atoms[connects[j][i] - 1].z;

														start.multiplyScalar(
															width > height
																? width / height + 1
																: height / width + 1
														);
														end.multiplyScalar(
															width > height
																? width / height + 1
																: height / width + 1
														);
														const geoBox = new THREE.BoxGeometry(
															0.5,
															0.5,
															start.distanceTo(end)
														);
														const cylinder = new THREE.Mesh(
															geoBox,
															new THREE.MeshPhongMaterial({ color: 0xffffff })
														);
														cylinder.position.copy(start);
														cylinder.position.lerp(end, 0.5);
														cylinder.lookAt(end);
														scene.add(cylinder);
													}
												}
											}
										// }
										// setGlSnapShot(gl)

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
        <Footer camera={camera} scene={scene} renderRef={renderRef} glSnapShot={glSnapShot}/>
		</View>
	);
};

export default LigandScreen;