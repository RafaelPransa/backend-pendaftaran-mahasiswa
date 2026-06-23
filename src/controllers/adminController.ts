import { Request, Response } from 'express';
import * as AdminModel from '../models/adminModel';

// =========================================================================
// FEATURE 3: CRUD Program Studi
// =========================================================================

export async function ambilSemuaProdi(req: Request, res: Response): Promise<Response> {
  try {
    const data = await AdminModel.getAllProdi();
    return res.status(200).json({
      success: true,
      message: 'Berhasil mengambil daftar program studi.',
      data
    });
  } catch (error) {
    console.error('Error saat mengambil prodi:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan internal di server'
    });
  }
}

export async function ambilDetailProdi(req: Request, res: Response): Promise<Response> {
  try {
    const id = req.params.id as string;
    const prodi = await AdminModel.getProdiById(id);
    if (!prodi) {
      return res.status(404).json({
        success: false,
        message: 'Program studi tidak ditemukan!'
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Berhasil mengambil detail program studi.',
      data: prodi
    });
  } catch (error) {
    console.error('Error saat mengambil detail prodi:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan internal di server'
    });
  }
}

export async function tambahProdi(req: Request, res: Response): Promise<Response> {
  try {
    const { kode, nama, fakultas } = req.body;
    if (!kode || !nama || !fakultas) {
      return res.status(400).json({
        success: false,
        message: 'Kolom kode, nama, dan fakultas wajib diisi!'
      });
    }

    const exist = await AdminModel.getProdiByKode(kode);
    if (exist) {
      return res.status(409).json({
        success: false,
        message: `Program studi dengan kode '${kode}' sudah terdaftar!`
      });
    }

    const prodiBaru = await AdminModel.createProdi({ kode, nama, fakultas });
    return res.status(201).json({
      success: true,
      message: 'Program studi baru berhasil ditambahkan!',
      data: prodiBaru
    });
  } catch (error) {
    console.error('Error saat tambah prodi:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan internal di server'
    });
  }
}

export async function ubahProdi(req: Request, res: Response): Promise<Response> {
  try {
    const id = req.params.id as string;
    const { kode, nama, fakultas } = req.body;

    const prodi = await AdminModel.getProdiById(id);
    if (!prodi) {
      return res.status(404).json({
        success: false,
        message: 'Program studi tidak ditemukan!'
      });
    }

    const dataUpdate: Partial<AdminModel.ProgramStudi> = {};
    if (kode !== undefined) {
      if (kode.trim() === '') {
        return res.status(400).json({ success: false, message: 'Kode tidak boleh kosong!' });
      }
      // Cek apakah kode diubah dan kode baru sudah dipakai prodi lain
      if (kode !== prodi.kode) {
        const exist = await AdminModel.getProdiByKode(kode);
        if (exist) {
          return res.status(409).json({
            success: false,
            message: `Program studi dengan kode '${kode}' sudah terdaftar!`
          });
        }
      }
      dataUpdate.kode = kode;
    }
    if (nama !== undefined) {
      if (nama.trim() === '') {
        return res.status(400).json({ success: false, message: 'Nama tidak boleh kosong!' });
      }
      dataUpdate.nama = nama;
    }
    if (fakultas !== undefined) {
      if (fakultas.trim() === '') {
        return res.status(400).json({ success: false, message: 'Fakultas tidak boleh kosong!' });
      }
      dataUpdate.fakultas = fakultas;
    }

    if (Object.keys(dataUpdate).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Tidak ada data program studi yang dikirim untuk diubah!'
      });
    }

    const prodiDiubah = await AdminModel.updateProdi(id, dataUpdate);
    return res.status(200).json({
      success: true,
      message: 'Program studi berhasil diperbarui!',
      data: prodiDiubah
    });
  } catch (error) {
    console.error('Error saat ubah prodi:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan internal di server'
    });
  }
}

export async function hapusProdi(req: Request, res: Response): Promise<Response> {
  try {
    const id = req.params.id as string;
    const prodi = await AdminModel.getProdiById(id);
    if (!prodi) {
      return res.status(404).json({
        success: false,
        message: 'Program studi tidak ditemukan!'
      });
    }

    await AdminModel.deleteProdi(id);
    return res.status(200).json({
      success: true,
      message: `Program studi '${prodi.nama}' berhasil dihapus.`
    });
  } catch (error) {
    console.error('Error saat hapus prodi:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan internal di server'
    });
  }
}

// =========================================================================
// FEATURE 4: CRUD Pengumuman
// =========================================================================

export async function ambilSemuaPengumuman(req: Request, res: Response): Promise<Response> {
  try {
    const data = await AdminModel.getAllPengumuman();
    return res.status(200).json({
      success: true,
      message: 'Berhasil mengambil daftar pengumuman.',
      data
    });
  } catch (error) {
    console.error('Error saat mengambil pengumuman:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan internal di server'
    });
  }
}

