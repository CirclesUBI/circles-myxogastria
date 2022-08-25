import Compress from 'compress.js';

export default function compressImage(files) {
  const compress = new Compress();

  return new Promise((resolve, reject) => {
    compress
      .compress(files, {
        size: 1, // the max size in MB, defaults to 2MB
        quality: 1, // the quality of the image, max is 1,
        maxWidth: 300, // the max width of the output image, defaults to 1920px
        maxHeight: 300, // the max height of the output image, defaults to 1920px
        resize: true, // defaults to true, set false if you do not want to resize the image width and height
        rotate: false,
      })
      .then((results) => {
        const img1 = results[0];
        const base64str = img1.data;
        const imgExt = img1.ext;
        const file = Compress.convertBase64ToFile(base64str, imgExt);
        resolve(file);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
