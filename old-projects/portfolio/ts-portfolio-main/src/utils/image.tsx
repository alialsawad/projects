/**
 * Use the browser's image loading to load an image and
 * grab the `src` it chooses from a `srcSet`
 */
interface ImageProps {
  src?: string;
  srcSet: string;
  sizes: string;
}
export async function loadImageFromSrcSet({
  src,
  srcSet,
  sizes,
}: ImageProps): Promise<string> {
  return new Promise((resolve, reject) => {
    const srcSetString = srcSetToString(srcSet);

    try {
      if (!src && !srcSet) {
        throw new Error('No image src or srcSet provided');
      }

      let tempImage = new Image();

      if (src) {
        tempImage.src = src;
      }

      if (srcSetString) {
        tempImage.srcset = srcSetString;
      }

      if (sizes) {
        tempImage.sizes = sizes;
      }

      const onLoad = () => {
        tempImage.removeEventListener('load', onLoad);
        const source = tempImage.currentSrc;
        resolve(source);
      };

      tempImage.addEventListener('load', onLoad);
    } catch (error) {
      reject(`Error loading ${srcSetString}: ${error}`);
    }
  });
}

/**
 * Convert a `srcSet` array to a plain old `srcSet` string
 */
interface srcSetToString {
  (srcSet: string | [{ [key: string]: string | number }]): string;
}
export const srcSetToString: srcSetToString = srcSet => {
  if (typeof srcSet === 'string') {
    return srcSet;
  }

  return srcSet.map(item => `${item.src} ${item.width}w`).join(', ');
};

/**
 * Generates a transparent png of a given width and height
 */
interface transparentPng {
  width?: number;
  height?: number;
}
export async function generateImage(width = 1, height = 1): Promise<string> {
  return new Promise(resolve => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = width;
    canvas.height = height;
    if (ctx) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0)';
      ctx.fillRect(0, 0, width, height);
    }
    canvas.toBlob(async blob => {
      if (!blob) throw new Error('Video thumbnail failed to load');
      const image = URL.createObjectURL(blob);
      canvas.remove();
      resolve(image);
    });
  });
}

/**
 * Use native html image `srcSet` resolution for non-html images
 */
interface srcSetProps {
  srcSet: string | [{ [key: string]: string | number }];
  sizes: string;
}
export async function resolveSrcFromSrcSet({
  srcSet,
  sizes,
}: srcSetProps): Promise<string> {
  const stringSrcSet = srcSetToString(srcSet);

  const sources = await Promise.all(
    stringSrcSet.split(', ').map(async srcString => {
      const [src, width] = srcString.split(' ');
      const size = Number(width.replace('w', ''));
      const image = await generateImage(size);
      return { src, image, width };
    })
  );

  const fakeSrcSet = sources.map(({ image, width }) => `${image} ${width}`).join(', ');
  const fakeSrc = await loadImageFromSrcSet({ srcSet: fakeSrcSet, sizes });

  const output = sources.find(src => src.image === fakeSrc);

  if (!output) throw new Error('Could not resolve src from srcSet');
  return output.src;
}
