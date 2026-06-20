import { Request, Response } from 'express';
import * as AkademikModel from '../models/akademikModel';

// 1. GET /api/akademik/dashboard
export async function getDashboard(req: Request, res: Response): Promise<Response> {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Akses ditolak. Silahkan login terlebih dahulu',
      });
    }

    const userId = req.user.id;
    const data = await AkademikModel.getDashboardData(userId);

    return res.status(200).json({
      success: true,
      message: 'Berhasil mengambil data Dashboard Akademik.',
      data
    });
  } catch (error) {
    console.error('Error saat mengambil dashboard akademik:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan internal di server',
    });
  }
}

// Feature 2: KRS (Kartu Rencana Studi)

// GET /api/akademik/krs/kelas
export async function getKelasTersedia(req: Request, res: Response): Promise<Response> {
  try {
    const data = await AkademikModel.getAvailableKelas();
    return res.status(200).json({
      success: true,
      message: 'Berhasil mengambil daftar kelas kuliah yang tersedia.',
      data
    });
  } catch (error) {
    console.error('Error saat mengambil kelas tersedia:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan internal di server',
    });
  }
}

// GET /api/akademik/krs
export async function getKrs(req: Request, res: Response): Promise<Response> {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Akses ditolak. Silahkan login terlebih dahulu',
      });
    }

    const userId = req.user.id;
    const data = await AkademikModel.getKrsByUserId(userId);

    return res.status(200).json({
      success: true,
      message: 'Berhasil mengambil KRS Anda.',
      data
    });
  } catch (error) {
    console.error('Error saat mengambil KRS:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan internal di server',
    });
  }
}

// POST /api/akademik/krs
export async function simpanKrs(req: Request, res: Response): Promise<Response> {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Akses ditolak. Silahkan login terlebih dahulu',
      });
    }

    const userId = req.user.id;
    const { kelas_ids, semester, tahun_akademik } = req.body;

    if (!Array.isArray(kelas_ids)) {
      return res.status(400).json({
        success: false,
        message: 'Parameter kelas_ids harus berupa array!',
      });
    }

    if (!semester || !tahun_akademik) {
      return res.status(400).json({
        success: false,
        message: 'Kolom semester dan tahun_akademik wajib diisi!',
      });
    }

    const krsDiambil = await AkademikModel.enrollKrs(userId, kelas_ids, semester, tahun_akademik);

    return res.status(200).json({
      success: true,
      message: 'KRS Anda berhasil disimpan!',
      data: krsDiambil
    });
  } catch (error) {
    console.error('Error saat menyimpan KRS:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan internal di server saat menyimpan KRS.',
    });
  }
}

// Feature 3: KHS (Kartu Hasil Studi)
// GET /api/akademik/khs
export async function getKhs(req: Request, res: Response): Promise<Response> {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Akses ditolak. Silahkan login terlebih dahulu',
      });
    }

    const userId = req.user.id;
    const semesterStr = req.query.semester;

    if (!semesterStr) {
      return res.status(400).json({
        success: false,
        message: 'Query parameter semester wajib disertakan!',
      });
    }

    const semester = parseInt(semesterStr as string, 10);
    if (isNaN(semester)) {
      return res.status(400).json({
        success: false,
        message: 'Parameter semester harus berupa angka!',
      });
    }

    const data = await AkademikModel.getKhsBySemester(userId, semester);

    return res.status(200).json({
      success: true,
      message: `Berhasil mengambil KHS untuk semester ${semester}.`,
      data
    });
  } catch (error) {
    console.error('Error saat mengambil KHS:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan internal di server',
    });
  }
}

// Feature 4: Transkrip Nilai
// GET /api/akademik/transkrip
export async function getTranskrip(req: Request, res: Response): Promise<Response> {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Akses ditolak. Silahkan login terlebih dahulu',
      });
    }

    const userId = req.user.id;
    const data = await AkademikModel.getTranskripData(userId);

    return res.status(200).json({
      success: true,
      message: 'Berhasil mengambil Transkrip Nilai kumulatif.',
      data
    });
  } catch (error) {
    console.error('Error saat mengambil transkrip:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan internal di server',
    });
  }
}
