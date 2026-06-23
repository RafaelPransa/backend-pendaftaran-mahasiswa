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
