import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';

// Simpan file secara lokal
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    const dir = './src/public/uploads';

    // Skenario Profesional: Jika folder belum ada, otomatis buat foldernya lewat kode
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    cb(null, dir);
  },
  filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    // Mengubah nama file menjadi unik: idUser-timestamp-namaAsli.ekstensi
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

// Filter Validasi: Hanya izinkan file Gambar (JPG/PNG) atau PDF
const filterFile = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
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
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

export default upload;
