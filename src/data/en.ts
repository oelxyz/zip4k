import type { HomeContent } from './types';

export const en: HomeContent = {
  lang: 'en',
  path: '/',
  skipLabel: 'Skip to the tool',
  seo: {
    title: 'zip4k — Resize landscape images to 3840×2160 PNG + ZIP per file',
    description:
      'Center-crop landscape images to 16:9, resize to exactly 3840×2160, export PNG, and download one ready-to-upload ZIP per image. No upload, no AI.',
    ogTitle: 'zip4k — Landscape images to 3840×2160, one ZIP per file',
    ogDescription:
      'Center-crop to 16:9, resize to exactly 3840×2160, export PNG, and download one ready-to-upload ZIP per image. Runs entirely in your browser.',
    ogLocale: 'en_US',
    ogLocaleAlternate: 'id_ID',
    browserRequirements: 'Requires a modern browser with Canvas 2D support',
  },
  masthead: {
    homeLabel: 'zip4k home',
    note: 'landscape → 3840×2160',
    languageLabel: 'Language',
  },
  hero: {
    kicker: 'Batch utility for stock contributors',
    headlines: ['Landscape images to 4K.', 'One ZIP per file.'],
    lede: 'Center-crop any landscape photo to 16:9, resize it to exactly 3840 × 2160, export PNG, and get a ZIP that is ready to upload. Everything runs in your browser.',
    tags: ['No upload', 'No AI', 'PNG output', 'ZIP per image'],
    outputLabel: 'Output',
    specs: [
      { label: 'Resolution', value: '3840 × 2160' },
      { label: 'Aspect', value: '16 : 9' },
      { label: 'Format', value: 'PNG' },
      { label: 'Packaging', value: '1 ZIP / image' },
      { label: 'Processing', value: 'On your device' },
    ],
  },
  tool: {
    sectionNo: '01',
    title: 'The tool',
    dropTitle: 'Drop landscape images here',
    dropHint: 'or click to browse · JPG, PNG, WebP',
    queueLabel: 'Queue',
    downloadAll: 'Download all ZIPs',
    clear: 'Clear',
    empty: 'No images yet. Add a few landscape photos to begin.',
    memoryNote:
      'Images are processed one at a time. On mobile, keep batches small — 4K PNG files need a lot of memory.',
    finishLabel: 'Finish',
    finishHint:
      'Lanczos resampling. Crisp adds subtle edge sharpening; no detail is invented.',
    finishNatural: 'Natural',
    finishCrisp: 'Crisp',
  },
  how: {
    sectionNo: '02',
    title: 'How it works',
    steps: [
      {
        title: 'Add your images',
        body: 'Select or drop any number of landscape photos. Files never leave your device.',
      },
      {
        title: 'Center-crop and resize',
        body: 'Each image is trimmed evenly to 16:9, then resampled to exactly 3840 × 2160 with a Lanczos filter in WebGL.',
      },
      {
        title: 'Download one ZIP per image',
        body: 'Every finished PNG is packaged in its own ZIP, named after the original file, ready to upload.',
      },
    ],
  },
  spec: {
    sectionNo: '03',
    title: 'Specification',
    rows: [
      { label: 'Output resolution', html: '3840 × 2160 px' },
      { label: 'Aspect ratio', html: '16:9, center crop' },
      { label: 'File format', html: 'PNG, opaque' },
      { label: 'Packaging', html: 'One ZIP archive per source image' },
      { label: 'Inside the ZIP', html: 'One PNG named <code>original-name-3840x2160.png</code>' },
      {
        label: 'Upscaling',
        html: 'Lanczos resampling in WebGL, optional light sharpening (no AI)',
      },
      { label: 'Cost', html: 'Free, no account' },
      { label: 'Privacy', html: 'Processed locally in your browser' },
    ],
  },
  faq: {
    sectionNo: '04',
    title: 'Questions',
    items: [
      {
        question: 'Are my images uploaded to a server?',
        answer:
          'No. zip4k processes every file locally in your browser. Nothing is uploaded, stored, or sent anywhere.',
      },
      {
        question: 'Does zip4k use AI to upscale?',
        answer:
          "No. It relies on the browser's own high-quality interpolation. Sources at 1080p or higher usually look clean at 4K; very small sources can look soft.",
      },
      {
        question: 'What happens to photos that are not 16:9?',
        answer:
          'They are center-cropped to 16:9 before resizing. Equal amounts are trimmed from the left and right, or from the top and bottom, depending on the original ratio.',
      },
      {
        question: 'Is the output exactly 3840 × 2160?',
        answer: 'Yes. Every PNG is rendered at exactly 3840 × 2160 pixels.',
      },
      {
        question: 'Can I use it on a phone?',
        answer:
          'Yes. Pick images from your photo library and download the ZIPs. Process a few at a time — 4K PNG files use a lot of memory.',
      },
      {
        question: 'Is zip4k free?',
        answer: 'Yes. No account, no watermark, no upload. The tool runs entirely on your device.',
      },
    ],
  },
  quality: {
    sectionNo: '05',
    title: 'A note on quality',
    body: 'zip4k resamples with a Lanczos filter in WebGL for cleaner edges than basic browser scaling, with an optional light unsharp mask. Neither invents detail: a 1080p or larger source usually holds up at 4K; very small sources will still look soft. There is no AI in the pipeline.',
  },
  footer: {
    note: 'zip4k is an independent utility for stock contributors. Not affiliated with PNGTree.',
    meta: ['3840 × 2160', 'PNG', 'ZIP per image'],
    blogHref: '/blog/',
    blogLabel: 'Blog',
  },
};
