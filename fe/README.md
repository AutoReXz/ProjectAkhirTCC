# Platform Belajar Bahasa Asing - Frontend

Aplikasi frontend sederhana untuk platform belajar bahasa asing menggunakan HTML, CSS, dan JavaScript murni (tanpa framework).

## Fitur

- Autentikasi (login & register)
- Daftar materi pembelajaran
- Detail materi dengan konten lengkap
- Kuis interaktif untuk setiap materi
- Sistem komentar
- Halaman progress belajar pengguna

## Struktur Direktori

```
├── index.html              # Halaman beranda
├── login.html              # Halaman login
├── register.html           # Halaman registrasi
├── lesson.html             # Halaman detail materi & kuis
├── progress.html           # Halaman progress belajar
├── app.yaml                # Konfigurasi untuk deployment App Engine
├── assets/
│   ├── css/
│   │   └── style.css       # File CSS utama
│   └── js/
│       ├── config.js       # Konfigurasi API endpoints
│       ├── api.js          # Service untuk API calls
│       └── ui.js           # Helper untuk UI
```

## Menjalankan Aplikasi Secara Lokal

### Menggunakan server lokal sederhana:

1. Pastikan Python sudah terinstal di komputer Anda
2. Buka terminal atau command prompt
3. Arahkan ke direktori proyek
4. Jalankan server lokal dengan perintah berikut:

   ```
   python -m http.server 8080
   ```

5. Buka browser dan akses `http://localhost:8080`

### Menggunakan Visual Studio Code Live Server:

1. Install ekstensi Live Server di VS Code
2. Buka folder proyek di VS Code
3. Klik kanan file `index.html`
4. Pilih "Open with Live Server"

## Deployment ke Google App Engine

1. Pastikan Google Cloud SDK sudah terinstal
2. Login ke Google Cloud:

   ```bash
   gcloud auth login
   ```

3. Set project Google Cloud Anda:

   ```bash
   gcloud config set project [PROJECT_ID]
   ```

4. Deploy aplikasi ke App Engine:

   ```bash
   gcloud app deploy
   ```

5. Setelah deployment selesai, akses aplikasi dengan perintah:

   ```bash
   gcloud app browse
   ```

## Menghubungkan ke Backend

Secara default, aplikasi menggunakan URL backend lokal (`http://localhost:3000/api`). Untuk menghubungkan dengan backend produksi:

1. Buka file `assets/js/config.js`
2. Ubah `BASE_URL` dengan URL backend produksi Anda:

   ```javascript
   const API_CONFIG = {
       BASE_URL: "https://<URL_BACKEND_PRODUKSI>/api",
       // ...
   };
   ```

## Catatan Penting

- Semua komunikasi dengan API menggunakan Fetch API
- Token autentikasi disimpan di localStorage browser
- Aplikasi menangani refresh token otomatis jika token kedaluwarsa
- Format data mengikuti dokumentasi API backend di `api.md`
