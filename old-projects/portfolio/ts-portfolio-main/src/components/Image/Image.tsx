import { Button } from 'components/Button';
import { Icon } from 'components/Icon';
import { useTheme } from 'components/ThemeProvider';
import { useReducedMotion } from 'framer-motion';
import { useHasMounted, useInViewport } from 'hooks';
import {
  ChangeEvent,
  Fragment,
  FunctionComponent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { resolveSrcFromSrcSet, srcSetToString } from 'utils/image';
import { classes, cssProps, numToMs } from 'utils/style';
import styles from './Image.module.css';

interface Image {
  [x: string]: any;
  className?: string;
  style?: { [key: string]: string | number };
  reveal?: boolean;
  delay?: number;
  raised?: boolean;
  src?: { [key: string]: string };
  srcSet?: string;
  placeholder?: {
    src: string;
    width: string;
    height: string;
  };
  alt?: string;
  role?: string;
}

export const Image: FunctionComponent<Image> = ({
  className = '',
  style,
  reveal,
  delay = 0,
  raised,
  src: baseSrc = { src: '' },
  srcSet,
  placeholder,
  alt,
  role,
  ...rest
}) => {
  const [loaded, setLoaded] = useState(false);
  const { themeId } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const src = baseSrc || srcSet?.[0];
  const inViewport: boolean = useInViewport(
    containerRef,
    !getIsVideo(src as { [key: string]: string })
  );

  const onLoad = useCallback(() => {
    setLoaded(true);
  }, []);

  return (
    <div
      className={classes(styles.image, className)}
      data-visible={inViewport || loaded}
      data-reveal={reveal}
      data-raised={raised}
      data-theme={themeId}
      style={cssProps({ delay: numToMs(delay) }, style)}
      ref={containerRef}
    >
      <ImageElements
        delay={delay}
        onLoad={onLoad}
        loaded={loaded}
        inViewport={inViewport}
        reveal={reveal}
        src={src}
        srcSet={srcSet}
        placeholder={placeholder}
        {...rest}
        alt={alt}
      />
    </div>
  );
};

const ImageElements: FunctionComponent<Image> = ({
  onLoad,
  loaded,
  inViewport,
  srcSet = '',
  placeholder = { src: '', width: '', height: '' },
  delay = 0,
  src = {
    src: '',
  },
  alt,
  play = true,
  restartOnPause,
  reveal,
  sizes,
  noPauseButton,
  ...rest
}) => {
  const reduceMotion = useReducedMotion();
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  const [playing, setPlaying] = useState(!reduceMotion);
  const [videoSrc, setVideoSrc] = useState('');
  const [videoInteracted, setVideoInteracted] = useState(false);
  const placeholderRef = useRef<HTMLImageElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isVideo = getIsVideo(src);
  const showFullRes = inViewport;
  const srcSetString = srcSetToString(srcSet);
  const hasMounted = useHasMounted();

  useEffect(() => {
    const resolveVideoSrc = async () => {
      const resolvedVideoSrc = await resolveSrcFromSrcSet({ srcSet, sizes });
      setVideoSrc(resolvedVideoSrc);
    };

    if (isVideo && srcSet) {
      resolveVideoSrc();
    } else if (isVideo) {
      setVideoSrc(src.src);
    }
  }, [isVideo, sizes, src, srcSet]);

  useEffect(() => {
    if (!videoRef.current || !videoSrc) return;

    const playVideo = () => {
      setPlaying(true);
      videoRef.current?.play();
    };

    const pauseVideo = () => {
      setPlaying(false);
      videoRef.current?.pause();
    };

    if (!play) {
      pauseVideo();

      if (restartOnPause) {
        videoRef.current.currentTime = 0;
      }
    }

    if (videoInteracted) return;

    if (!inViewport) {
      pauseVideo();
    } else if (inViewport && !reduceMotion && play) {
      playVideo();
    }
  }, [inViewport, play, reduceMotion, restartOnPause, videoInteracted, videoSrc]);

  const togglePlaying = (event: ChangeEvent<HTMLButtonElement>) => {
    event.preventDefault();

    setVideoInteracted(true);

    if (videoRef.current?.paused) {
      setPlaying(true);
      videoRef.current.play();
    } else {
      setPlaying(false);
      videoRef.current?.pause();
    }
  };

  return (
    <div
      className={styles.elementWrapper}
      data-reveal={reveal}
      data-visible={inViewport || loaded}
      style={cssProps({ delay: numToMs(delay + 1000) })}
    >
      {isVideo && hasMounted && (
        <Fragment>
          <video
            muted
            loop
            playsInline
            className={styles.element}
            data-loaded={loaded}
            autoPlay={!reduceMotion}
            role="img"
            onLoadStart={onLoad}
            src={videoSrc}
            aria-label={alt}
            ref={videoRef}
            {...rest}
          />
          {!noPauseButton && (
            <Button className={styles.button} onClick={togglePlaying}>
              <Icon icon={playing ? 'pause' : 'play'} />
              {playing ? 'Pause' : 'Play'}
            </Button>
          )}
        </Fragment>
      )}
      {!isVideo && (
        <img
          className={styles.element}
          data-loaded={loaded}
          onLoad={onLoad}
          decoding="async"
          src={showFullRes ? src.src : undefined}
          srcSet={showFullRes ? srcSetString : undefined}
          width={src.width}
          height={src.height}
          alt={alt}
          sizes={sizes}
          {...rest}
        />
      )}
      {showPlaceholder && (
        <img
          aria-hidden
          className={styles.placeholder}
          data-loaded={loaded}
          style={cssProps({ delay: numToMs(delay) })}
          ref={placeholderRef}
          src={placeholder.src}
          width={placeholder.width}
          height={placeholder.height}
          onTransitionEnd={() => setShowPlaceholder(false)}
          decoding="async"
          alt=""
          role="presentation"
        />
      )}
    </div>
  );
};

function getIsVideo(src: { [key: string]: string }) {
  return typeof src.src === 'string' && src.src.endsWith('.mp4');
}
