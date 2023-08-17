import { useTheme } from 'components/ThemeProvider';
import { Transition } from 'components/Transition';
import { useReducedMotion, useSpring } from 'framer-motion';
import { useInViewport, useWindowSize } from 'hooks';
import { useFps } from 'hooks/useFps';
import { startTransition, useEffect, useRef } from 'react';
import {
  AmbientLight,
  Color,
  DirectionalLight,
  Mesh,
  RawShaderMaterial,
  MeshPhongMaterial,
  PerspectiveCamera,
  Scene,
  PlaneGeometry,
  SphereBufferGeometry,
  Vector2,
  UniformsUtils,
  WebGLRenderer,
  sRGBEncoding,
  DodecahedronGeometry,
} from 'three';
import { media, rgbToThreeColor } from 'utils/style';
import { cleanRenderer, cleanScene, removeLights } from 'utils/three';
import styles from './GLSLHills.module.css';

import fragShader from './displacementSphereFragment.glsl';
import vertShader from './displacementSphereVertex.glsl';

const springConfig = {
  stiffness: 30,
  damping: 20,
  mass: 2,
};
export const GLSLHills = props => {
  const theme = useTheme();
  const { rgbBackground, themeId, colorWhite } = theme;
  const start = useRef(Date.now());
  const canvasRef = useRef();
  const renderer = useRef();
  const mouse = useRef();
  const sphere = useRef();
  const camera = useRef();
  const scene = useRef();
  const lights = useRef();
  const uniforms = useRef();
  const secondUniforms = useRef();
  const material = useRef();
  const secondMaterial = useRef();
  const geometry = useRef();
  const hills = useRef();
  const reduceMotion = useReducedMotion();
  const isInViewport = useInViewport(canvasRef);
  const windowSize = useWindowSize();
  const rotationX = useSpring(0, springConfig);
  const rotationY = useSpring(0, springConfig);
  const { measureFps, isLowFps } = useFps(isInViewport);

  useEffect(() => {
    const { innerWidth, innerHeight } = window;
    mouse.current = new Vector2(0.8, 0.5);
    renderer.current = new WebGLRenderer({
      canvas: canvasRef.current,
      antialias: false,
      alpha: true,
      powerPreference: 'high-performance',
      failIfMajorPerformanceCaveat: true,
    });
    renderer.current.setSize(innerWidth, innerHeight);
    renderer.current.setPixelRatio(1);
    renderer.current.outputEncoding = sRGBEncoding;

    camera.current = new PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    camera.current.position.set(0, 10, 180);

    scene.current = new Scene();

    secondMaterial.current = new MeshPhongMaterial();
    secondMaterial.current.onBeforeCompile = shader => {
      secondUniforms.current = UniformsUtils.merge([
        shader.uniforms,
        { time: { type: 'f', value: 0 } },
      ]);
      shader.uniforms = secondUniforms.current;
      shader.vertexShader = vertShader;
      shader.fragmentShader = fragShader;
    };
    startTransition(() => {
      geometry.current = new DodecahedronGeometry(20, 4);
      sphere.current = new Mesh(geometry.current, secondMaterial.current);
      sphere.current.position.z = 10;
      sphere.current.modifier = Math.random();
      scene.current.add(sphere.current);
    });

    material.current = new RawShaderMaterial();
    material.current.transparent = true;
    material.current.onBeforeCompile = shader => {
      uniforms.current = UniformsUtils.merge([
        shader.uniforms,
        { time: { type: 'f', value: 0 } },
      ]);

      shader.uniforms = uniforms.current;
      shader.vertexShader =
        '#define GLSLIFY 1\nattribute vec3 position;\n\nuniform mat4 projectionMatrix;\nuniform mat4 modelViewMatrix;\nuniform float time;\n\nvarying vec3 vPosition;\n\nmat4 rotateMatrixX(float radian) {\n  return mat4(\n    1.0, 0.0, 0.0, 0.0,\n    0.0, cos(radian), -sin(radian), 0.0,\n    0.0, sin(radian), cos(radian), 0.0,\n    0.0, 0.0, 0.0, 1.0\n  );\n}\n\n//\n// GLSL textureless classic 3D noise "cnoise",\n// with an RSL-style periodic variant "pnoise".\n// Author:  Stefan Gustavson (stefan.gustavson@liu.se)\n// Version: 2011-10-11\n//\n// Many thanks to Ian McEwan of Ashima Arts for the\n// ideas for permutation and gradient selection.\n//\n// Copyright (c) 2011 Stefan Gustavson. All rights reserved.\n// Distributed under the MIT license. See LICENSE file.\n// https://github.com/ashima/webgl-noise\n//\n\nvec3 mod289(vec3 x)\n{\n  return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\n\nvec4 mod289(vec4 x)\n{\n  return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\n\nvec4 permute(vec4 x)\n{\n  return mod289(((x*34.0)+1.0)*x);\n}\n\nvec4 taylorInvSqrt(vec4 r)\n{\n  return 1.79284291400159 - 0.85373472095314 * r;\n}\n\nvec3 fade(vec3 t) {\n  return t*t*t*(t*(t*6.0-15.0)+10.0);\n}\n\n// Classic Perlin noise\nfloat cnoise(vec3 P)\n{\n  vec3 Pi0 = floor(P); // Integer part for indexing\n  vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1\n  Pi0 = mod289(Pi0);\n  Pi1 = mod289(Pi1);\n  vec3 Pf0 = fract(P); // Fractional part for interpolation\n  vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0\n  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);\n  vec4 iy = vec4(Pi0.yy, Pi1.yy);\n  vec4 iz0 = Pi0.zzzz;\n  vec4 iz1 = Pi1.zzzz;\n\n  vec4 ixy = permute(permute(ix) + iy);\n  vec4 ixy0 = permute(ixy + iz0);\n  vec4 ixy1 = permute(ixy + iz1);\n\n  vec4 gx0 = ixy0 * (1.0 / 7.0);\n  vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;\n  gx0 = fract(gx0);\n  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);\n  vec4 sz0 = step(gz0, vec4(0.0));\n  gx0 -= sz0 * (step(0.0, gx0) - 0.5);\n  gy0 -= sz0 * (step(0.0, gy0) - 0.5);\n\n  vec4 gx1 = ixy1 * (1.0 / 7.0);\n  vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;\n  gx1 = fract(gx1);\n  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);\n  vec4 sz1 = step(gz1, vec4(0.0));\n  gx1 -= sz1 * (step(0.0, gx1) - 0.5);\n  gy1 -= sz1 * (step(0.0, gy1) - 0.5);\n\n  vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);\n  vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);\n  vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);\n  vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);\n  vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);\n  vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);\n  vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);\n  vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);\n\n  vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));\n  g000 *= norm0.x;\n  g010 *= norm0.y;\n  g100 *= norm0.z;\n  g110 *= norm0.w;\n  vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));\n  g001 *= norm1.x;\n  g011 *= norm1.y;\n  g101 *= norm1.z;\n  g111 *= norm1.w;\n\n  float n000 = dot(g000, Pf0);\n  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));\n  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));\n  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));\n  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));\n  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));\n  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));\n  float n111 = dot(g111, Pf1);\n\n  vec3 fade_xyz = fade(Pf0);\n  vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);\n  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);\n  float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);\n  return 2.2 * n_xyz;\n}\n\nvoid main(void) {\n  vec3 updatePosition = (rotateMatrixX(radians(90.0)) * vec4(position, 1.0)).xyz;\n  float sin1 = sin(radians(updatePosition.x / 128.0 * 90.0));\n  vec3 noisePosition = updatePosition + vec3(0.0, 0.0, time * -30.0);\n  float noise1 = cnoise(noisePosition * 0.08);\n  float noise2 = cnoise(noisePosition * 0.06);\n  float noise3 = cnoise(noisePosition * 0.4);\n  vec3 lastPosition = updatePosition + vec3(0.0,\n    noise1 * sin1 * 8.0\n    + noise2 * sin1 * 8.0\n    + noise3 * (abs(sin1) * 2.0 + 0.5)\n    + pow(sin1, 2.0) * 40.0, 0.0);\n\n  vPosition = lastPosition;\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(lastPosition, 1.0);\n}\n';
      shader.fragmentShader =
        'precision highp float;\n#define GLSLIFY 1\n\nvarying vec3 vPosition;\n\nvoid main(void) {\n  float opacity = (96.0 - length(vPosition)) / 190.0 * 0.6;\n  vec3 color = vec3(0.6);\n  gl_FragColor = vec4(color, opacity);\n}\n';
    };

    startTransition(() => {
      geometry.current = new PlaneGeometry(256, 256, 256, 256);
      hills.current = new Mesh(geometry.current, material.current);
      hills.current.modifier = Math.random();
      scene.current.add(hills.current);
    });

    return () => {
      cleanScene(scene.current);
      cleanRenderer(renderer.current);
    };
  }, []);

  useEffect(() => {
    const dirLight = new DirectionalLight(colorWhite, 0.5);
    const ambientLight = new AmbientLight(colorWhite, themeId === 'light' ? 0.8 : 0.3);
    dirLight.position.z = 250;
    dirLight.position.x = 100;
    dirLight.position.y = 100;

    lights.current = [dirLight, ambientLight];
    scene.current.background = new Color(...rgbToThreeColor(rgbBackground));
    lights.current.forEach(light => scene.current.add(light));

    return () => {
      removeLights(lights.current);
    };
  }, [rgbBackground, colorWhite, themeId]);

  useEffect(() => {
    const { width, height } = windowSize;

    const adjustedHeight = height + height * 0.3;
    renderer.current.setSize(width, adjustedHeight);
    camera.current.aspect = width / adjustedHeight;
    camera.current.updateProjectionMatrix();
    // Render a single frame on resize when not animating
    if (reduceMotion) {
      renderer.current.render(scene.current, camera.current);
    }

    if (width <= media.mobile) {
      hills.current.position.x = 0;
      hills.current.position.y = -39.5;
      sphere.current.position.x = 14;
      sphere.current.position.y = 10;
    } else if (width <= media.tablet) {
      hills.current.position.x = 0;
      hills.current.position.y = -39.5;
      sphere.current.position.x = 18;
      sphere.current.position.y = 14;
    } else {
      hills.current.position.x = 0;
      hills.current.position.y = -39.5;
    }
  }, [reduceMotion, windowSize]);

  useEffect(() => {
    const onMouseMove = event => {
      const position = {
        x: event.clientX / window.innerWidth,
        y: event.clientY / window.innerHeight,
      };
      rotationX.set(position.y / 1.3);
      rotationY.set(position.x / 1.3);
    };

    if (!reduceMotion && isInViewport) {
      window.addEventListener('mousemove', onMouseMove);
    }

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, [isInViewport, reduceMotion, rotationX, rotationY]);

  useEffect(() => {
    let animation;

    const animate = () => {
      animation = requestAnimationFrame(animate);

      if (uniforms.current !== undefined) {
        uniforms.current.time.value = 0.0008 * (Date.now() - start.current);
      }
      if (secondUniforms.current !== undefined) {
        secondUniforms.current.time.value = 0.00005 * (Date.now() - start.current);
      }
      sphere.current.rotation.x = rotationX.get();
      sphere.current.rotation.y = rotationY.get();
      const angle = secondUniforms.current.time.value * 13;
      sphere.current.position.z = Math.sin(angle) * 9;
      sphere.current.position.y = Math.sin(angle * 2) + 36;
      sphere.current.position.x = Math.cos(angle) * 3 + 22;
      renderer.current.render(scene.current, camera.current);

      measureFps();

      if (isLowFps.current) {
        renderer.current.setPixelRatio(0.5);
      } else {
        renderer.current.setPixelRatio(1);
      }
    };

    if (!reduceMotion && isInViewport) {
      animate();
    } else {
      renderer.current.render(scene.current, camera.current);
    }

    return () => {
      cancelAnimationFrame(animation);
    };
  }, [isInViewport, measureFps, reduceMotion, isLowFps, rotationX, rotationY]);

  return (
    <Transition in timeout={3000}>
      {visible => (
        <canvas
          aria-hidden
          className={styles.canvas}
          data-visible={visible}
          ref={canvasRef}
          {...props}
        />
      )}
    </Transition>
  );
};
