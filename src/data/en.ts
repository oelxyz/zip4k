import type { HomeContent } from './types';

export const en: HomeContent = {
  lang: 'en',
  path: '/',
  skipLabel: 'Skip to the tool',
  seo: {
    title: 'zip4k — PNGTree 4K ZIP ready: landscape images to 3840×2160 PNG per ZIP',
    description:
      'For PNGTree contributors: center-crop landscape images to 16:9, resize to exactly 3840×2160, export PNG, and download one ready-to-upload ZIP per image. Independent tool, not affiliated with PNGTree. No upload, no AI.',
    ogTitle: 'zip4k — PNGTree-ready 4K landscape packages, one ZIP per image',
    ogDescription:
      'Center-crop to 16:9, resize to exactly 3840×2160, export PNG, and download one ready-to-upload ZIP per image for PNGTree. Runs locally in your browser.',
    ogLocale: 'en_US',
    ogLocaleAlternate: 'id_ID',
    browserRequirements: 'Requires a modern browser with WebGL2 or Canvas 2D support',
  },
  masthead: {
    homeLabel: 'zip4k home',
    note: 'landscape → 3840×2160',
    blogHref: '/blog/',
    blogLabel: 'Blog',
    languageLabel: 'Language',
    themeLabel: 'Switch light or dark mode',
  },
  hero: {
    kicker: 'Independent utility for PNGTree contributors',
    headlines: ['Landscape images to 4K.', 'One ZIP per file.'],
    lede: 'zip4k centers landscape photos to 16:9, resamples them to exactly 3840 × 2160, and packages each PNG in its own ZIP for PNGTree upload. Nothing is uploaded to a server.',
    tags: ['No upload', 'No AI', 'PNG output', 'ZIP per image'],
    demoLabel: 'Live resample demo',
    demoStatus: '3840×2160 · 16:9',
    demoCopy:
      'Center crop keeps the composition intact. The result is a standard PNGTree-ready ZIP: source image, exact 4K frame, and Lanczos sampling.',
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
      {
        label: 'PNGTree upload check',
        html: 'Landscape ratio is normalized to 16:9; output is exactly 4K and delivered as one ZIP per image.',
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
          'No. It uses Lanczos resampling in WebGL with an optional light unsharp mask; detail is not invented. Sources at 1080p or higher usually look clean at 4K; very small sources can look soft.',
      },
      {
        question: 'What happens to photos that are not 16:9?',
        answer:
          'They are center-cropped to 16:9 before resizing. Equal amounts are trimmed from the left and right, or from the top and bottom, depending on the original ratio.',
      },
      {
        question: 'Is this an official PNGTree tool?',
        answer:
          'No. zip4k is independent and not affiliated with PNGTree. It prepares the image packages that contributors later upload to PNGTree.',
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
    sectionNo: '',
    title: 'PNGTree upload checklist',
    body: 'Before upload, zip4k gives contributors a deterministic package: centered 16:9 composition, exact 3840 × 2160 PNG, one ZIP per image, and local processing without account or AI. Lanczos sampling keeps edges clean; it does not invent detail, so verify the source resolution before submitting.',
  },
  footer: {
    note: 'zip4k is an independent utility for PNGTree contributors. Not affiliated with PNGTree.',
    openSourcePrefix: 'Open source · MIT · Enhanced by ',
    githubRepoHref: 'https://github.com/oelxyz/zip4k',
    githubRepoLabel: 'GitHub repo',
    openSourceSeparator: ' · ',
    githubProfileHref: 'https://github.com/oelxyz',
    githubProfileLabel: '@oelxyz',
    credit: 'Typography: Fraunces · Literata · Plus Jakarta Sans',
    meta: ['3840 × 2160', 'PNG', 'ZIP per image'],
  },
};
