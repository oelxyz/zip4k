import type { HomeContent } from './types';

export const id: HomeContent = {
  lang: 'id',
  path: '/id/',
  skipLabel: 'Lewati ke alat',
  seo: {
    title: 'zip4k — Siap ZIP 4K PNGTree: gambar landscape ke 3840×2160 PNG per ZIP',
    description:
      'Untuk kontributor PNGTree: potong gambar landscape ke 16:9, ubah ukuran ke tepat 3840×2160, ekspor PNG, dan unduh satu ZIP siap unggah per gambar. Alat independen, tidak berafiliasi dengan PNGTree. Tanpa unggah, tanpa AI.',
    ogTitle: 'zip4k — Paket landscape 4K siap PNGTree, satu ZIP per gambar',
    ogDescription:
      'Potong tengah ke 16:9, ubah ukuran ke tepat 3840×2160, ekspor PNG, dan unduh satu ZIP siap unggah per gambar untuk PNGTree. Berjalan lokal di browser.',
    ogLocale: 'id_ID',
    ogLocaleAlternate: 'en_US',
    browserRequirements: 'Membutuhkan browser modern dengan dukungan WebGL2 atau Canvas 2D',
  },
  masthead: {
    homeLabel: 'Beranda zip4k',
    note: 'landscape → 3840×2160',
    blogHref: '/id/blog/',
    blogLabel: 'Blog',
    languageLabel: 'Bahasa',
    themeLabel: 'Ganti mode terang atau gelap',
  },
  hero: {
    kicker: 'Alat independen untuk kontributor PNGTree',
    headlines: ['Gambar landscape jadi 4K.', 'Satu ZIP per file.'],
    lede: 'zip4k memusatkan foto landscape ke 16:9, me-resample ke tepat 3840 × 2160, dan mengemas setiap PNG dalam ZIP sendiri untuk diunggah ke PNGTree. Tidak ada berkas yang diunggah ke server.',
    tags: ['Tanpa unggah', 'Tanpa AI', 'Output PNG', 'ZIP per gambar'],
    demoLabel: 'Demo resample langsung',
    demoStatus: '3840×2160 · 16:9',
    demoCopy:
      'Potong tengah menjaga komposisi tetap utuh. Hasilnya adalah ZIP standar siap PNGTree: gambar sumber, bingkai 4K tepat, dan sampling Lanczos.',
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
      {
        label: 'Cek unggah PNGTree',
        html: 'Rasio landscape dinormalisasi ke 16:9; keluaran tepat 4K dan dikirim sebagai satu ZIP per gambar.',
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
          'Tidak. Prosesnya memakai resampling Lanczos di WebGL dengan unsharp mask ringan opsional; tidak ada detail yang dikarang. Sumber 1080p atau lebih biasanya tetap bersih di 4K; sumber yang sangat kecil bisa terlihat lembut.',
      },
      {
        question: 'Bagaimana foto yang bukan 16:9?',
        answer:
          'Foto dipotong di tengah ke rasio 16:9 sebelum diubah ukurannya. Bagian yang dipangkas sama banyak dari kiri dan kanan, atau dari atas dan bawah, tergantung rasio aslinya.',
      },
      {
        question: 'Apakah ini alat resmi PNGTree?',
        answer:
          'Bukan. zip4k bersifat independen dan tidak berafiliasi dengan PNGTree. Alat ini menyiapkan paket gambar yang kemudian diunggah kontributor ke PNGTree.',
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
    sectionNo: '',
    title: 'Checklist unggah PNGTree',
    body: 'Sebelum mengunggah, zip4k memberi kontributor paket yang deterministik: komposisi 16:9 terpotong di tengah, PNG tepat 3840 × 2160, satu ZIP per gambar, dan pemrosesan lokal tanpa akun atau AI. Sampling Lanczos menjaga tepi tetap bersih; tidak mengarang detail, jadi periksa resolusi sumber sebelum mengirim.',
  },
  footer: {
    note: 'zip4k adalah alat independen untuk kontributor PNGTree. Tidak berafiliasi dengan PNGTree.',
    openSourcePrefix: 'Open source · MIT · Dikembangkan oleh ',
    githubRepoHref: 'https://github.com/oelxyz/zip4k',
    githubRepoLabel: 'GitHub repo',
    openSourceSeparator: ' · ',
    githubProfileHref: 'https://github.com/oelxyz',
    githubProfileLabel: '@oelxyz',
    credit: 'Tipografi: Fraunces · Literata · Plus Jakarta Sans',
    meta: ['3840 × 2160', 'PNG', 'ZIP per gambar'],
  },
};
