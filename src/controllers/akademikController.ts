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