export async function ambilDetailPengumuman(req: Request, res: Response): Promise<Response> {
  try {
    const id = req.params.id as string;
    const pengumuman = await AdminModel.getPengumumanById(id);
    if (!pengumuman) {
      return res.status(404).json({
        success: false,
        message: 'Pengumuman tidak ditemukan!'
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Berhasil mengambil detail pengumuman.',
      data: pengumuman
    });
  } catch (error) {
    console.error('Error saat mengambil detail pengumuman:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan internal di server'
    });
  }
}

export async function tambahPengumuman(req: Request, res: Response): Promise<Response> {
  try {
    const { judul, konten, kategori } = req.body;
    if (!judul || !konten || !kategori) {
      return res.status(400).json({
        success: false,
        message: 'Kolom judul, konten, dan kategori wajib diisi!'
      });
    }

    if (kategori !== 'PMB' && kategori !== 'Akademik') {
      return res.status(400).json({
        success: false,
        message: "Kategori harus salah satu dari: 'PMB' atau 'Akademik'!"
      });
    }

    const pengumumanBaru = await AdminModel.createPengumuman({ judul, konten, kategori });
    return res.status(201).json({
      success: true,
      message: 'Pengumuman baru berhasil ditambahkan!',
      data: pengumumanBaru
    });
  } catch (error) {
    console.error('Error saat tambah pengumuman:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan internal di server'
    });
  }
}

export async function ubahPengumuman(req: Request, res: Response): Promise<Response> {
  try {
    const id = req.params.id as string;
    const { judul, konten, kategori } = req.body;

    const pengumuman = await AdminModel.getPengumumanById(id);
    if (!pengumuman) {
      return res.status(404).json({
        success: false,
        message: 'Pengumuman tidak ditemukan!'
      });
    }

    const dataUpdate: Partial<AdminModel.Pengumuman> = {};
    if (judul !== undefined) {
      if (judul.trim() === '') {
        return res.status(400).json({ success: false, message: 'Judul tidak boleh kosong!' });
      }
      dataUpdate.judul = judul;
    }
    if (konten !== undefined) {
      if (konten.trim() === '') {
        return res.status(400).json({ success: false, message: 'Konten tidak boleh kosong!' });
      }
      dataUpdate.konten = konten;
    }
    if (kategori !== undefined) {
      if (kategori !== 'PMB' && kategori !== 'Akademik') {
        return res.status(400).json({
          success: false,
          message: "Kategori harus salah satu dari: 'PMB' atau 'Akademik'!"
        });
      }
      dataUpdate.kategori = kategori;
    }

    if (Object.keys(dataUpdate).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Tidak ada data pengumuman yang dikirim untuk diubah!'
      });
    }

    const pengumumanDiubah = await AdminModel.updatePengumuman(id, dataUpdate);
    return res.status(200).json({
      success: true,
      message: 'Pengumuman berhasil diperbarui!',
      data: pengumumanDiubah
    });
  } catch (error) {
    console.error('Error saat ubah pengumuman:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan internal di server'
    });
  }
}

export async function hapusPengumuman(req: Request, res: Response): Promise<Response> {
  try {
    const id = req.params.id as string;
    const pengumuman = await AdminModel.getPengumumanById(id);
    if (!pengumuman) {
      return res.status(404).json({
        success: false,
        message: 'Pengumuman tidak ditemukan!'
      });
    }

    await AdminModel.deletePengumuman(id);
    return res.status(200).json({
      success: true,
      message: `Pengumuman dengan judul '${pengumuman.judul}' berhasil dihapus.`
    });
  } catch (error) {
    console.error('Error saat hapus pengumuman:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan internal di server'
    });
  }
}

// =========================================================================
// FEATURE 5: Persetujuan KRS (KRS Approval)
// =========================================================================

export async function ambilAjuanKrs(req: Request, res: Response): Promise<Response> {
  try {
    const submissions = await AdminModel.getKrsSubmissions();
    return res.status(200).json({
      success: true,
      message: 'Berhasil mengambil antrean ajuan KRS mahasiswa.',
      data: submissions
    });
  } catch (error) {
    console.error('Error saat mengambil ajuan KRS:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan internal di server'
    });
  }
}

export async function ambilDetailAjuanKrs(req: Request, res: Response): Promise<Response> {
  try {
    const userId = req.params.userId as string;
    const { semester, tahun_akademik } = req.query;

    if (!semester || !tahun_akademik) {
      return res.status(400).json({
        success: false,
        message: 'Query parameter semester dan tahun_akademik wajib disertakan!'
      });
    }

    const semNum = parseInt(semester as string, 10);
    if (isNaN(semNum)) {
      return res.status(400).json({
        success: false,
        message: 'Parameter semester harus berupa angka!'
      });
    }

    const detailKrs = await AdminModel.getKrsDetail(userId, semNum, tahun_akademik as string);
    return res.status(200).json({
      success: true,
      message: 'Berhasil mengambil detail ajuan KRS.',
      data: detailKrs
    });
  } catch (error) {
    console.error('Error saat mengambil detail KRS:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan internal di server'
    });
  }
}

