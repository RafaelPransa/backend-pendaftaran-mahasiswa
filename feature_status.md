# Status Implementasi Fitur Backend

Dokumen ini memetakan fitur-fitur pada backend pendaftaran mahasiswa versi 2 berdasarkan analisis desain halaman guest dan mahasiswa.

---

## 🔑 1. Autentikasi & Akun (Auth)
Modul untuk penanganan registrasi, login, dan pembatasan hak akses (otorisasi).

| Fitur | Status | Endpoint | Deskripsi |
| :--- | :---: | :--- | :--- |
| **Registrasi Akun Baru** | ✅ | `POST /api/auth/register` | Mendaftarkan akun mahasiswa baru dengan hash sandi (bcrypt) dan pengecekan duplikasi NIK/Email. |
| **Masuk Akun (Login)** | ✅ | `POST /api/auth/login` | Autentikasi kredensial pengguna dan mengembalikan Token JWT (berlaku 24 jam). |
| **Token Guard (Middleware)** | ✅ | *Internal* (`authenticateToken`) | Memvalidasi integritas dan masa berlaku JWT sebelum mengakses endpoint yang dilindungi. |
| **Role Guard (Middleware)** | ✅ | *Internal* (`authenticateRoles`) | Memvalidasi role pengguna secara dinamis dari token JWT apakah cocok dengan daftar role yang diperbolehkan. |

---

## 📝 2. Formulir Pendaftaran & Biodata
Modul untuk pengisian data diri calon mahasiswa baru.

| Fitur | Status | Endpoint | Deskripsi |
| :--- | :---: | :--- | :--- |
| **Mengisi Biodata** | ✅ | `POST /api/biodata/biodata` | Menyimpan biodata lengkap calon mahasiswa ke database. |
| **Proteksi Double Input** | ✅ | *Internal Model* (`findByUserId`) | Mencegah calon mahasiswa mengisi biodata lebih dari satu kali. |
| **Ubah/Edit Biodata** | ✅ | `PUT /api/biodata/biodata` | API untuk memperbarui biodata jika ada kesalahan input setelah disimpan. |

---

## 📂 3. Unggah Dokumen Persyaratan (Stepper Step 1 - 5)
Modul pengunggahan dokumen pendaftaran calon mahasiswa secara bertahap.

| Fitur | Status | Endpoint | Deskripsi |
| :--- | :---: | :--- | :--- |
| **Unggah Dokumen Gabungan** | ✅ | `POST /api/dokumen/` | Mengunggah dokumen pendaftaran (`ktp`, `kartu_keluarga`, `ijazah_skl`, `pas_foto`) secara bertahap atau sekaligus. |
| **Cek Kelengkapan Dokumen** | ✅ | `GET /api/dokumen` | Mengambil status file dokumen yang sudah diunggah oleh user. |
| **Penyimpanan Berkas Fisik** | ✅ | *Internal* (`Multer Storage`) | Menyimpan file secara lokal ke folder `./src/public/uploads` dengan penamaan file yang unik. |
| **Validasi Format & Ukuran** | ✅ | *Internal* (`uploadMiddleware`) | Membatasi file hanya berformat JPG, PNG, atau PDF dengan ukuran maksimal 2MB per file. |
| **Otomatis Insert / Update** | ✅ | *Internal Model* (`saveOrUpdate`) | Mengubah nama file secara dinamis jika berkas diunggah ulang tanpa membuat baris ganda di database. |

---

## 📢 4. Portal PMB & Status Seleksi (Calon Mahasiswa / Guest)
Modul informasi publik dan pemantauan status seleksi pendaftaran.

| Fitur | Status | Endpoint | Deskripsi |
| :--- | :---: | :--- | :--- |
| **Beranda Portal PMB (Landing API)**| ✅ | `GET /api/portal/beranda` | API statistik pendaftaran PMB untuk halaman beranda utama. |
| **Informasi & Jadwal Pendaftaran** | ✅ | `GET /api/portal/informasi` | API dinamis untuk daftar linimasa (jadwal) & dokumen persyaratan. |
| **Status Verifikasi & Seleksi** | ✅ | `GET /api/portal/status` | API untuk calon mahasiswa melihat status berkas & kelulusan mereka. |
| **Admin Update Status** | ✅ | `PUT /api/portal/admin/status/:userId` | API khusus admin untuk memverifikasi berkas & kelulusan pendaftar. |

---

## 🎓 5. Portal Akademik (Mahasiswa Aktif)
Modul pasca-kelulusan untuk menunjang kegiatan perkuliahan harian mahasiswa.

| Fitur | Status | Endpoint | Deskripsi |
| :--- | :---: | :--- | :--- |
| **Dashboard Akademik** | ✅ | `GET /api/akademik/dashboard` | API ringkasan IPK, total SKS, SKS aktif, dan pengumuman akademik. |
| **Kartu Rencana Studi (KRS)** | ✅ | `GET /api/akademik/krs` | API untuk mengelola, melihat, dan memprogram KRS mahasiswa. |
| **Kartu Hasil Studi (KHS)** | ✅ | `GET /api/akademik/khs` | API untuk melihat nilai dan IPS per semester. |
| **Transkrip Nilai** | ✅ | `GET /api/akademik/transkrip` | API transkrip nilai kumulatif keseluruhan mata kuliah (IPK). |
| **Keuangan (Tagihan UKT)** | ✅ | `GET /api/akademik/keuangan` | API tagihan UKT semesteran beserta status dan simulasi pembayaran. |
| **Forum Diskusi** | ✅ | `/api/akademik/forum/*` | API forum interaktif (membuat thread baru dan mengirim balasan diskusi). |
