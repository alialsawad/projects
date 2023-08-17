import { Image } from 'components/Image';
import { useReducedMotion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import { render } from 'react-dom';
import {
  Clock,
  Color,
  LinearFilter,
  OrthographicCamera,
  Scene,
  ShaderMaterial,
  PlaneBufferGeometry,
  sRGBEncoding,
  WebGLRenderer,
  Mesh,
} from 'three';
import { resolveSrcFromSrcSet } from 'utils/image';
import { cleanRenderer, cleanScene, textureLoader } from 'utils/three';
import styles from './Slider.module.css';

const VERTEX = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
    `;

const FRAGMENT = ```
    varying vec2 vUv;

    uniform sampler2D texture1;
    uniform sampler2D texture2;
    uniform sampler2D disp;

    uniform float dispPower;
    uniform float intensity;

    uniform vec2 size;
    uniform vec2 res;

    vec2 backgroundCoverUv( vec2 screenSize, vec2 imageSize, vec2 uv ) {
      float screenRatio = screenSize.x / screenSize.y;
      float imageRatio = imageSize.x / imageSize.y;
      vec2 newSize = screenRatio < imageRatio 
          ? vec2(imageSize.x * (screenSize.y / imageSize.y), screenSize.y)
          : vec2(screenSize.x, imageSize.y * (screenSize.x / imageSize.x));
      vec2 newOffset = (screenRatio < imageRatio 
          ? vec2((newSize.x - screenSize.x) / 2.0, 0.0) 
          : vec2(0.0, (newSize.y - screenSize.y) / 2.0)) / newSize;
      return uv * screenSize / newSize + newOffset;
    }

    void main() {
      vec2 uv = vUv;
      
      vec4 disp = texture2D(disp, uv);
      vec2 dispVec = vec2(disp.x, disp.y);
      
      vec2 distPos1 = uv + (dispVec * intensity * dispPower);
      vec2 distPos2 = uv + (dispVec * -(intensity * (1.0 - dispPower)));
      
      vec4 _texture1 = texture2D(texture1, distPos1);
      vec4 _texture2 = texture2D(texture2, distPos2);
      
      gl_FragColor = mix(_texture1, _texture2, dispPower);
    }
    `;

function Slider() {
  const el = useRef();
  const inner = useRef();
  const imagePlane = useRef();
  const reduceMotion = useReducedMotion();
  const slides = useRef();
  const bullets = useRef();
  const renderer = useRef();
  const scene = useRef();
  const clock = useRef();
  const camera = useRef();
  const geometry = useRef();
  const [loaded, setLoaded] = useState(false);
  const material = useRef();
  const canvas = useRef();
  const [textures, setTextures] = useState();
  const images = useRef([
    'https://s3-us-west-2.amazonaws.com/s.cdpn.io/58281/bg1.jpg',
    'https://s3-us-west-2.amazonaws.com/s.cdpn.io/58281/bg2.jpg',
    'https://s3-us-west-2.amazonaws.com/s.cdpn.io/58281/bg3.jpg',
  ]);

  const data = useRef({
    current: 0,
    next: 1,
    total: images.current.length - 1,
    delta: 0,
  });

  const animating = useRef(false);

  useEffect(() => {
    el.current = document.querySelector('.js_slider');
    inner.current = el.current.querySelector('.js_slider__inner');
    slides.current = [...el.current.querySelectorAll('.js_slide')];
    bullets.current = [...el.current.querySelectorAll('.js_slider_bullet')];
  }, []);

  useEffect(() => {
    const sceneSetup = () => {
      scene.current = new Scene();
      clock.current = new Clock(true);

      renderer.current = new WebGLRenderer({
        canvas: canvas.current,
        antialias: false,
        alpha: true,
        powerPreference: 'high-performance',
        failIfMajorPerformanceCaveat: true,
      });
      renderer.current.setPixelRatio(1);
      renderer.current.setClearColor(0x111111, 1.0);
      renderer.current.setSize(window.innerWidth, window.innerHeight);
      renderer.current.domElement.style.width = '100%';
      renderer.current.domElement.style.height = 'auto';
      inner.current.appendChild(render.current.domElement);

      scene.current.background = new Color(0x111111);
    };

    const cameraSetup = () => {
      const cameraOptions = [
        el.current.offsetWidth / -2,
        el.current.offsetWidth / 2,
        el.current.offsetHeight / 2,
        el.current.offsetHeight / -2,
        1,
        1000,
      ];
      camera.current = new OrthographicCamera(...cameraOptions);
      camera.current.position.z = 1;
    };

    return () => {
      animating.current = false;
      cleanScene(scene.current);
      cleanRenderer(renderer.current);
    };
  }, [height, width]);

  useEffect(() => {
    let mounted = true;

    const loadImages = async () => {
      const anisotropy = renderer.current.capabilities.getMaxAnisotropy();

      const texturePromises = images.map(async image => {
        const imageSrc = image.srcSet ? await resolveSrcFromSrcSet(image) : image.src.src;
        const imageTexture = await textureLoader.loadAsync(imageSrc);
        await renderer.current.initTexture(imageTexture);
        imageTexture.encoding = sRGBEncoding;
        imageTexture.minFilter = LinearFilter;
        imageTexture.magFilter = LinearFilter;
        imageTexture.anisotropy = anisotropy;
        imageTexture.generateMipmaps = false;
        return imageTexture;
      });

      const textures = await Promise.all(texturePromises);

      // Cancel if the component has unmounted during async code
      if (!mounted) return;

      material.current = new ShaderMaterial({
        uniforms: {
          dispFactor: { type: 'f', value: 0 },
          direction: { type: 'f', value: 1 },
          currentImage: { type: 't', value: textures[0] },
          nextImage: { type: 't', value: textures[1] },
          reduceMotion: { type: 'b', value: reduceMotion },
        },
        vertexShader: VERTEX,
        fragmentShader: FRAGMENT,
        transparent: false,
        opacity: 1,
      });

      geometry.current = new PlaneBufferGeometry(
        window.innerWidth,
        window.innerHeight,
        1
      );
      imagePlane.current = new Mesh(geometry.current, material.current);
      imagePlane.current.position.set(0, 0, 0);
      scene.current.add(imagePlane.current);

      setLoaded(true);
      setTextures(textures);

      requestAnimationFrame(() => {
        renderer.current.render(scene.current, camera.current);
      });
    };

    if (!loaded) {
      loadImages();
    }

    return () => {
      mounted = false;
    };
  }, [window.innerHeight, images, loaded, reduceMotion]);
  return (
    <div className={styles.container}>
      <figure className={styles.logo}>
        <Image src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/58281/logo_copy_copy.svg" />
      </figure>

      <div className={`${styles.slider} js_slider`}>
        <div className={`${styles.slider__inner} js_slider__inner`}></div>

        <div className={`${styles.slide} js_slide`}>
          <div className={`${styles.slide__content}`}>
            <figure className={`${styles.slide__img} js_slide__img`}>
              <Image src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/58281/photo1.jpg" />
            </figure>
            <figure className={`${styles.slide__img} js_slide__img`}>
              <Image src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/58281/photo2.jpg" />
            </figure>
          </div>

          <div className={`${styles.slider__text} js_slider__text`}>
            <div className={`${styles.slider__text_line} js_slider__text_line`}>
              <div>Black is</div>
            </div>
            <div className={`${styles.slider__text_line} js_slider__text_line`}>
              <div>timeless. Black is</div>
            </div>
            <div className={`${styles.slider__text_line} js_slider__text_line`}>
              <div>the colour of</div>
            </div>
            <div className={`${styles.slider__text_line} js_slider__text_line`}>
              <div>Eternity.</div>
            </div>
          </div>
        </div>

        <div className={`${styles.slide} js_slide`}>
          <div className={styles.slide__content}>
            <figure className={`${styles.slide__img} js_slide__img`}>
              <Image src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/58281/photo3.jpg" />
            </figure>
            <figure className={`${styles.slide__img} js_slide__img`}>
              <Image src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/58281/photo4.jpg" />
            </figure>
          </div>
        </div>

        <div className={`${styles.slide} js_slide`}>
          <div className={styles.slide__content}>
            <figure className={`${styles.slide__img} js_slide__img`}>
              <Image src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/58281/photo5.jpg" />
            </figure>
            <figure className={`${styles.slide__img} js_slide__img`}>
              <Image src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/58281/photo6.jpg" />
            </figure>
          </div>
        </div>

        <nav className={`${styles.slider__nav} js_slider__nav`}>
          <div className={`${styles.slider_bullet} js_slider_bullet`}>
            <span className={`${styles.slider_bullet__text} js_slider_bullet__text`}>
              01
            </span>
            <span
              className={`${styles.slider_bullet__line} js_slider_bullet__line`}
            ></span>
          </div>
          <div className={`${styles.slider_bullet} js_slider_bullet`}>
            <span className={`${styles.slider_bullet__text} js_slider_bullet__text`}>
              02
            </span>
            <span
              className={`${styles.slider_bullet__line} js_slider_bullet__line`}
            ></span>
          </div>
          <div className={`${styles.slider_bullet} js_slider_bullet`}>
            <span className={`${styles.slider_bullet__text} js_slider_bullet__text`}>
              03
            </span>
            <span
              className={`${styles.slider_bullet__line} js_slider_bullet__line`}
            ></span>
          </div>
        </nav>

        <div className={`${styles.scroll} js_scroll`}>Scroll</div>
      </div>

      <div className={styles.vert_text}>
        <span>
          Wings+Horns
          <br />X Kyoto Black
        </span>
      </div>
    </div>
  );
}

export default Slider;