export async function verifikasiKrs(req: Request, res: Response): Promise<Response> {
  try {
    const userId = req.params.userId as string;
    const { semester, tahun_akademik, status_persetujuan, catatan } = req.body;

    if (!semester || !tahun_akademik || !status_persetujuan) {
      return res.status(400).json({
        success: false,
        message: 'Kolom semester, tahun_akademik, dan status_persetujuan wajib diisi!'
      });
    }

    const semNum = parseInt(semester as string, 10);
    if (isNaN(semNum)) {
      return res.status(400).json({
        success: false,
        message: 'Parameter semester harus berupa angka!'
      });
    }

    const allowedStatus = ['proses', 'disetujui', 'ditolak'];
    if (!allowedStatus.includes(status_persetujuan)) {
      return res.status(400).json({
        success: false,
        message: `Status persetujuan tidak valid! Harus salah satu dari: ${allowedStatus.join(', ')}`
      });
    }

    const detailKrs = await AdminModel.getKrsDetail(userId, semNum, tahun_akademik as string);
    if (detailKrs.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Ajuan KRS mahasiswa untuk semester/tahun akademik tersebut tidak ditemukan!'
      });
    }

    const updated = await AdminModel.updateKrsStatus(userId, semNum, tahun_akademik as string, status_persetujuan, catatan || null);

    return res.status(200).json({
      success: true,
      message: `Persetujuan KRS mahasiswa berhasil di-update menjadi '${status_persetujuan}'.`,
      data: updated
    });
  } catch (error) {
    console.error('Error saat verifikasi KRS:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan internal di server'
    });
  }
}

// =========================================================================
// FEATURE 6: Verifikasi Dokumen Per Berkas
// =========================================================================

export async function ambilSemuaDokumen(req: Request, res: Response): Promise<Response> {
  try {
    const data = await AdminModel.getAllDocuments();
    return res.status(200).json({
      success: true,
      message: 'Berhasil mengambil daftar pengajuan berkas dokumen.',
      data
    });
  } catch (error) {
    console.error('Error saat mengambil semua dokumen:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan internal di server'
    });
  }
}

export async function verifikasiDokumen(req: Request, res: Response): Promise<Response> {
  try {
    const userId = req.params.userId as string;
    const { jenis_dokumen, status, catatan } = req.body;

    if (!jenis_dokumen || !status) {
      return res.status(400).json({
        success: false,
        message: 'Kolom jenis_dokumen dan status wajib diisi!'
      });
    }

    const allowedFields = ['ktp', 'kartu_keluarga', 'ijazah_skl', 'pas_foto'];
    if (!allowedFields.includes(jenis_dokumen)) {
      return res.status(400).json({
        success: false,
        message: `Jenis dokumen tidak valid! Harus salah satu dari: ${allowedFields.join(', ')}`
      });
    }

    const allowedStatus = ['belum_diverifikasi', 'disetujui', 'ditolak'];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status verifikasi tidak valid! Harus salah satu dari: ${allowedStatus.join(', ')}`
      });
    }

    // Cek apakah dokumen user ada
    const userDocs = await AdminModel.getDocumentByUserId(userId);
    if (!userDocs) {
      return res.status(404).json({
        success: false,
        message: 'Dokumen pendaftar tersebut tidak ditemukan atau belum pernah di-upload!'
      });
    }

    const updated = await AdminModel.updateDocumentStatus(userId, jenis_dokumen, status, catatan || null);

    return res.status(200).json({
      success: true,
      message: `Status verifikasi berkas '${jenis_dokumen}' berhasil di-update menjadi '${status}'.`,
      data: updated
    });
  } catch (error) {
    console.error('Error saat verifikasi dokumen:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan internal di server'
    });
  }
}

// =========================================================================
// FEATURE 7: Dashboard Statistik Admin & Tren
// =========================================================================

export async function ambilStatistikDashboard(req: Request, res: Response): Promise<Response> {
  try {
    const stats = await AdminModel.getDashboardStats();
    return res.status(200).json({
      success: true,
      message: 'Berhasil mengambil statistik Dashboard Admin.',
      data: stats
    });
  } catch (error) {
    console.error('Error saat mengambil statistik dashboard:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan internal di server'
    });
  }
}

export async function ambilTrenPendaftaran(req: Request, res: Response): Promise<Response> {
  try {
    const data = await AdminModel.getRegistrationTrends();
    return res.status(200).json({
      success: true,
      message: 'Berhasil mengambil data tren pendaftaran.',
      data
    });
  } catch (error) {
    console.error('Error saat mengambil tren pendaftaran:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan internal di server'
    });
  }
}




