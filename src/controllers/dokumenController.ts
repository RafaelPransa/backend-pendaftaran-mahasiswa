import { Request, Response } from 'express';
import * as DokumenModel from '../models/dokumenModel';

export async function uploadBerkas(req: Request, res: Response): Promise<Response> {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Akses ditolak. Silahkan login terlebih dahulu',
      });
    }

    const userId = req.user.id;

    // 1. Validasi awal: Pastikan ada file yang dikirim lewat form-data
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Tidak ada dokumen yang dipilih untuk di-upload!',
      });
    }

    const filesObj = req.files as { [fieldname: string]: Express.Multer.File[] };

    if (Object.keys(filesObj).length > 1) {
      return res.status(400).json({
        success: false,
        message:
          'Penyalahgunaan sistem! Dokumen harus diunggah satu per satu sesuai prosedur.',
      });
    }

    // 2. Mapping data secara dinamis & Tentukan custom message secara spesifik
    const dataOlah: DokumenModel.DokumenData = {};
    let customMessage = '';

    if (filesObj['ktp'] && filesObj['ktp'][0]) {
      dataOlah.ktp = filesObj['ktp'][0].filename;
      customMessage = 'Kartu Tanda Penduduk (KTP) berhasil diunggah!';
    }
    if (filesObj['kartu_keluarga'] && filesObj['kartu_keluarga'][0]) {
      dataOlah.kartu_keluarga = filesObj['kartu_keluarga'][0].filename;
      customMessage = 'Kartu Keluarga (KK) berhasil diunggah!';
    }
    if (filesObj['ijazah_skl'] && filesObj['ijazah_skl'][0]) {
      dataOlah.ijazah_skl = filesObj['ijazah_skl'][0].filename;
      customMessage = 'Ijazah / SKL berhasil diunggah!';
    }
    if (filesObj['pas_foto'] && filesObj['pas_foto'][0]) {
      dataOlah.pas_foto = filesObj['pas_foto'][0].filename;
      customMessage = 'Pas Foto 4x6 berhasil diunggah!';
    }

    // 3. Tembak ke Model
    const hasilBerkas = await DokumenModel.saveOrUpdate(userId, dataOlah);

    // 4. Kembalikan respon sukses dengan customMessage yang dinamis
    return res.status(200).json({
      success: true,
      message: customMessage, // <-- Pakai variabel dinamis di sini!
      data: hasilBerkas,
    });
  } catch (error) {
    console.error('Error saat upload dokumen:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan internal pada server saat memproses file.',
    });
  }
}

// GET /api/dokumen
export async function getDokumen(req: Request, res: Response): Promise<Response> {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Akses ditolak. Silahkan login terlebih dahulu',
      });
    }

    const userId = req.user.id;
    const dokumen = await DokumenModel.findByUserId(userId);

    return res.status(200).json({
      success: true,
      message: 'Berhasil mengambil dokumen persyaratan.',
      data: dokumen || {
        user_id: userId,
        ktp: null,
        kartu_keluarga: null,
        ijazah_skl: null,
        pas_foto: null,
      },
    });
  } catch (error) {
    console.error('Error saat mengambil dokumen:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan internal pada server saat mengambil dokumen.',
    });
  }
}

