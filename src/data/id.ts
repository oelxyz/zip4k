import type { HomeContent } from './types';

export const id: HomeContent = {
  lang: 'id',
  path: '/id/',
  skipLabel: 'Lewati ke alat',
  seo: {
    title: 'zip4k — Ubah gambar landscape ke 3840×2160, PNG + ZIP per file',
    description:
      'Potong gambar landscape ke 16:9, ubah ukuran ke tepat 3840×2160, ekspor PNG, dan unduh satu ZIP siap unggah per gambar. Tanpa unggah, tanpa AI.',
    ogTitle: 'zip4k — Gambar landscape jadi 3840×2160, satu ZIP per file',
    ogDescription:
      'Potong tengah ke 16:9, ubah ukuran ke tepat 3840×2160, ekspor PNG, dan unduh satu ZIP siap unggah per gambar. Berjalan sepenuhnya di browser.',
    ogLocale: 'id_ID',
    ogLocaleAlternate: 'en_US',
    browserRequirements: 'Membutuhkan browser modern dengan dukungan Canvas 2D',
  },
  masthead: {
    homeLabel: 'Beranda zip4k',
    note: 'landscape → 3840×2160',
    languageLabel: 'Bahasa',
  },
  hero: {
    kicker: 'Alat batch untuk kontributor stok',
    headlines: ['Gambar landscape jadi 4K.', 'Satu ZIP per file.'],
    lede: 'Potong foto landscape ke tengah dengan rasio 16:9, ubah ukurannya ke tepat 3840 × 2160, ekspor PNG, lalu unduh ZIP yang siap diunggah. Semua proses berjalan di browser Anda.',
    tags: ['Tanpa unggah', 'Tanpa AI', 'Output PNG', 'ZIP per gambar'],
    outputLabel: 'Keluaran',
    specs: [
      { label: 'Resolusi', value: '3840 × 2160' },
      { label: 'Rasio', value: '16 : 9' },
      { label: 'Format', value: 'PNG' },
      { label: 'Kemasan', value: '1 ZIP / gambar' },
      { label: 'Proses', value: 'Di perangkat Anda' },
    ],
  },
  tool: {
    sectionNo: '01',
    title: 'Alat',
    dropTitle: 'Tarik gambar landscape ke sini',
    dropHint: 'atau klik untuk memilih · JPG, PNG, WebP',
    queueLabel: 'Antrean',
    downloadAll: 'Unduh semua ZIP',
    clear: 'Bersihkan',
    empty: 'Belum ada gambar. Tambahkan beberapa foto landscape untuk memulai.',
    memoryNote:
      'Gambar diproses satu per satu. Di ponsel, jaga batch tetap kecil — file PNG 4K membutuhkan memori besar.',
    finishLabel: 'Hasil akhir',
    finishHint:
      'Resampling Lanczos. Tegas menambahkan penajaman tepi halus; tidak ada detail yang dikarang.',
    finishNatural: 'Natural',
    finishCrisp: 'Tegas',
  },
  how: {
    sectionNo: '02',
    title: 'Cara kerja',
    steps: [
      {
        title: 'Tambahkan gambar',
        body: 'Pilih atau tarik sejumlah foto landscape. File tidak pernah keluar dari perangkat Anda.',
      },
      {
        title: 'Potong tengah dan ubah ukuran',
        body: 'Setiap gambar dipangkas merata ke 16:9, lalu di-resample tepat 3840 × 2160 dengan filter Lanczos di WebGL.',
      },
      {
        title: 'Unduh satu ZIP per gambar',
        body: 'Setiap PNG selesai dikemas dalam ZIP tersendiri, dinamai sesuai file asli, siap diunggah.',
      },
    ],
  },
  spec: {
    sectionNo: '03',
    title: 'Spesifikasi',
    rows: [
      { label: 'Resolusi keluaran', html: '3840 × 2160 px' },
      { label: 'Rasio aspek', html: '16:9, potong tengah' },
      { label: 'Format file', html: 'PNG, opaque' },
      { label: 'Kemasan', html: 'Satu arsip ZIP per gambar sumber' },
      { label: 'Isi ZIP', html: 'Satu PNG bernama <code>nama-asli-3840x2160.png</code>' },
      {
        label: 'Upscaling',
        html: 'Resampling Lanczos di WebGL, penajaman ringan opsional (tanpa AI)',
      },
      { label: 'Biaya', html: 'Gratis, tanpa akun' },
      { label: 'Privasi', html: 'Diproses lokal di browser Anda' },
    ],
  },
  faq: {
    sectionNo: '04',
    title: 'Pertanyaan',
    items: [
      {
        question: 'Apakah gambar saya diunggah ke server?',
        answer:
          'Tidak. zip4k memproses setiap file secara lokal di browser Anda. Tidak ada yang diunggah, disimpan, atau dikirim ke mana pun.',
      },
      {
        question: 'Apakah zip4k memakai AI untuk upscale?',
        answer:
          'Tidak. Prosesnya memakai interpolasi kualitas tinggi bawaan browser. Sumber 1080p atau lebih biasanya tetap tajam di 4K; sumber yang sangat kecil bisa terlihat lembut.',
      },
      {
        question: 'Bagaimana foto yang bukan 16:9?',
        answer:
          'Foto dipotong di tengah ke rasio 16:9 sebelum diubah ukurannya. Bagian yang dipangkas sama banyak dari kiri dan kanan, atau dari atas dan bawah, tergantung rasio aslinya.',
      },
      {
        question: 'Apakah hasilnya tepat 3840 × 2160?',
        answer: 'Ya. Setiap PNG dirender tepat 3840 × 2160 piksel.',
      },
      {
        question: 'Bisa dipakai di ponsel?',
        answer:
          'Bisa. Pilih gambar dari galeri lalu unduh ZIP-nya. Proses beberapa sekaligus — file PNG 4K memakai memori besar.',
      },
      {
        question: 'Apakah zip4k gratis?',
        answer:
          'Ya. Tanpa akun, tanpa watermark, tanpa unggah. Alat ini berjalan sepenuhnya di perangkat Anda.',
      },
    ],
  },
  quality: {
    sectionNo: '05',
    title: 'Catatan kualitas',
    body: 'zip4k me-resample dengan filter Lanczos di WebGL untuk tepi yang lebih bersih dibanding penskalaan browser biasa, dengan unsharp mask ringan opsional. Keduanya tidak mengarang detail: sumber 1080p atau lebih besar biasanya tetap layak di 4K; sumber yang sangat kecil tetap akan terlihat lembut. Tidak ada AI dalam prosesnya.',
  },
  footer: {
    note: 'zip4k adalah alat independen untuk kontributor stok. Tidak berafiliasi dengan PNGTree.',
    meta: ['3840 × 2160', 'PNG', 'ZIP per gambar'],
    blogHref: '/id/blog/',
    blogLabel: 'Blog',
  },
};
