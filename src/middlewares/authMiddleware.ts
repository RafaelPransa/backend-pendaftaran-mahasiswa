import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Satpam Umum: Mengecek apakah pengguna sudah login (punya token JWT sah)
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Ambil token dari header 'Authorization'
    // Format standar industri: "Bearer <TOKEN_JWT_DI_SINI>"
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    // Jika token tidak disertakan oleh Frontend
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Akses ditolak. Token tidak ditemukan, silahkan login terlebih dahulu',
      });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    // Verifikasi token menggunakan kunci rahasi dari .env (JWT_SECRET)
    jwt.verify(token, secret, (err, decodedUser) => {
      if (err) {
        return res.status(403).json({
          success: false,
          message: 'Token tidak sah atau sudah kadaluarsa',
        });
      }

      // Jika token sah, simpan data user (id & role) ke dalam objek 'req.user'
      // agar bisa dibaca oleh controller berikutnya
      req.user = decodedUser as { id: string; role: string };

      // Lanjutkan ke fungsi controller asli
      next();
    });
  } catch (error) {
    console.error('Error pada auth middleware:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan sistem keamanan backend',
    });
  }
};

export const authenticateRoles = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // req.user didapatkan dari hasil lolos middleware umum di atas
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Akses dilarang. Anda tidak memiliki izin untuk mengakses fitur ini!',
      });
    }
    next();
  };
};
