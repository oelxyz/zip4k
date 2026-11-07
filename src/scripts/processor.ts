import { zipSync } from 'fflate';

export const TARGET_WIDTH = 3840;
export const TARGET_HEIGHT = 2160;

const SHARPEN_AMOUNT = 0.45;
const MAX_SOURCE_EDGE = 8192;

export type Stage = 'decode' | 'render' | 'encode' | 'zip';
export type RenderEngine = 'lanczos' | 'canvas';

export interface StageInfo {
  sourceWidth: number;
  sourceHeight: number;
}

export interface ProcessOptions {
  sharpening?: boolean;
}

export interface ProcessResult {
  zipBlob: Blob;
  zipName: string;
  pngName: string;
  sourceWidth: number;
  sourceHeight: number;
  engine: RenderEngine;
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

interface CropRect {
  sx: number;
  sy: number;
  sw: number;
  sh: number;
}

interface TextureTarget {
  texture: WebGLTexture;
  framebuffer: WebGLFramebuffer;
}

interface ResampleUniforms {
  source: WebGLUniformLocation | null;
  sourceSize: WebGLUniformLocation | null;
  crop: WebGLUniformLocation | null;
  outSize: WebGLUniformLocation | null;
  axis: WebGLUniformLocation | null;
  scale: WebGLUniformLocation | null;
  flipV: WebGLUniformLocation | null;
}

interface SharpenUniforms {
  source: WebGLUniformLocation | null;
  texel: WebGLUniformLocation | null;
  amount: WebGLUniformLocation | null;
}

interface LanczosRenderer {
  gl: WebGL2RenderingContext;
  resampleProgram: WebGLProgram;
  sharpenProgram: WebGLProgram;
  vao: WebGLVertexArrayObject;
  resampleUniforms: ResampleUniforms;
  sharpenUniforms: SharpenUniforms;
}

interface ResamplePass {
  source: WebGLTexture;
  sourceWidth: number;
  sourceHeight: number;
  crop: CropRect;
  outWidth: number;
  outHeight: number;
  axis: 'x' | 'y';
  scale: number;
  flipV: boolean;
}

const VERTEX_SHADER = `#version 300 es
layout(location = 0) in vec2 a_position;
out vec2 v_uv;

void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

const RESAMPLE_SHADER = `#version 300 es
precision highp float;

uniform sampler2D u_source;
uniform vec2 u_sourceSize;
uniform vec4 u_crop;
uniform vec2 u_outSize;
uniform vec2 u_axis;
uniform float u_scale;
uniform float u_flipV;

in vec2 v_uv;
out vec4 outColor;

float sinc(float x) {
  if (abs(x) < 1e-6) {
    return 1.0;
  }

  float px = 3.141592653589793 * x;
  return sin(px) / px;
}

float lanczos(float x) {
  if (abs(x) >= 3.0) {
    return 0.0;
  }

  return sinc(x) * sinc(x / 3.0);
}

vec3 sampleSource(vec2 pos) {
  float u = (pos.x + 0.5) / u_sourceSize.x;
  float v = (pos.y + 0.5) / u_sourceSize.y;
  v = mix(v, 1.0 - v, u_flipV);

  vec4 color = texture(u_source, vec2(u, v));
  return color.rgb * color.a + vec3(1.0 - color.a);
}

void main() {
  vec2 outPos = vec2(v_uv.x * u_outSize.x, (1.0 - v_uv.y) * u_outSize.y);
  vec2 srcPos = u_crop.xy + (outPos + 0.5) * (u_crop.zw / u_outSize) - 0.5;
  vec2 cropMin = u_crop.xy;
  vec2 cropMax = u_crop.xy + u_crop.zw - vec2(1.0);

  float scale = max(1.0, u_scale);
  float radius = min(12.0, ceil(3.0 * scale));
  float center = dot(srcPos, u_axis);
  float baseIndex = floor(center);
  vec3 sum = vec3(0.0);
  float weightSum = 0.0;

  for (int i = -12; i <= 12; i++) {
    float index = baseIndex + float(i);
    float distance = center - index;

    if (abs(distance) > radius) {
      continue;
    }

    float weight = lanczos(distance / scale);

    if (weight == 0.0) {
      continue;
    }

    vec2 pos = clamp(srcPos + u_axis * (index - center), cropMin, cropMax);
    sum += sampleSource(pos) * weight;
    weightSum += weight;
  }

  vec3 color = sum / max(weightSum, 1e-6);
  outColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}`;

const SHARPEN_SHADER = `#version 300 es
precision highp float;

uniform sampler2D u_source;
uniform vec2 u_texel;
uniform float u_amount;

in vec2 v_uv;
out vec4 outColor;

vec3 sampleAt(float x, float y) {
  return texture(u_source, v_uv + vec2(x, y) * u_texel).rgb;
}

void main() {
  vec3 center = sampleAt(0.0, 0.0);
  vec3 blur = vec3(0.0);

  for (int y = -2; y <= 2; y++) {
    for (int x = -2; x <= 2; x++) {
      float fx = float(x);
      float fy = float(y);
      float wx = abs(fx) < 0.5 ? 6.0 : (abs(fx) < 1.5 ? 4.0 : 1.0);
      float wy = abs(fy) < 0.5 ? 6.0 : (abs(fy) < 1.5 ? 4.0 : 1.0);
      blur += sampleAt(fx, fy) * wx * wy;
    }
  }

  blur /= 256.0;
  vec3 color = clamp(center + (center - blur) * u_amount, 0.0, 1.0);
  outColor = vec4(color, 1.0);
}`;

let canvas: HTMLCanvasElement | null = null;
let lanczosRenderer: LanczosRenderer | null | undefined;

function getCanvas(): HTMLCanvasElement {
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.width = TARGET_WIDTH;
    canvas.height = TARGET_HEIGHT;
  }

  return canvas;
}

function compileShader(
  gl: WebGL2RenderingContext,
  type: number,
  source: string,
): WebGLShader {
  const shader = gl.createShader(type);

  if (!shader) {
    throw new Error('Unable to create shader');
  }

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(log ?? 'Shader compilation failed');
  }

  return shader;
}

function createProgram(
  gl: WebGL2RenderingContext,
  fragmentSource: string,
): WebGLProgram {
  const vertexShader = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
  const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
  const program = gl.createProgram();

  if (!program) {
    throw new Error('Unable to create program');
  }

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error(log ?? 'Program linking failed');
  }

  return program;
}

function createLanczosRenderer(): LanczosRenderer {
  const glCanvas = document.createElement('canvas');
  glCanvas.width = TARGET_WIDTH;
  glCanvas.height = TARGET_HEIGHT;

  const gl = glCanvas.getContext('webgl2', {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    preserveDrawingBuffer: false,
    powerPreference: 'high-performance',
  });

  if (!gl) {
    throw new Error('WebGL2 is unavailable');
  }

  const resampleProgram = createProgram(gl, RESAMPLE_SHADER);
  const sharpenProgram = createProgram(gl, SHARPEN_SHADER);
  const vao = gl.createVertexArray();

  if (!vao) {
    throw new Error('Unable to create vertex array');
  }

  const buffer = gl.createBuffer();

  if (!buffer) {
    throw new Error('Unable to create vertex buffer');
  }

  gl.bindVertexArray(vao);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
    gl.STATIC_DRAW,
  );
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  gl.bindVertexArray(null);

  gl.disable(gl.BLEND);
  gl.disable(gl.DEPTH_TEST);
  gl.disable(gl.CULL_FACE);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);

  const renderer: LanczosRenderer = {
    gl,
    resampleProgram,
    sharpenProgram,
    vao,
    resampleUniforms: {
      source: gl.getUniformLocation(resampleProgram, 'u_source'),
      sourceSize: gl.getUniformLocation(resampleProgram, 'u_sourceSize'),
      crop: gl.getUniformLocation(resampleProgram, 'u_crop'),
      outSize: gl.getUniformLocation(resampleProgram, 'u_outSize'),
      axis: gl.getUniformLocation(resampleProgram, 'u_axis'),
      scale: gl.getUniformLocation(resampleProgram, 'u_scale'),
      flipV: gl.getUniformLocation(resampleProgram, 'u_flipV'),
    },
    sharpenUniforms: {
      source: gl.getUniformLocation(sharpenProgram, 'u_source'),
      texel: gl.getUniformLocation(sharpenProgram, 'u_texel'),
      amount: gl.getUniformLocation(sharpenProgram, 'u_amount'),
    },
  };

  glCanvas.addEventListener('webglcontextlost', (event) => {
    event.preventDefault();
    lanczosRenderer = null;
  });

  return renderer;
}

function getLanczosRenderer(): LanczosRenderer | null {
  if (lanczosRenderer !== undefined) {
    return lanczosRenderer;
  }

  try {
    lanczosRenderer = createLanczosRenderer();
  } catch {
    lanczosRenderer = null;
  }

  return lanczosRenderer;
}

function createRenderTarget(
  gl: WebGL2RenderingContext,
  width: number,
  height: number,
): TextureTarget {
  const texture = gl.createTexture();
  const framebuffer = gl.createFramebuffer();

  if (!texture || !framebuffer) {
    throw new Error('Unable to create render target');
  }

  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA8,
    width,
    height,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    null,
  );

  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
  gl.framebufferTexture2D(
    gl.FRAMEBUFFER,
    gl.COLOR_ATTACHMENT0,
    gl.TEXTURE_2D,
    texture,
    0,
  );

  if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
    gl.deleteFramebuffer(framebuffer);
    gl.deleteTexture(texture);
    throw new Error('Render target is incomplete');
  }

  return { texture, framebuffer };
}

function deleteRenderTarget(
  gl: WebGL2RenderingContext,
  target: TextureTarget,
): void {
  gl.deleteFramebuffer(target.framebuffer);
  gl.deleteTexture(target.texture);
}

function drawResample(
  renderer: LanczosRenderer,
  pass: ResamplePass,
): void {
  const { gl, resampleProgram, vao, resampleUniforms } = renderer;
  const axisX = pass.axis === 'x' ? 1 : 0;
  const axisY = pass.axis === 'y' ? 1 : 0;

  gl.useProgram(resampleProgram);
  gl.bindVertexArray(vao);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, pass.source);
  gl.uniform1i(resampleUniforms.source, 0);
  gl.uniform2f(resampleUniforms.sourceSize, pass.sourceWidth, pass.sourceHeight);
  gl.uniform4f(
    resampleUniforms.crop,
    pass.crop.sx,
    pass.crop.sy,
    pass.crop.sw,
    pass.crop.sh,
  );
  gl.uniform2f(resampleUniforms.outSize, pass.outWidth, pass.outHeight);
  gl.uniform2f(resampleUniforms.axis, axisX, axisY);
  gl.uniform1f(resampleUniforms.scale, pass.scale);
  gl.uniform1f(resampleUniforms.flipV, pass.flipV ? 1 : 0);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
}

function flipRows(
  pixels: Uint8ClampedArray,
  width: number,
  height: number,
): void {
  const rowSize = width * 4;
  const temp = new Uint8ClampedArray(rowSize);

  for (let y = 0; y < Math.floor(height / 2); y++) {
    const top = y * rowSize;
    const bottom = (height - 1 - y) * rowSize;

    temp.set(pixels.subarray(top, top + rowSize));
    pixels.copyWithin(top, bottom, bottom + rowSize);
    pixels.set(temp, bottom);
  }
}

function renderWithLanczos(
  decoded: DecodedImage,
  crop: CropRect,
  sharpening: boolean,
  target: HTMLCanvasElement,
): boolean {
  const renderer = getLanczosRenderer();

  if (!renderer) {
    return false;
  }

  const { gl } = renderer;

  if (gl.isContextLost()) {
    return false;
  }

  const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE) as number;

  if (
    decoded.width > MAX_SOURCE_EDGE ||
    decoded.height > MAX_SOURCE_EDGE ||
    decoded.width > maxTextureSize ||
    decoded.height > maxTextureSize
  ) {
    return false;
  }

  const midWidth = Math.max(1, Math.round(crop.sw));
  const midHeight = TARGET_HEIGHT;
  let sourceTexture: WebGLTexture | null = null;
  let midTarget: TextureTarget | null = null;
  let finalTarget: TextureTarget | null = null;

  try {
    sourceTexture = gl.createTexture();

    if (!sourceTexture) {
      throw new Error('Unable to create source texture');
    }

    gl.bindTexture(gl.TEXTURE_2D, sourceTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      decoded.source as TexImageSource,
    );

    midTarget = createRenderTarget(gl, midWidth, midHeight);
    finalTarget = createRenderTarget(gl, TARGET_WIDTH, TARGET_HEIGHT);

    gl.bindFramebuffer(gl.FRAMEBUFFER, midTarget.framebuffer);
    gl.viewport(0, 0, midWidth, midHeight);
    drawResample(renderer, {
      source: sourceTexture,
      sourceWidth: decoded.width,
      sourceHeight: decoded.height,
      crop,
      outWidth: midWidth,
      outHeight: midHeight,
      axis: 'y',
      scale: Math.max(1, crop.sh / midHeight),
      flipV: false,
    });

    gl.bindFramebuffer(gl.FRAMEBUFFER, finalTarget.framebuffer);
    gl.viewport(0, 0, TARGET_WIDTH, TARGET_HEIGHT);
    drawResample(renderer, {
      source: midTarget.texture,
      sourceWidth: midWidth,
      sourceHeight: midHeight,
      crop: { sx: 0, sy: 0, sw: midWidth, sh: midHeight },
      outWidth: TARGET_WIDTH,
      outHeight: TARGET_HEIGHT,
      axis: 'x',
      scale: Math.max(1, midWidth / TARGET_WIDTH),
      flipV: true,
    });

    const pixels = new Uint8ClampedArray(TARGET_WIDTH * TARGET_HEIGHT * 4);

    if (sharpening) {
      const { sharpenProgram, sharpenUniforms } = renderer;

      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, TARGET_WIDTH, TARGET_HEIGHT);
      gl.useProgram(sharpenProgram);
      gl.bindVertexArray(renderer.vao);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, finalTarget.texture);
      gl.uniform1i(sharpenUniforms.source, 0);
      gl.uniform2f(sharpenUniforms.texel, 1 / TARGET_WIDTH, 1 / TARGET_HEIGHT);
      gl.uniform1f(sharpenUniforms.amount, SHARPEN_AMOUNT);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      gl.readPixels(
        0,
        0,
        TARGET_WIDTH,
        TARGET_HEIGHT,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        pixels,
      );
    } else {
      gl.bindFramebuffer(gl.FRAMEBUFFER, finalTarget.framebuffer);
      gl.readPixels(
        0,
        0,
        TARGET_WIDTH,
        TARGET_HEIGHT,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        pixels,
      );
    }

    flipRows(pixels, TARGET_WIDTH, TARGET_HEIGHT);

    const context = target.getContext('2d', { alpha: false });

    if (!context) {
      throw new Error('Canvas 2D is unavailable');
    }

    context.putImageData(
      new ImageData(pixels, TARGET_WIDTH, TARGET_HEIGHT),
      0,
      0,
    );

    return true;
  } catch {
    return false;
  } finally {
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.bindTexture(gl.TEXTURE_2D, null);

    if (sourceTexture) {
      gl.deleteTexture(sourceTexture);
    }

    if (midTarget) {
      deleteRenderTarget(gl, midTarget);
    }

    if (finalTarget) {
      deleteRenderTarget(gl, finalTarget);
    }
  }
}

function renderWithCanvas(
  decoded: DecodedImage,
  crop: CropRect,
  target: HTMLCanvasElement,
): void {
  const context = target.getContext('2d', { alpha: false });

  if (!context) {
    throw new Error('Canvas 2D is unavailable');
  }

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

function centerCrop(width: number, height: number): CropRect {
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
  options: ProcessOptions = {},
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
    const crop = centerCrop(width, height);

    onStage?.('render', info);

    let engine: RenderEngine = 'canvas';

    try {
      if (renderWithLanczos(decoded, crop, options.sharpening ?? false, target)) {
        engine = 'lanczos';
      } else {
        renderWithCanvas(decoded, crop, target);
      }
    } finally {
      decoded.close();
      decoded = null;
    }

    onStage?.('encode', info);
    const pngBlob = await canvasToPng(target);

    onStage?.('zip', info);
    const base = sanitizeBaseName(file.name);
    const pngName = `${base}-${TARGET_WIDTH}x${TARGET_HEIGHT}.png`;
    const zipName = `${base}-${TARGET_WIDTH}x${TARGET_HEIGHT}.zip`;
    const zipBlob = await buildZip(pngBlob, pngName);

    return {
      zipBlob,
      zipName,
      pngName,
      sourceWidth: width,
      sourceHeight: height,
      engine,
    };
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
