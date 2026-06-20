import { Request, Response } from 'express';
import * as BiodataModel from '../models/biodataModel';

export async function isiBiodata(req: Request, res: Response): Promise<Response> {
  try {
    const {
      tempat_lahir,
      tanggal_lahir,
      jenis_kelamin,
      agama,
      alamat_lengkap,
      provinsi,
      kota_kabupaten,
      kecamatan,
      kode_pos,
    } = req.body;

    // Data ID user diambil dari Token JWT yang sukses lolos dari satpam middleware
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Akses ditolak. Silahkan login terlebih dahulu',
      });
    }

    const userId = req.user.id;

    // Validasi memastikan tidak ada inputan yang kosong
    if (
      !tempat_lahir ||
      !tanggal_lahir ||
      !jenis_kelamin ||
      !agama ||
      !alamat_lengkap ||
      !provinsi ||
      !kota_kabupaten ||
      !kecamatan ||
      !kode_pos
    ) {
      return res.status(400).json({
        success: false,
        message: 'Semua kolom data pribadi, kontak dan alamat wajib diisi!',
      });
    }

    // Regex untuk memastikan format murni YYYY-MM-DD (Angka semua dipisah strip)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(tanggal_lahir)) {
      return res.status(400).json({
        success: false,
        message: 'Format tanggal lahir tidak valid! Gunakan format YYYY-MM-DD.',
      });
    }

    // Pengecekan apakah mahasiswa sudah mengisi biodata pendaftaran sebelumnya
    const sudahIsi = await BiodataModel.findByUserId(userId);
    if (sudahIsi) {
      return res.status(409).json({
        success: false,
        message: 'Anda sudah pernah mengisi biodata pendaftaran',
      });
    }

    // Jika lolos semua validasi
    const biodataBaru = await BiodataModel.create({
      user_id: userId,
      tempat_lahir,
      tanggal_lahir,
      jenis_kelamin,
      agama,
      alamat_lengkap,
      provinsi,
      kota_kabupaten,
      kecamatan,
      kode_pos,
    });

    // Respon sukses 201 created ke frontend
    return res.status(201).json({
      success: true,
      message: 'Biodata pendaftaran Anda berhasil disimpan!',
      data: biodataBaru,
    });
  } catch (error) {
    console.error('Error saat menyimpan biodata:', error);

    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan internal di server',
    });
  }
}

// Fungsi untuk memperbarui biodata mahasiswa
export async function ubahBiodata(req: Request, res: Response): Promise<Response> {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Akses ditolak. Silahkan login terlebih dahulu',
      });
    }

    const userId = req.user.id;

    // Cek apakah biodata sudah pernah diisi sebelumnya
    const biodataExist = await BiodataModel.findByUserId(userId);
    if (!biodataExist) {
      return res.status(404).json({
        success: false,
        message: 'Biodata pendaftaran belum ditemukan. Silakan isi biodata terlebih dahulu.',
      });
    }

    const {
      tempat_lahir,
      tanggal_lahir,
      jenis_kelamin,
      agama,
      alamat_lengkap,
      provinsi,
      kota_kabupaten,
      kecamatan,
      kode_pos,
    } = req.body;

    const dataUpdate: Partial<BiodataModel.Biodata> = {};

    if (tempat_lahir !== undefined) dataUpdate.tempat_lahir = tempat_lahir;
    if (tanggal_lahir !== undefined) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(tanggal_lahir)) {
        return res.status(400).json({
          success: false,
          message: 'Format tanggal lahir tidak valid! Gunakan format YYYY-MM-DD.',
        });
      }
      dataUpdate.tanggal_lahir = tanggal_lahir;
    }
    if (jenis_kelamin !== undefined) {
      if (jenis_kelamin !== 'L' && jenis_kelamin !== 'P') {
        return res.status(400).json({
          success: false,
          message: 'Jenis kelamin harus L (Laki-laki) atau P (Perempuan).',
        });
      }
      dataUpdate.jenis_kelamin = jenis_kelamin;
    }
    if (agama !== undefined) dataUpdate.agama = agama;
    if (alamat_lengkap !== undefined) dataUpdate.alamat_lengkap = alamat_lengkap;
    if (provinsi !== undefined) dataUpdate.provinsi = provinsi;
    if (kota_kabupaten !== undefined) dataUpdate.kota_kabupaten = kota_kabupaten;
    if (kecamatan !== undefined) dataUpdate.kecamatan = kecamatan;
    if (kode_pos !== undefined) dataUpdate.kode_pos = kode_pos;

    // Validasi nilai kosong jika disertakan
    for (const key in dataUpdate) {
      const value = dataUpdate[key as keyof Partial<BiodataModel.Biodata>];
      if (value === null || (typeof value === 'string' && value.trim() === '')) {
        return res.status(400).json({
          success: false,
          message: `Kolom ${key} tidak boleh kosong!`,
        });
      }
    }

    if (Object.keys(dataUpdate).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Tidak ada data biodata yang dikirim untuk diubah!',
      });
    }

    const biodataDiubah = await BiodataModel.update(userId, dataUpdate);

    return res.status(200).json({
      success: true,
      message: 'Biodata pendaftaran Anda berhasil diperbarui!',
      data: biodataDiubah,
    });
  } catch (error) {
    console.error('Error saat mengubah biodata:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan internal di server',
    });
  }
}
