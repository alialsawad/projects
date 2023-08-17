import React, { useRef, Suspense } from "react";
import { Canvas, extend, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

extend({ OrbitControls });
// const colorMap = useTexture("/textures/grass/color.jpg", (texture) => {
//   texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
//   texture.repeat.x = 8;
//   texture.repeat.y = 8;
// });
// const doorTextures = useTexture({
//   map: "/textures/door/color.jpg",
//   alphaMap: "/textures/door/alpha.jpg",
//   aoMap: "/textures/door/ambientOcclusion.jpg",
//   displacementMap: "/textures/door/height.jpg",
//   normalMap: "/textures/door/normal.jpg",
//   metalnessMap: "/textures/door/metalness.jpg",
//   roughnessMap: "/textures/door/roughness.jpg",
// });

/* <mesh visible position={[0, 2.5 / 2, 0]}>
          <boxBufferGeometry attach="geometry" args={[4, 2.5, 4]} />
          <meshStandardMaterial
            {...wallTextures}
            attach="material"
            transparent
          />
        </mesh> */

function App() {
  return (
    <Canvas camera={{ fov: 75, near: 0.1, far: 100, position: [0, 5, 20] }}>
      <color attach="background" args={["black"]} />
      <CameraControls />

      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </Canvas>
  );
}

function Scene() {
  const pointTexture = useTexture({
    alphaMap: "/particles/2.png",
  });
  const count = 50000;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const [PositionsInfo, colorsInfo] = generatePoints(positions, colors);
  return (
    <points>
      <bufferGeometry attach="geometry">
        <bufferAttribute
          attach="attributes-position"
          count={PositionsInfo.length / 3}
          array={PositionsInfo}
          itemSize={3}
          usage={THREE.DynamicDrawUsage}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colorsInfo.length / 3}
          array={colorsInfo}
          itemSize={3}
          usage={THREE.DynamicDrawUsage}
        />
      </bufferGeometry>

      <pointsMaterial
        {...pointTexture}
        attach="material"
        size={0.1}
        transparent
        vertexColors
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

const generatePoints = (positions, colors) => {
  for (let i = 0; i <= positions.length; i++) {
    positions[i] = (Math.random() - 0.5) * 10;
    colors[i] = Math.random();
  }
  return [positions, colors];
};

const CameraControls = () => {
  const {
    camera,
    gl: { domElement },
  } = useThree();

  const controls = useRef();
  useFrame((state) => controls.current.update());
  return (
    <orbitControls
      ref={controls}
      args={[camera, domElement]}
      enableZoom={true}
      maxAzimuthAngle={Math.PI * 4}
      maxPolarAngle={Math.PI * 4}
      minAzimuthAngle={-Math.PI * 4}
      minPolarAngle={0}
    />
  );
};
export default App;
