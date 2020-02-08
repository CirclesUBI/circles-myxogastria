import QrScannerWorker from '~/services/qr-scanner.worker.js';

const DEFAULT_CANVAS_SIZE = 400;
const TIMEOUT = 3000;

export async function hasCamera() {
  if (!('mediaDevices' in navigator)) {
    return false;
  }

  return navigator.mediaDevices
    .enumerateDevices()
    .then(devices => devices.some(device => device.kind === 'videoinput'))
    .catch(() => false);
}

export default class QrScanner {
  constructor(video, onDecode, canvasSize = DEFAULT_CANVAS_SIZE) {
    this.$video = video;
    this.$canvas = document.createElement('canvas');

    this.onDecode = onDecode;
    this.isActive = false;
    this.isPaused = false;

    this.$canvas.width = canvasSize;
    this.$canvas.height = canvasSize;

    this.sourceRect = {
      x: 0,
      y: 0,
      width: canvasSize,
      height: canvasSize,
    };

    this.onCanPlay = this.onCanPlay.bind(this);
    this.onPlay = this.onPlay.bind(this);
    this.onVisibilityChange = this.onVisibilityChange.bind(this);

    this.$video.addEventListener('canplay', this.onCanPlay);
    this.$video.addEventListener('play', this.onPlay);

    document.addEventListener('visibilitychange', this.onVisibilityChange);

    this.worker = new QrScannerWorker();
  }

  destroy() {
    this.$video.removeEventListener('canplay', this.onCanPlay);
    this.$video.removeEventListener('play', this.onPlay);

    document.removeEventListener('visibilitychange', this.onVisibilityChange);

    this.stop();

    this.worker.postMessage({
      type: 'close',
    });
  }

  async start() {
    if (this.isActive && !this.isPaused) {
      return;
    }

    this.isActive = true;
    this.isPaused = false;

    if (document.hidden) {
      // Camera will be started as soon as tab is in foreground
      return;
    }

    clearTimeout(this.offTimeout);
    this.offTimeout = null;

    if (this.$video.srcObject) {
      // Camera stream already/still set
      this.$video.play();
      return;
    }

    let facingMode = 'environment';

    return this.getCameraStream('environment', true)
      .catch(() => {
        // We (probably) don't have an environment camera
        facingMode = 'user';
        return this.getCameraStream(); // throws if camera is not accessible (e.g. due to not https)
      })
      .then(stream => {
        this.$video.srcObject = stream;
        this.setVideoMirror(facingMode);
      })
      .catch(err => {
        this.isActive = false;
        throw err;
      });
  }

  stop() {
    this.pause();
    this.isActive = false;
  }

  pause() {
    this.isPaused = true;

    if (!this.isActive) {
      return;
    }

    this.$video.pause();

    if (this.offTimeout) {
      return;
    }

    this.offTimeout = window.setTimeout(() => {
      const track =
        this.$video.srcObject && this.$video.srcObject.getTracks()[0];

      if (!track) {
        return;
      }

      track.stop();

      this.$video.srcObject = null;
      this.offTimeout = null;
    }, 300);
  }

  static scanImage(
    imageOrFileOrUrl,
    sourceRect = null,
    worker = null,
    canvas = null,
    fixedCanvasSize = false,
    alsoTryWithoutSourceRect = true,
  ) {
    let createdNewWorker = false;

    let promise = new Promise((resolve, reject) => {
      if (!worker) {
        worker = new QrScannerWorker();

        createdNewWorker = true;

        // scan inverted color qr codes too
        worker.postMessage({
          type: 'inversionMode',
          data: 'both',
        });
      }

      let timeout, onMessage, onError;

      onMessage = event => {
        if (event.data.type !== 'qrResult') {
          return;
        }

        worker.removeEventListener('message', onMessage);
        worker.removeEventListener('error', onError);

        clearTimeout(timeout);

        if (event.data.data !== null) {
          resolve(event.data.data);
        } else {
          reject('QR code not found.');
        }
      };

      onError = error => {
        worker.removeEventListener('message', onMessage);
        worker.removeEventListener('error', onError);

        clearTimeout(timeout);

        const errorMessage = !error ? 'Unknown Error' : error.message || error;

        reject(`Scanner error: ${errorMessage}`);
      };

      worker.addEventListener('message', onMessage);
      worker.addEventListener('error', onError);

      timeout = setTimeout(() => onError('timeout'), TIMEOUT);

      QrScanner.loadImage(imageOrFileOrUrl)
        .then(image => {
          const imageData = QrScanner.getImageData(
            image,
            sourceRect,
            canvas,
            fixedCanvasSize,
          );

          worker.postMessage(
            {
              type: 'decode',
              data: imageData,
            },
            [imageData.data.buffer],
          );
        })
        .catch(onError);
    });

    if (sourceRect && alsoTryWithoutSourceRect) {
      promise = promise.catch(() =>
        QrScanner.scanImage(
          imageOrFileOrUrl,
          null,
          worker,
          canvas,
          fixedCanvasSize,
        ),
      );

      if (!createdNewWorker) {
        return promise;
      }

      worker.postMessage({
        type: 'close',
      });
    }

    return promise;
  }

  setGrayscaleWeights(red, green, blue, useIntegerApproximation = true) {
    this.worker.postMessage({
      type: 'grayscaleWeights',
      data: { red, green, blue, useIntegerApproximation },
    });
  }

  setInversionMode(inversionMode) {
    this.worker.postMessage({
      type: 'inversionMode',
      data: inversionMode,
    });
  }

