import React, { useRef, Suspense } from "react";
import { Canvas, extend, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import "./styles.css";

extend({ OrbitControls });
// Geometry
function GroundPlane() {
  const colorMap = useTexture("/textures/grass/color.jpg", (texture) => {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.x = 8;
    texture.repeat.y = 8;
  });
  const aoMap = useTexture(
    "/textures/grass/ambientOcclusion.jpg",
    (texture) => {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.x = 8;
      texture.repeat.y = 8;
    }
  );
  const normalMap = useTexture("/textures/grass/normal.jpg", (texture) => {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.x = 8;
    texture.repeat.y = 8;
  });
  const roughnessMap = useTexture(
    "/textures/grass/roughness.jpg",
    (texture) => {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.x = 8;
      texture.repeat.y = 8;
    }
  );

  return (
    <mesh rotation={[-Math.PI * 0.5, 0, 0]} position={[0, 0, 0]}>
      <planeBufferGeometry attach="geometry" args={[20, 20]} />
      <meshStandardMaterial
        attach="material"
        map={colorMap}
        normalMap={normalMap}
        roughnessMap={roughnessMap}
        aoMap={aoMap}
      />
    </mesh>
  );
}

function Bushes() {
  const params = [
    {
      position: [0.8, 0.2, 2.2],
      args: [0.5, 64, 32],
    },
    {
      position: [1.4, 0.1, 2.1],
      args: [0.25, 64, 32],
    },
    {
      position: [-0.8, 0.2, 2.2],
      args: [0.4, 64, 32],
    },
    {
      position: [-1, 0.05, 2.6],
      args: [0.15, 64, 32],
    },
  ];
  return (
    <>
      {params.map((param) => (
        <mesh position={param.position}>
          <sphereBufferGeometry attach="geometry" args={param.args} />
          <meshStandardMaterial attach="material" color="#89c854" />
        </mesh>
      ))}
    </>
  );
}

function Graves() {
  const createAngle = () => {
    const createdAngles = [];
    for (let i = 0; i < 50; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 5 + Math.random() * 4;
      const x = Math.sin(angle) * radius;
      const z = Math.cos(angle) * radius;
      createdAngles.push([x, 0.3, z]);
    }
    return createdAngles;
  };
  const graves = createAngle().map((cords, i) => (
    <mesh
      key={i}
      position={cords}
      rotation-y={(Math.random() - 0.5) * 0.4}
      rotation-z={(Math.random() - 0.5) * 0.4}
    >
      <boxBufferGeometry attach="geometry" args={[0.6, 0.8, 0.2]} />
      <meshStandardMaterial attach="material" color="#b2b6b1" />
    </mesh>
  ));
  return <group>{graves}</group>;
}

function Ghosts() {
  const ghostOne = useRef();
  useFrame(({ clock }) => {
    let timeVariable = clock.getElapsedTime();
    ghostOne.current.position.x = Math.cos(timeVariable) * 6;
    ghostOne.current.position.z = Math.sin(timeVariable) * 7;
    ghostOne.current.position.y = Math.sin(timeVariable * 0.1);
  });

  const ghostTwo = useRef();
  useFrame(({ clock }) => {
    let timeVariable = clock.getElapsedTime() * 0.9;
    ghostTwo.current.position.x =
      Math.cos(timeVariable) * (7 + Math.sin(timeVariable * 0.52));
    ghostTwo.current.position.z =
      Math.sin(timeVariable) * (7 + Math.sin(timeVariable * 0.52));
    ghostTwo.current.position.y =
      Math.sin(timeVariable * 4) + Math.sin(timeVariable * 2.5);
  });
  return (
    <>
      <pointLight ref={ghostOne} color="#ff00ff" intensity={3} distance={3} />
      <pointLight ref={ghostTwo} color="#ffffff" intensity={3} distance={3} />
    </>
  );
}

function Scene() {
  const doorTextures = useTexture({
    map: "/textures/door/color.jpg",
    alphaMap: "/textures/door/alpha.jpg",
    aoMap: "/textures/door/ambientOcclusion.jpg",
    displacementMap: "/textures/door/height.jpg",
    normalMap: "/textures/door/normal.jpg",
    metalnessMap: "/textures/door/metalness.jpg",
    roughnessMap: "/textures/door/roughness.jpg",
  });
  const wallTextures = useTexture({
    map: "/textures/bricks/color.jpg",
    aoMap: "/textures/bricks/ambientOcclusion.jpg",
    normalMap: "/textures/bricks/normal.jpg",
    roughnessMap: "/textures/bricks/roughness.jpg",
  });

  return (
    <>
      <Ghosts />
      <group>
        <pointLight
          camera={{ far: 15 }}
          color="#ff7d46"
          position={[-0.8, 2.2, 2.8]}
          intensity={0.5}
          distance={7}
        />
        <mesh visible position={[0, 2.5 / 2, 0]}>
          <boxBufferGeometry attach="geometry" args={[4, 2.5, 4]} />
          <meshStandardMaterial
            {...wallTextures}
            attach="material"
            transparent
          />
        </mesh>
        <mesh visible position={[0, 2.5 + 0.5, 0]} rotation-y={Math.PI / 4}>
          <coneBufferGeometry attach="geometry" args={[3.5, 1, 4]} />
          <meshStandardMaterial attach="material" color="#b35f45" transparent />
        </mesh>
        <mesh position={[0, 1, 2 + 0.01]}>
          <planeBufferGeometry attach="geometry" args={[2.2, 2.2, 100, 100]} />

          <meshStandardMaterial
            displacementScale={0.1}
            {...doorTextures}
            attach="material"
            transparent
          />
        </mesh>
        <Bushes />
      </group>
      <Graves />
    </>
  );
}

const CameraControls = () => {
  const {
    camera,
    gl: { domElement },
  } = useThree();

  // Ref to the controls, so that we can update them on every frame using useFrame
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

function App() {
  return (
    <Canvas camera={{ fov: 75, near: 0.1, far: 100, position: [4, 2, 5] }}>
      <color attach="background" args={["#22837"]} />
      <fog attach="fog" args={["#22837", 1, 15]} />
      <CameraControls />

      <directionalLight
        intensity={0.11}
        position={[4, 6, -2]}
        color="white"
        camera={{ far: 15 }}
      />
      <Suspense fallback={null}>
        <ambientLight intensity={0.01} color="#b9d5ff" />
        <GroundPlane />
        <Scene />
      </Suspense>
    </Canvas>
  );
}

export default App;
