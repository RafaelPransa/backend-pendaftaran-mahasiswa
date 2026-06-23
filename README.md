# Backend Sistem Pendaftaran Mahasiswa (PMB) & Portal Akademik

Repositori ini berisi server backend untuk **Sistem Penerimaan Mahasiswa Baru (PMB) dan Portal Akademik Mahasiswa Aktif**, lengkap dengan **Portal Administrasi/Staff**. Aplikasi backend ini dirancang secara modular, aman, dan berkinerja tinggi menggunakan teknologi JavaScript/TypeScript modern.

---

## 🚀 Fitur Utama (Key Features)
1. **Autentikasi & Otorisasi:** Sistem pendaftaran akun baru, login terenkripsi, serta pembatasan akses berbasis peran (*Role Guard Middleware*) untuk `student` dan `admin`.
2. **Pengelolaan Biodata & Nilai Rapor:** Mengisi dan mengedit biodata lengkap serta nilai rapor semester 1 s.d 5 bagi calon mahasiswa baru.
3. **Manajemen Berkas Dokumen:** Upload scan KTP, KK, Ijazah/SKL, dan Pas Foto secara aman menggunakan Multer.
4. **Alur Pendaftaran PMB:** Melacak status seleksi pendaftaran mahasiswa secara real-time.
5. **Portal Akademik Mahasiswa Aktif:**
   - **Kartu Rencana Studi (KRS):** Mengisi, mengedit, dan mengajukan KRS semester berjalan berdasarkan kelas mata kuliah yang tersedia.
   - **Kartu Hasil Studi (KHS) & Transkrip:** Melihat riwayat nilai per semester beserta indeks prestasi kumulatif (IPK).
   - **Keuangan (UKT):** Mengecek jumlah tagihan, riwayat bayar, dan simulasi pembayaran UKT.
   - **Forum Diskusi:** Wadah komunikasi akademik berupa pembuatan utas (*threads*) dan komentar balasan (*replies*).
6. **Portal Administrasi (Admin Panel):**
   - Dashboard analitik grafik pendaftaran dan statistik favorit program studi.
   - Antrean verifikasi dokumen masuk per berkas (KTP, KK, dll.).
   - Antrean persetujuan KRS mahasiswa (Setuju, Tolak, Minta Revisi).
   - Manajemen CRUD Program Studi dan CRUD Pengumuman Akademik/PMB.
   - Pengelolaan kelulusan pendaftar dan ekspor data dalam format CSV.
   - Fitur keamanan reset kata sandi staff.

---

## 🛠️ Tech Stack yang Digunakan
- **Runtime Environment:** [Bun.js](https://bun.sh/) (Runtime modern, cepat, dan native TypeScript)
- **Programming Language:** [TypeScript](https://www.typescriptlang.org/) (Static typing untuk keamanan kode)
- **Backend Framework:** [Express.js](https://expressjs.com/) (Framework router minimalis)
- **Database Query Builder:** [Knex.js](https://knexjs.org/) (SQL query builder & migrasi database)
- **Database Engine:** [PostgreSQL](https://www.postgresql.org/) (Sistem database relasional tangguh)
- **Library Tambahan:**
  - `bcrypt` — Enkripsi password searah
  - `jsonwebtoken` (JWT) — Otentikasi sesi berbasis token stateless
  - `multer` — Penanganan unggahan file berkas fisik
  - `cors` — Perizinan akses lintas domain (Cross-Origin Resource Sharing)
  - `swagger-ui-express` — Penyajian dokumentasi API interaktif

---

## 📁 Struktur Arsitektur Proyek
Backend ini mengikuti struktur arsitektur berorientasi data yang terbagi secara fungsional:

```text
backend-pendaftaran-mahasiswa/
├── index.ts                      # Entry point aplikasi utama Express
├── tsconfig.json                 # Konfigurasi compiler TypeScript
├── knexfile.ts                   # Konfigurasi koneksi & migrasi database Knex
├── package.json                  # File manifest proyek & daftar dependensi
├── src/
│   ├── config/                   # Pengaturan konfigurasi (misal database)
│   ├── database/
│   │   └── migrations/           # Riwayat migrasi tabel database PostgreSQL
│   ├── types/                    # Deklarasi tipe kustom TypeScript (.d.ts)
│   ├── middlewares/              # Middleware otentikasi (JWT) & upload (Multer)
│   ├── models/                   # Logika query database per objek bisnis (Knex)
│   ├── controllers/              # Pengontrol logika request & response HTTP
│   ├── routes/                   # Pendaftaran API endpoint berdasarkan sub-sistem
│   │   ├── authRoutes.ts         # Endpoint registrasi & login
│   │   ├── biodataRoutes.ts      # Endpoint biodata & nilai rapor
│   │   ├── dokumenRoutes.ts      # Endpoint unggah berkas dokumen
│   │   ├── portalRoutes.ts       # Endpoint status PMB mahasiswa
│   │   ├── akademikRoutes.ts     # Endpoint KRS, KHS, UKT, dan forum mahasiswa aktif
│   │   └── adminRoutes.ts        # Endpoint panel manajemen & dashboard admin
│   ├── public/
│   │   └── uploads/              # Folder penyimpanan berkas terupload (statis)
│   └── swagger.json              # File spesifikasi API OpenAPI 3.0.0
```

---

## ⚙️ Cara Menjalankan Proyek

### 1. Prasyarat (Prerequisites)
Pastikan Anda sudah menginstal:
- [Bun](https://bun.sh/)
- [PostgreSQL](https://www.postgresql.org/) (dan pastikan server PostgreSQL sudah berjalan)

### 2. Setup Environment Variables
Buat file bernama `.env` di direktori utama (root) proyek, dan sesuaikan isinya:
```env
PORT=5000
DATABASE_URL=postgres://username_db:password_db@localhost:5432/nama_database_anda
JWT_SECRET=kunci_rahasia_jwt_sangat_panjang_dan_aman_di_sini
```

### 3. Instalasi Dependensi
Jalankan perintah berikut untuk menginstal seluruh pustaka yang diperlukan:
```bash
bun install
```

### 4. Jalankan Migrasi Database
Gunakan Knex untuk membuat seluruh tabel dan mengisinya dengan data awal (seed program studi & jadwal):
```bash
bun run db:migrate
```

### 5. Jalankan Server Pengembangan
Aktifkan server dalam mode hot-reload (akan me-restart otomatis setiap kali ada perubahan file):
```bash
bun run dev
```
Server akan berjalan di **`http://localhost:5000`**.

### 6. Akses Dokumentasi API (Swagger)
Ketika server sedang berjalan, Anda bisa mengakses visualisasi dan pengujian API interaktif langsung di browser melalui alamat:
👉 **`http://localhost:5000/api-docs`**