  onCanPlay() {
    this.updateSourceRect();
    this.$video.play();
  }

  onPlay() {
    this.updateSourceRect();
    this.scanFrame();
  }

  onVisibilityChange() {
    if (document.hidden) {
      this.pause();
    } else if (this.isActive) {
      this.start();
    }
  }

  updateSourceRect() {
    const smallestDimension = Math.min(
      this.$video.videoWidth,
      this.$video.videoHeight,
    );

    const sourceRectSize = Math.round((2 / 3) * smallestDimension);

    this.sourceRect.width = this.sourceRect.height = sourceRectSize;
    this.sourceRect.x = (this.$video.videoWidth - sourceRectSize) / 2;
    this.sourceRect.y = (this.$video.videoHeight - sourceRectSize) / 2;
  }

  scanFrame() {
    if (!this.isActive || this.$video.paused || this.$video.ended) {
      return false;
    }

    // Using requestAnimationFrame to avoid scanning if tab is in background
    requestAnimationFrame(() => {
      QrScanner.scanImage(
        this.$video,
        this.sourceRect,
        this.worker,
        this.$canvas,
        true,
      )
        .then(this.onDecode, error => {
          if (this.isActive && error !== 'QR code not found.') {
            // Error
          }
        })
        .then(() => this.scanFrame());
    });
  }

  getCameraStream(facingMode, exact = false) {
    const constraintsToTry = [
      {
        width: { min: 1024 },
      },
      {
        width: { min: 768 },
      },
      {},
    ];

    if (facingMode) {
      if (exact) {
        facingMode = { exact: facingMode };
      }

      constraintsToTry.forEach(
        constraint => (constraint.facingMode = facingMode),
      );
    }

    return this.getMatchingCameraStream(constraintsToTry);
  }

  getMatchingCameraStream(constraintsToTry) {
    if (constraintsToTry.length === 0) {
      return Promise.reject('Camera not found.');
    }

    return navigator.mediaDevices
      .getUserMedia({
        video: constraintsToTry.shift(),
      })
      .catch(() => this.getMatchingCameraStream(constraintsToTry));
  }

  setVideoMirror(facingMode) {
    // in user facing mode mirror the video to make it easier for the user to position the QR code
    const scaleFactor = facingMode === 'user' ? -1 : 1;
    this.$video.style.transform = 'scaleX(' + scaleFactor + ')';
  }

  static getImageData(
    image,
    sourceRect = null,
    canvas = null,
    fixedCanvasSize = false,
  ) {
    canvas = canvas || document.createElement('canvas');

    const sourceRectX = sourceRect && sourceRect.x ? sourceRect.x : 0;
    const sourceRectY = sourceRect && sourceRect.y ? sourceRect.y : 0;

    const sourceRectWidth =
      sourceRect && sourceRect.width
        ? sourceRect.width
        : image.width || image.videoWidth;

    const sourceRectHeight =
      sourceRect && sourceRect.height
        ? sourceRect.height
        : image.height || image.videoHeight;

    if (
      !fixedCanvasSize &&
      (canvas.width !== sourceRectWidth || canvas.height !== sourceRectHeight)
    ) {
      canvas.width = sourceRectWidth;
      canvas.height = sourceRectHeight;
    }

    const context = canvas.getContext('2d', { alpha: false });

    context.imageSmoothingEnabled = false; // gives less blurry images

    context.drawImage(
      image,
      sourceRectX,
      sourceRectY,
      sourceRectWidth,
      sourceRectHeight,
      0,
      0,
      canvas.width,
      canvas.height,
    );

    return context.getImageData(0, 0, canvas.width, canvas.height);
  }

  static loadImage(imageOrFileOrUrl) {
    if (
      imageOrFileOrUrl instanceof HTMLCanvasElement ||
      imageOrFileOrUrl instanceof HTMLVideoElement ||
      (window.ImageBitmap && imageOrFileOrUrl instanceof window.ImageBitmap) ||
      (window.OffscreenCanvas &&
        imageOrFileOrUrl instanceof window.OffscreenCanvas)
    ) {
      return Promise.resolve(imageOrFileOrUrl);
    } else if (imageOrFileOrUrl instanceof Image) {
      return QrScanner.awaitImageLoad(imageOrFileOrUrl).then(
        () => imageOrFileOrUrl,
      );
    } else if (
      imageOrFileOrUrl instanceof File ||
      imageOrFileOrUrl instanceof URL ||
      typeof imageOrFileOrUrl === 'string'
    ) {
      const image = new Image();

      if (imageOrFileOrUrl instanceof File) {
        image.src = URL.createObjectURL(imageOrFileOrUrl);
      } else {
        image.src = imageOrFileOrUrl;
      }

      return QrScanner.awaitImageLoad(image).then(() => {
        if (imageOrFileOrUrl instanceof File) {
          URL.revokeObjectURL(image.src);
        }

        return image;
      });
    } else {
      return Promise.reject('Unsupported image type.');
    }
  }

  static awaitImageLoad(image) {
    return new Promise((resolve, reject) => {
      if (image.complete && image.naturalWidth !== 0) {
        resolve();
      } else {
        let onLoad, onError;

        onLoad = () => {
          image.removeEventListener('load', onLoad);
          image.removeEventListener('error', onError);
          resolve();
        };

        onError = () => {
          image.removeEventListener('load', onLoad);
          image.removeEventListener('error', onError);
          reject('Image load error');
        };

        image.addEventListener('load', onLoad);
        image.addEventListener('error', onError);
      }
    });
  }
}
