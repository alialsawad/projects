import React, { useRef, Suspense, useState } from "react";
import { Canvas, extend, useFrame, useThree } from "@react-three/fiber";
import {
  Plane,
  useTexture,
  Html,
  OrbitControls,
  Box,
  BBAnchor,
} from "@react-three/drei";
import { useSpring } from "@react-spring/core";
import { a } from "@react-spring/three";

import * as THREE from "three";

import "./styles.css";

// Geometry

function App() {
  const ref = useRef();
  return (
    <Canvas camera={{ fov: 75, near: 0.1, far: 100, position: [4, 2, 5] }}>
      <color attach="background" args={["red"]} />

      <directionalLight
        intensity={0.11}
        position={[4, 6, -2]}
        color="white"
        camera={{ far: 15 }}
      />
      <Suspense fallback={null}>
        <ambientLight intensity={0.01} color="#b9d5ff" />
        <Plate />
      </Suspense>
      <OrbitControls ref={ref} />
    </Canvas>
  );
}
function Plate() {
  const domnodeRef = useRef();
  return (
    <>
      <mesh position={[0, 0, 0]}>
        <boxBufferGeometry args={[10, 10, 1]} />
        <meshBasicMaterial ref={domnodeRef} side={THREE.DoubleSide} />
        <BBAnchor anchor={[0, 0, 1.01]}>
          <Html transform occlude>
            <span>Hello world!</span>
          </Html>
        </BBAnchor>
      </mesh>
    </>
  );
}

function Content() {
  return <div>Hello World!</div>;
}
export default App;
