import { zipSync } from 'fflate';

export const TARGET_WIDTH = 3840;
export const TARGET_HEIGHT = 2160;

export type Stage = 'decode' | 'render' | 'encode' | 'zip';

export interface StageInfo {
  sourceWidth: number;
  sourceHeight: number;
}

export interface ProcessResult {
  zipBlob: Blob;
  zipName: string;
  pngName: string;
  sourceWidth: number;
  sourceHeight: number;
}

export class ImageDecodeError extends Error {
  constructor() {
    super('Unable to decode image');
    this.name = 'ImageDecodeError';
  }
}

interface DecodedImage {
  source: CanvasImageSource;
  width: number;
  height: number;
  close: () => void;
}

let canvas: HTMLCanvasElement | null = null;

function getCanvas(): HTMLCanvasElement {
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.width = TARGET_WIDTH;
    canvas.height = TARGET_HEIGHT;
  }

  return canvas;
}

async function decodeImage(file: File): Promise<DecodedImage> {
  if (typeof createImageBitmap === 'function') {
    try {
      const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
      return {
        source: bitmap,
        width: bitmap.width,
        height: bitmap.height,
        close: () => bitmap.close(),
      };
    } catch {
      // Fall back to an <img> decode for browsers or formats that reject createImageBitmap.
    }
  }

  const url = URL.createObjectURL(file);

  try {
    const image = new Image();
    image.decoding = 'async';
    image.src = url;
    await image.decode();

    return {
      source: image,
      width: image.naturalWidth,
      height: image.naturalHeight,
      close: () => URL.revokeObjectURL(url),
    };
  } catch {
    URL.revokeObjectURL(url);
    throw new ImageDecodeError();
  }
}

function centerCrop(width: number, height: number) {
  const targetRatio = TARGET_WIDTH / TARGET_HEIGHT;
  const ratio = width / height;

  if (ratio > targetRatio) {
    const cropWidth = height * targetRatio;
    return { sx: (width - cropWidth) / 2, sy: 0, sw: cropWidth, sh: height };
  }

  const cropHeight = width / targetRatio;
  return { sx: 0, sy: (height - cropHeight) / 2, sw: width, sh: cropHeight };
}

function canvasToPng(target: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    target.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('PNG encoding failed'));
      }
    }, 'image/png');
  });
}

async function buildZip(pngBlob: Blob, pngName: string): Promise<Blob> {
  const buffer = await pngBlob.arrayBuffer();
  const zipped = zipSync({ [pngName]: new Uint8Array(buffer) }, { level: 0 });

  return new Blob([new Uint8Array(zipped)], { type: 'application/zip' });
}

function sanitizeBaseName(filename: string): string {
  const withoutExtension = filename.replace(/\.[^./\\]+$/, '');
  const normalized = withoutExtension.normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
  const safe = normalized
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^[-.]+|[-.]+$/g, '');

  return (safe || 'image').slice(0, 80);
}

export async function processImage(
  file: File,
  onStage?: (stage: Stage, info?: StageInfo) => void,
): Promise<ProcessResult> {
  onStage?.('decode');

  let decoded: DecodedImage | null = await decodeImage(file);

  try {
    const width = decoded.width;
    const height = decoded.height;

    if (!width || !height) {
      throw new ImageDecodeError();
    }

    const info: StageInfo = { sourceWidth: width, sourceHeight: height };
    const target = getCanvas();
    const context = target.getContext('2d', { alpha: false });

    if (!context) {
      throw new Error('Canvas 2D is unavailable');
    }

    const crop = centerCrop(width, height);

    onStage?.('render', info);
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, TARGET_WIDTH, TARGET_HEIGHT);
    context.drawImage(
      decoded.source,
      crop.sx,
      crop.sy,
      crop.sw,
      crop.sh,
      0,
      0,
      TARGET_WIDTH,
      TARGET_HEIGHT,
    );

    decoded.close();
    decoded = null;

    onStage?.('encode', info);
    const pngBlob = await canvasToPng(target);

    onStage?.('zip', info);
    const base = sanitizeBaseName(file.name);
    const pngName = `${base}-${TARGET_WIDTH}x${TARGET_HEIGHT}.png`;
    const zipName = `${base}-${TARGET_WIDTH}x${TARGET_HEIGHT}.zip`;
    const zipBlob = await buildZip(pngBlob, pngName);

    return { zipBlob, zipName, pngName, sourceWidth: width, sourceHeight: height };
  } finally {
    decoded?.close();
  }
}

export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return '0 B';
  }

  const units = ['B', 'KB', 'MB', 'GB'];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** index;

  return `${value >= 10 || index === 0 ? Math.round(value) : value.toFixed(1)} ${units[index]}`;
}
