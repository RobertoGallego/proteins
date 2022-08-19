import { ExpoWebGLRenderingContext, GLView } from 'expo-gl';
import { Renderer, TextureLoader } from 'expo-three';
import * as React from 'react';
import {
  AmbientLight,
  BoxBufferGeometry,
  Fog,
  GridHelper,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  PointLight,
  Scene,
  SpotLight,
} from 'three';

export default function LigandScreen() {
  let timeout;

  React.useEffect(() => {
    // Clear the animation loop when the component unmounts
    return () => clearTimeout(timeout);
  }, []);

  return (
    <GLView
      style={{ flex: 1 }}
      onContextCreate={onContextCreate}
    />
  );
}

class IconMesh extends Mesh {
  constructor() {
    super(
      new BoxBufferGeometry(1.0, 1.0, 1.0),
      new MeshStandardMaterial({
        // map: new TextureLoader().load(require('./assets/icon.png')),
        color: 0xff0000
      }),
    );
  }
}

function onContextCreate(gl) {
    const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;
    gl.canvas = { width: gl.drawingBufferWidth, height: gl.drawingBufferHeight };
    const sceneColor = 0x3D405B;

    // Create a WebGLRenderer without a DOM element
    const renderer = new Renderer({ gl });
    renderer.setSize(width, height);
    renderer.setClearColor(sceneColor);

    const camera = new PerspectiveCamera(70, width / height, 0.01, 1000);
    camera.position.set(2, 5, 5);

    const scene = new Scene();
    scene.fog = new Fog(sceneColor, 1, 10000);
    scene.add(new GridHelper(10, 10));

    const ambientLight = new AmbientLight(0x101010);
    scene.add(ambientLight);

    const pointLight = new PointLight(0xffffff, 2, 1000, 1);
    pointLight.position.set(0, 200, 200);
    scene.add(pointLight);

    const spotLight = new SpotLight(0xffffff, 0.5);
    spotLight.position.set(0, 500, 100);
    spotLight.lookAt(scene.position);
    scene.add(spotLight);

    const cube = new IconMesh();
    scene.add(cube);

    camera.lookAt(cube.position);

    function update() {
      cube.rotation.y += 0.05;
      cube.rotation.x += 0.025;
    }
     // Setup an animation loop
     const render = () => {
      // timeout = requestAnimationFrame(render);
      update();
      renderer.render(scene, camera);
      gl.endFrameEXP();
    };
    render();
}

// import React from 'react';
// import { View } from 'react-native';
// import { GLView } from 'expo-gl';

// export default function LigandScreen() {
//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <GLView style={{ width: 300, height: 300 }} onContextCreate={onContextCreate} />
//     </View>
//   );
// }

// function onContextCreate(gl) {
//   gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
//   gl.clearColor(0, 1, 1, 1);

//   // Create vertex shader (shape & position)
//   const vert = gl.createShader(gl.VERTEX_SHADER);
//   gl.shaderSource(
//     vert,
//     `
//     void main(void) {
//       gl_Position = vec4(0.0, 0.0, 0.0, 1.0);
//       gl_PointSize = 150.0;
//     }
//   `
//   );
//   gl.compileShader(vert);

//   // Create fragment shader (color)
//   const frag = gl.createShader(gl.FRAGMENT_SHADER);
//   gl.shaderSource(
//     frag,
//     `
//     void main(void) {
//       gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
//     }
//   `
//   );
//   gl.compileShader(frag);

//   // Link together into a program
//   const program = gl.createProgram();
//   gl.attachShader(program, vert);
//   gl.attachShader(program, frag);
//   gl.linkProgram(program);
//   gl.useProgram(program);

//   gl.clear(gl.COLOR_BUFFER_BIT);
//   gl.drawArrays(gl.POINTS, 0, 1);

//   gl.flush();
//   gl.endFrameEXP();
// }
