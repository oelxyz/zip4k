---
title: 'Cara menggunakan zip4k: gambar landscape jadi PNG 3840×2160, satu ZIP per file'
description: 'Panduan langkah demi langkah mengubah foto landscape menjadi paket PNG 4K tepat dengan zip4k, untuk kontributor PNGTree dan fotografer stok lainnya.'
lang: id
pubDate: 2026-11-07
draft: false
---

zip4k adalah alat kecil gratis untuk kontributor yang menyiapkan foto landscape sebelum diunggah: foto dipotong di tengah ke 16:9, di-resample tepat ke **3840 × 2160**, lalu diunduh sebagai **ZIP** berisi satu PNG. Semua proses berjalan di browser Anda — tidak ada yang diunggah, dan tidak ada AI di dalam pipeline.

![Halaman utama zip4k dengan demo resample langsung](/blog/how-to-use-zip4k-hero.png)

## 1. Tambahkan gambar Anda

Buka alatnya, lalu tarik foto landscape ke zona drop, atau klik untuk memilih (JPG, PNG, WebP). Anda bisa menambahkan banyak file sekaligus; semuanya diproses satu per satu agar memori tetap terkendali.

![Zona drop dengan satu gambar selesai di antrean](/blog/how-to-use-zip4k-tool.png)

## 2. Pilih hasil akhir

Kontrol **Hasil akhir** berada di antara zona drop dan antrean:

- **Natural** — resampling Lanczos langsung, tanpa penajaman tambahan.
- **Tegas** (bawaan) — Lanczos plus unsharp mask ringan yang membuat tepi sedikit lebih tegas. Ia tidak mengarang detail.

Sampling Lanczos dipakai karena menjaga tepi tetap lebih bersih daripada penskalaan browser biasa saat foto membesar menuju 4K.

## 3. Unduh satu ZIP per gambar

Setelah setiap file selesai, barisnya menampilkan status hijau **READY** dan tombol **DOWNLOAD ZIP**. Hasilnya dinamai mengikuti file sumber, misalnya `gunung-3840x2160.zip`, berisi satu PNG:

- tepat **3840 × 2160 px**;
- **16:9** setelah potong tengah (margin sama di kiri/kanan atau atas/bawah);
- format **PNG**.

Gunakan **UNDUH SEMUA ZIP** untuk mengambil semua file yang selesai sekaligus, atau **BERSIHKAN** untuk mengosongkan antrean.

## Di ponsel

Seluruh alur bisa dipakai di ponsel: pilih foto, biarkan tiap file dirender, lalu unduh. Jaga batch tetap kecil — beberapa file sekaligus — karena PNG 4K memakai memori besar.

![Alat di ponsel, dengan kontrol Hasil akhir dan antrean kosong](/blog/how-to-use-zip4k-mobile.png)

## Yang bisa diharapkan dari hasil

zip4k mengubah ukuran; ia tidak menambah detail yang memang tidak ada. Sumber 1080p atau lebih biasanya tetap layak di 4K, sedangkan sumber yang sangat kecil akan tetap terlihat lembut. Jika sumber Anda di bawah 4K di kedua sisinya, harapkan perbaikan kecil pada ketajaman tepi, bukan keajaiban.

Untuk kontributor PNGTree, paketnya tetap deterministik dan lokal: masukan yang sama selalu menghasilkan PNG 4K yang sama, tanpa akun, tanpa watermark, dan tanpa unggah. zip4k bersifat independen dan tidak berafiliasi dengan PNGTree; alat ini hanya menyiapkan paket yang Anda unggah di sana.
