import { rateLimit } from 'express-rate-limit';

// 1. Limiter Khusus Otorisasi (Login & Register) - Proteksi dari Brute-Force
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // Rentang waktu: 15 menit
  max: 10, // Maksimal 10 request per IP dalam 15 menit
  message: {
    success: false,
    message: 'Terlalu banyak percobaan masuk/daftar. Silakan coba lagi setelah 15 menit.',
  },
  standardHeaders: true, // Kembalikan info rate limit di header `RateLimit-*`
  legacyHeaders: false, // Nonaktifkan header `X-RateLimit-*` lama
});

// 2. Limiter Khusus Upload Dokumen - Proteksi dari spamming file besar
export const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 15, // Maksimal 15 kali upload per IP dalam 15 menit
  message: {
    success: false,
    message: 'Batas unggah berkas terlampaui. Silakan coba lagi setelah 15 menit.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// 3. Limiter Umum untuk API Lainnya - Proteksi dari DoS Attack
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 150, // Maksimal 150 request per IP dalam 15 menit
  message: {
    success: false,
    message: 'Terlalu banyak permintaan ke server. Silakan coba lagi nanti.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
