const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Simpan file secara lokal
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './src/public/uploads';

    // Skenario Profesional: Jika folder belum ada, otomatis buat foldernya lewat kode
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    cb(null, dir);
  },
  filename: (req, file, cb) => {
    // Mengubah nama file menjadi unik: idUser-timestamp-namaAsli.ekstensi
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

// Filter Validasi: Hanya izinkan file Gambar (JPG/PNG) atau PDF
const filterFile = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase(),
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(
      new Error(
        'Format file tidak didukung! Hanya diperbolehkan mengunggah JPG, PNG atau PDF.',
      ),
    );
  }
};

// Batasi ukuran file
const upload = multer({
  storage: storage,
  fileFilter: filterFile,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});

module.exports = upload;
