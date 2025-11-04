# Sharing Story App (Berbagi Cerita)

![Logo Aplikasi](/public/images/logo.png?raw=true "Logo Aplikasi")

**Sharing Story** adalah Progressive Web App (PWA) *offline-first* yang memungkinkan pengguna untuk membagikan cerita dan momen mereka. Pengguna dapat mendaftar, login, memposting cerita baru lengkap dengan foto dan lokasi, serta melihat cerita dari pengguna lain.

Aplikasi ini dibangun sebagai **SPA (Single-Page Application)** dengan JavaScript murni (ES6+), mengadopsi arsitektur **Web Components** dan pola **MVP (Model-View-Presenter)**. Aplikasi ini *installable*, memiliki fungsionalitas *offline* penuh menggunakan **Service Worker** dan **IndexedDB**, serta mendukung **Push Notification**.

## ✨ Fitur Utama

### Fungsionalitas Inti
- **Sistem Autentikasi:** Fungsionalitas Register & Login pengguna.
- **Login Persisten:** Fitur "Ingat saya" menggunakan `localStorage` untuk sesi yang permanen.
- **Feed Cerita:** Menampilkan daftar cerita dari semua pengguna dalam bentuk *card feed*.
- **Peta Interaktif:** Menampilkan semua cerita dengan lokasi di peta interaktif (Leaflet.js).
- **Halaman Detail Cerit-a:** Tampilan detail untuk setiap cerita, lengkap dengan peta mini dan **Reverse Geocoding** (menggunakan MapTiler) untuk menampilkan nama lokasi.
- **Tambah Cerita:** Fungsionalitas untuk mengunggah cerita baru dengan deskripsi dan foto.
- **Integrasi Kamera:** Mengambil foto langsung dari kamera perangkat (via Media Stream API).
- **Pemilih Lokasi:** Memilih lokasi cerita dengan mengklik peta saat membuat postingan baru.
- **Arsitektur SPA:** Navigasi antar halaman instan tanpa *reload* (Hash Routing).

### Fitur PWA & Advanced (Kriteria Bintang 5)
- **Installable (PWA):** Dapat di-install di perangkat *desktop* maupun *mobile* melalui *Web App Manifest* yang kaya (termasuk *shortcuts* dan *screenshots*).
- **Offline-First:** Aplikasi dapat diakses dan digunakan secara penuh bahkan saat *offline*.
- **Caching Cerdas (Workbox):** Menerapkan strategi *caching* yang berbeda untuk aset yang berbeda:
    - **App Shell** (`CacheFirst`): Aset inti (HTML, CSS, JS) dimuat dari *cache* terlebih dahulu.
    - **API Data (`NetworkFirst`)**: Data cerita selalu mencoba mengambil dari jaringan terlebih dahulu, namun beralih ke *cache* jika *offline*.
    - **API Gambar (`StaleWhileRevalidate`)**: Gambar dimuat instan dari *cache* sambil diperbarui di latar belakang.
    - **Font & Peta (`CacheFirst`)**: Aset statis seperti *font* dan *map tiles* disimpan permanen di *cache*.
- **Push Notification (Kriteria 2):**
    - **Toggle Berlangganan:** Tombol untuk mengaktifkan atau menonaktifkan *push notification*.
    - **Notifikasi Dinamis:** Menerima *event push* dari *service worker*.
    - **Aksi Notifikasi:** Notifikasi memiliki tombol "Lihat Detail" yang akan membuka aplikasi dan menavigasi ke halaman cerita yang relevan.
- **Notifikasi Lokal:** Menampilkan notifikasi instan saat pengguna berhasil mengunggah cerita atau menyimpan cerita.
- **Database Sisi Klien (Kriteria 4):**
    - **Cerita Tersimpan:** Pengguna dapat menyimpan cerita favorit mereka untuk dibaca *offline* menggunakan **IndexedDB**.
    - **Fitur Lanjutan:** Halaman "Daftar Cerita" (Online) dan "Cerita Tersimpan" (Offline) memiliki fitur *real-time*:
        - **Pencarian (Search):** Filter cerita berdasarkan nama atau deskripsi.
        - **Pengurutan (Sort):** Urutkan cerita dari yang terbaru atau terlama.

## 🛠️ Teknologi yang Digunakan

- **Frontend:** HTML5, CSS3, JavaScript (ES6+ Modules)
- **Build Tool:** Node.js, Webpack 5
- **Arsitektur:** Web Components (Native) & MVP (Model-View-Presenter)
- **PWA:** Service Worker & Workbox, Web App Manifest
- **Database Lokal:** IndexedDB (melalui library `idb`)
- **Library Peta:** Leaflet.js
- **Geocoding:** MapTiler API
- **Library UI:** Font Awesome (Ikon), SweetAlert2 (Popup)
- **API Eksternal:** Dicoding Story API

## 🚀 Instalasi dan Menjalankan Proyek

Pastikan Anda memiliki **Node.js** (v18+) dan **npm** terinstal di sistem Anda.

1.  **Clone repositori ini:**
    ```bash
    git clone https://[URL_REPOSITORY_ANDA].git
    cd [NAMA_FOLDER_PROYEK]
    ```

2.  **Instal semua dependensi:**
    ```bash
    npm install
    ```

3.  **(PENTING) Buat file konfigurasi:**
    Buat file di `src/globals/config.js` dan isi dengan API Key Anda:
    ```javascript
    const Config = {
        BASE_URL: '[https://story-api.dicoding.dev/v1](https://story-api.dicoding.dev/v1)',
        MAPTILER_API_KEY: 'MASUKKAN_API_KEY_MAPTILER_ANDA',
        VAPID_PUBLIC_KEY: 'MASUKKAN_VAPID_KEY_DARI_DICODING_API',
    };
    export default Config;
    ```

## 📜 Skrip yang Tersedia

Di dalam direktori proyek, Anda dapat menjalankan:

### `npm run start-dev`

Menjalankan aplikasi dalam mode pengembangan.
Buka [http://localhost:8080](http://localhost:8080). Server akan otomatis me-*reload* jika Anda membuat perubahan pada kode.

### `npm run build`

Membangun aplikasi untuk produksi ke dalam folder `/dist`.
Ini akan mengoptimasi *file*, me-*minify* kode, dan menyuntikkan *logic* Service Worker (Workbox).

### `npm run serve`

Menjalankan server statis (`http-server`) untuk menyajikan file dari folder `/dist`. Ini adalah cara terbaik untuk menguji *build* produksi dan fungsionalitas PWA/Offline Anda secara lokal.

### `npm run deploy`

Membangun aplikasi (menjalankan `npm run build`) lalu secara otomatis men-*deploy* hasilnya ke GitHub Pages.

## 🌟 Tentang Pembuat

- **Nama:** Alamahul Bayan
- **Institusi:** Teknik Informatika Institut Teknologi Garut
- **Email:** bayanalamahul3@gmail.com
- **GitHub:** [github.com/alamahul](https://github.com/alamahul)

---

*Proyek ini dibuat sebagai bagian dari submission "Menjadi Pengembang Web Expert" (Richer PWA) di Dicoding.*