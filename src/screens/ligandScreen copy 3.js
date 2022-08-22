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
                    style={{ flex: 1 }}
                    onContextCreate={async (gl) => {
                        // GL Parameter disruption
                        const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;

                        // Renderer declaration and set properties
                        const renderer = new Renderer({ gl });
                        renderer.setSize(width, height);
                        renderer.setClearColor("#000");

                        // Scene declaration, add a fog, and a grid helper to see axes dimensions
                        const scene = new Scene();

                        //const interaction = new Interaction(renderer, scene, camera);

                        scene.add(camera);

                        // light
                        var light = new THREE.PointLight(0xffffff, 1);
                        camera.add(light);

                        /********** render ligand *************/


                        scene.add(root);
                        var offset = new Vector3();

                        const geometryAtoms = pdb.geometryAtoms;
                        const geometryBonds = pdb.geometryBonds;
                        const json = pdb.json;

                        const boxGeometry = new BoxGeometry(1, 1, 1);
                        const sphereGeometry = new SphereGeometry();

                        geometryAtoms.computeBoundingBox();
                        geometryAtoms.boundingBox.getCenter(offset).negate();

                        geometryAtoms.translate(offset.x, offset.y, offset.z);
                        geometryBonds.translate(offset.x, offset.y, offset.z);

                        let positions = geometryAtoms.getAttribute('position');
                        const colors = geometryAtoms.getAttribute('color');

                        const position = new Vector3();
                        const color = new Color();

                        for (let i = 0; i < positions.count; i++) {

                            const atom = json.atoms[i];

                            position.x = positions.getX(i);
                            position.y = positions.getY(i);
                            position.z = positions.getZ(i);

                            color.r = colors.getX(i);
                            color.g = colors.getY(i);
                            color.b = colors.getZ(i);

                            const material = new MeshPhongMaterial({ color: color });

                            const object = new Mesh(sphereGeometry, material);
                            object.position.copy(position);
                            object.position.multiplyScalar(75);
                            object.scale.multiplyScalar(25);

                            root.add(object);

                            const text = document.createElement('div');
                            text.className = 'label';
                            text.style.color = 'rgb(' + atom[3][0] + ',' + atom[3][1] + ',' + atom[3][2] + ')';
                            text.textContent = atom[4];
                        }

                        positions = geometryBonds.getAttribute('position');

                        const start = new Vector3();
                        const end = new Vector3();

                        for (let i = 0; i < positions.count; i += 2) {

                            start.x = positions.getX(i);
                            start.y = positions.getY(i);
                            start.z = positions.getZ(i);

                            end.x = positions.getX(i + 1);
                            end.y = positions.getY(i + 1);
                            end.z = positions.getZ(i + 1);

                            start.multiplyScalar(75);
                            end.multiplyScalar(75);

                            const object = new Mesh(boxGeometry, new MeshPhongMaterial(0xffffff));
                            object.position.copy(start);
                            object.position.lerp(end, 0.5);
                            object.scale.set(5, 5, start.distanceTo(end));
                            object.lookAt(end);
                            root.add(object);

                        }
                        scene.add(root);

                        {/* scene.traverse(function (object) {
                        object.frustumCulled = false;
                    }); */}

                        //**********

                        // Render function
                        const render = () => {
                            timeout = requestAnimationFrame(render);
                            renderer.render(scene, camera);
                            // ref.current.getControls()?.update();
                            gl.endFrameEXP();
                        };
                        render();
                        setGlView(gl);
                    }}
                >
                </GLView>
							</OrbitControlsView>
						</>
					)}
				</View>
        <Footer camera={camera} scene={scene} renderRef={renderRef} glSnapShot={glSnapShot}/>
		</View>
	);
};

export default LigandScreen;