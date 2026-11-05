# zip4k

A small batch utility for stock contributors. It center-crops landscape images to 16:9, resizes them to exactly 3840 × 2160, exports PNG, and packages each image in its own ZIP.

Everything runs in the browser. Images are never uploaded, and there is no AI in the pipeline — just the browser's high-quality interpolation.

## Features

- Center-crop any landscape image to 16:9
- Resize to exactly 3840 × 2160 px
- PNG output, one file per ZIP
- Drag and drop, multi-file queue
- Bilingual: English (`/`) and Indonesian (`/id/`)
- Static site, deployable to Cloudflare Pages

## Development

```bash
npm install
npm run dev
```

```bash
npm run build     # typecheck + production build to dist/
npm run preview   # preview the production build
```

Requires Node.js 20.19+ (Node 24 recommended).

## Deploy to Cloudflare Pages

Connect this repository in the Cloudflare dashboard and use:

| Setting | Value |
| --- | --- |
| Framework preset | Vite |
| Build command | `npm run build` |
| Output directory | `dist` |
| Environment variable | `NODE_VERSION` = `22` (if the build image defaults to an older Node) |

## Domain

SEO files currently assume the production URL `https://zip4k.pages.dev/`. If you attach a custom domain, update the absolute URLs in:

- `index.html` and `id/index.html` (canonical, hreflang, Open Graph, Twitter)
- `public/sitemap.xml`
- `public/robots.txt`

## How processing works

1. The image is decoded with `createImageBitmap` (falling back to an `<img>` decode).
2. The largest 16:9 rectangle is centered and cropped.
3. It is drawn to a 3840 × 2160 canvas using `imageSmoothingQuality = 'high'`.
4. The canvas is encoded to PNG.
5. The PNG is stored uncompressed in a ZIP archive (`fflate`) and offered as a download.

Processing is sequential to keep memory use predictable, especially on mobile.

## Stack

- Vite + TypeScript
- [fflate](https://github.com/101arrowz/fflate) for ZIP packaging
- No UI framework, no runtime dependencies besides fflate
