---
title: 'How to use zip4k: landscape images to 3840×2160 PNG, one ZIP per file'
description: 'Step-by-step guide to turning landscape photos into exact 4K PNG packages with zip4k, for PNGTree contributors and other stock photographers.'
lang: en
pubDate: 2026-11-07
draft: false
---

zip4k is a small, free tool for contributors who prepare landscape photos for upload: it center-crops a photo to 16:9, resamples it to exactly **3840 × 2160**, and downloads a **ZIP** containing one PNG. Everything runs in your browser — nothing is uploaded, and there is no AI anywhere in the pipeline.

![zip4k home page with the live resample demo](/blog/how-to-use-zip4k-hero.png)

## 1. Add your images

Open the tool and drag landscape photos onto the drop zone, or click to browse (JPG, PNG, WebP). You can add many files at once; they are processed one at a time so memory stays manageable.

![Drop zone with one processed image in the queue](/blog/how-to-use-zip4k-tool.png)

## 2. Choose a finish

The **Finish** control sits between the drop zone and the queue:

- **Natural** — straight Lanczos resampling, no extra sharpening.
- **Crisp** (default) — Lanczos plus a light unsharp mask that makes edges a little firmer. It does not invent detail.

Lanczos sampling is used because it keeps edges cleaner than basic browser scaling when a photo grows toward 4K.

## 3. Download one ZIP per image

As each file finishes, its row shows a green **READY** status and a **DOWNLOAD ZIP** button. The result is named after the source, for example `mountain-3840x2160.zip`, with a single PNG inside:

- exactly **3840 × 2160 px**;
- **16:9** after a centered crop (equal margins left/right or top/bottom);
- **PNG** format.

Use **DOWNLOAD ALL ZIPS** to grab every finished file at once, or **CLEAR** to empty the queue.

## On mobile

The whole flow works on a phone: pick photos, let each one render, download. Keep batches small — a few files at a time — because 4K PNG files use a lot of memory.

![The tool on a phone, with the Finish control and empty queue](/blog/how-to-use-zip4k-mobile.png)

## What to expect from the result

zip4k resizes; it does not add detail that is not there. A source at 1080p or larger usually holds up at 4K, while a very small source will still look soft. If your source is below 4K in both dimensions, expect a modest improvement in edge definition rather than magic.

For PNGTree contributors, the package stays deterministic and local: the same input always produces the same 4K PNG, with no account, no watermark, and no upload. zip4k is independent and not affiliated with PNGTree; it simply prepares the packages you upload there.
