import { Request, Response } from 'express';
import * as PortalModel from '../models/portalModel';

// 1. GET /api/portal/beranda
export async function getBerandaStats(req: Request, res: Response): Promise<Response> {
  try {
    const stats = await PortalModel.getPendaftaranStats();
    return res.status(200).json({
      success: true,
      message: 'Berhasil mengambil statistik Beranda Portal PMB.',
      data: {
        ...stats,
        informasi_umum: 'Selamat datang di Portal PMB (Penerimaan Mahasiswa Baru) Universitas Adiwidya Academy.',
      },
    });
  } catch (error) {
    console.error('Error saat mengambil statistik beranda:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan internal di server',
    });
  }
}

// 2. GET /api/portal/informasi
export async function getInformasiJadwal(req: Request, res: Response): Promise<Response> {
  try {
    // Ambil data Informasi & Jadwal Seleksi PMB dari database
    const jadwalPendaftaran = await PortalModel.getJadwal();
    const persyaratanPendaftaran = await PortalModel.getPersyaratan();

    return res.status(200).json({
      success: true,
      message: 'Berhasil mengambil informasi dan jadwal seleksi PMB.',
      data: {
        jadwal: jadwalPendaftaran,
        persyaratan: persyaratanPendaftaran,
      },
    });
  } catch (error) {
    console.error('Error saat mengambil informasi portal:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan internal di server',
    });
  }
}

// 3. GET /api/portal/status
export async function getStatusSeleksi(req: Request, res: Response): Promise<Response> {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Akses ditolak. Silahkan login terlebih dahulu',
      });
    }

    const userId = req.user.id;
    const status = await PortalModel.getStatusByUserId(userId);

    if (!status) {
      return res.status(404).json({
        success: false,
        message: 'Data pengguna tidak ditemukan.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Berhasil mengambil status seleksi pendaftaran.',
      data: status,
    });
  } catch (error) {
    console.error('Error saat mengambil status seleksi:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan internal di server',
    });
  }
}

// 4. PUT /api/portal/admin/status/:userId (Khusus Admin)
export async function updateStatusSeleksi(req: Request, res: Response): Promise<Response> {
  try {
    const { userId } = req.params;
    const { status_verifikasi, status_kelulusan, catatan } = req.body;

    const dataUpdate: Partial<PortalModel.StatusPendaftaran> = {};

    if (status_verifikasi !== undefined) {
      const allowedVerifikasi = ['belum_diverifikasi', 'diverifikasi', 'ditolak'];
      if (!allowedVerifikasi.includes(status_verifikasi)) {
        return res.status(400).json({
          success: false,
          message: 'Status verifikasi tidak valid! Harus salah satu dari: ' + allowedVerifikasi.join(', '),
        });
      }
      dataUpdate.status_verifikasi = status_verifikasi;
    }

    if (status_kelulusan !== undefined) {
      const allowedKelulusan = ['proses', 'lulus', 'tidak_lulus', 'aktif'];
      if (!allowedKelulusan.includes(status_kelulusan)) {
        return res.status(400).json({
          success: false,
          message: 'Status kelulusan tidak valid! Harus salah satu dari: ' + allowedKelulusan.join(', '),
        });
      }
      dataUpdate.status_kelulusan = status_kelulusan;
    }

    if (catatan !== undefined) {
      dataUpdate.catatan = catatan;
    }

    if (Object.keys(dataUpdate).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Tidak ada data status yang dikirim untuk diubah!',
      });
    }

    const userUpdated = await PortalModel.updateStatus(userId as string, dataUpdate);

    return res.status(200).json({
      success: true,
      message: 'Berhasil memperbarui status pendaftaran calon mahasiswa.',
      data: userUpdated,
    });
  } catch (error) {
    console.error('Error saat mengupdate status pendaftaran:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan internal di server',
    });
  }
}

// 5. GET /api/portal/pengumuman
export async function getPortalPengumuman(req: Request, res: Response): Promise<Response> {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Akses ditolak. Silahkan login terlebih dahulu',
      });
    }

    const data = await PortalModel.getPengumuman();

    return res.status(200).json({
      success: true,
      message: 'Berhasil mengambil daftar pengumuman.',
      data
    });
  } catch (error) {
    console.error('Error saat mengambil pengumuman portal:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan internal di server',
    });
  }
}

// 6. GET /api/portal/pengumuman/:id
export async function getPortalPengumumanDetail(req: Request, res: Response): Promise<Response> {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Akses ditolak. Silahkan login terlebih dahulu',
      });
    }

    const { id } = req.params;
    const pengumuman = await PortalModel.getPengumumanById(id as string);

    if (!pengumuman) {
      return res.status(404).json({
        success: false,
        message: 'Pengumuman tidak ditemukan!',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Berhasil mengambil detail pengumuman.',
      data: pengumuman
    });
  } catch (error) {
    console.error('Error saat mengambil detail pengumuman portal:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan internal di server',
    });
  }
}
