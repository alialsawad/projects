import { useRef } from "react";
import * as THREE from "three";
import { Canvas, extend, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

extend({ OrbitControls });

function App() {
  return (
    <Canvas camera={{ fov: 75, near: 0.1, far: 100, position: [0, 20, 20] }}>
      <color attach="background" args={["black"]} />
      <CameraControls />
      <Scene />
    </Canvas>
  );
}

function Star(props) {
  const matRef = useRef();
  const positions = props.positionInfo;
  const colors = props.colorInfo;
  const scales = props.scaleInfo;
  const randomness = props.randomnessInfo;
  useFrame(({ clock }) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime = { value: clock.getElapsedTime() };
    }
  });
  return (
    <points>
      <bufferGeometry attach="geometry">
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
          usage={THREE.DynamicDrawUsage}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
          usage={THREE.DynamicDrawUsage}
        />
        <bufferAttribute
          attach="attributes-aScale"
          count={scales.length}
          array={scales}
          itemSize={1}
          usage={THREE.DynamicDrawUsage}
        />
        <bufferAttribute
          attach="attributes-aRandomness"
          count={randomness.length}
          array={randomness}
          itemSize={3}
          usage={THREE.DynamicDrawUsage}
        />
      </bufferGeometry>
      <shaderMaterial
        attach="material"
        vertexColors
        ref={matRef}
        blending={THREE.AdditiveBlending}
        depthWrite="false"
        vertexShader={`
      uniform float uSize;
      uniform float uTime;
      attribute float aScale;
      attribute vec3 aRandomness;
      varying vec3 vColor;
      void main() {
        vec4 modelPosition = modelMatrix * vec4(position, 1.0);
        float angle = atan(modelPosition.x, modelPosition.z);
        float distanceToCenter = length(modelPosition.xz);
        float angleOffset = (1.0 / distanceToCenter) * uTime * 30.0;
        angle += angleOffset;
        modelPosition.x = cos(angle) * distanceToCenter;
        modelPosition.z = sin(angle) * distanceToCenter;
        modelPosition.xyz += aRandomness;
        vec4 viewPosition = viewMatrix * modelPosition;
        vec4 projectedPosition = projectionMatrix * viewPosition;
        gl_Position = projectedPosition;
        gl_PointSize = uSize * aScale;
        gl_PointSize *= (1.0 / - viewPosition.z);

        vColor = color;
      }
        `}
        fragmentShader={`
        varying vec3 vColor;
        void main()
        {
          float strength = distance(gl_PointCoord, vec2(0.5));
          strength = 1.0 - strength;
          strength = pow(strength, 10.0);
          vec3 color = mix(vec3(0.0), vColor, strength);
          gl_FragColor = vec4(color, 1.0);
        }
        `}
        uniforms={{
          uSize: { value: 100.0 * Math.min(window.devicePixelRatio, 2) },
          uTime: { value: 0 },
        }}
      />
    </points>
  );
}
function paramsRandomizer(parameters, positions, colors, scales, randomness) {
  const insideColor = new THREE.Color(parameters.insideColor);
  const outsideColor = new THREE.Color(parameters.outsideColor);
  for (let i = 0; i < parameters.count; i++) {
    const i3 = i * 3;
    const radius = Math.random() * parameters.radius;
    const branchAngle =
      ((i % parameters.branches) / parameters.branches) * Math.PI * 2;
    const randomX =
      Math.pow(Math.random(), parameters.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1) *
      parameters.randomness *
      radius;
    const randomY =
      Math.pow(Math.random(), parameters.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1) *
      parameters.randomness *
      radius;
    const randomZ =
      Math.pow(Math.random(), parameters.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1) *
      parameters.randomness *
      radius;

    positions[i3] = Math.cos(branchAngle) * radius;
    positions[i3 + 1] = 0;
    positions[i3 + 2] = Math.sin(branchAngle) * radius;

    randomness[i3] = randomX;
    randomness[i3 + 1] = randomY;
    randomness[i3 + 2] = randomZ;

    const mixedColor = insideColor.clone();
    mixedColor.lerp(outsideColor, radius / parameters.radius);

    colors[i3] = mixedColor.r;
    colors[i3 + 1] = mixedColor.g;
    colors[i3 + 2] = mixedColor.b;

    scales[i] = Math.random();
  }
  return [positions, colors, scales, randomness];
}
function GeneratedGalaxy() {
  const parameters = {};
  parameters.count = 200000;
  parameters.radius = 20;
  parameters.branches = 3;
  parameters.randomness = 0.5;
  parameters.randomnessPower = 3;
  parameters.insideColor = "hotpink";
  parameters.outsideColor = "blue";

  const positions = new Float32Array(parameters.count * 3);
  const colors = new Float32Array(parameters.count * 3);
  const scales = new Float32Array(parameters.count);
  const randomness = new Float32Array(parameters.count * 3);

  const [positionInfo, colorInfo, scaleInfo, randomnessInfo] = paramsRandomizer(
    parameters,
    positions,
    colors,
    scales,
    randomness
  );

  return (
    <>
      <Star
        positionInfo={positionInfo}
        colorInfo={colorInfo}
        scaleInfo={scaleInfo}
        randomnessInfo={randomnessInfo}
        parameters={parameters}
      />
    </>
  );
}

function Scene() {
  return <GeneratedGalaxy />;
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

export default App;
