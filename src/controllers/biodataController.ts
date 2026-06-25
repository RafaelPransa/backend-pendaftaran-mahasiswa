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
      pilihan_prodi_1,
      pilihan_prodi_2,
      pendidikan_terakhir,
      nama_sekolah,
      jurusan_sekolah,
      tahun_lulus,
      nisn,
      alamat_sekolah,
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

    // Resolve prodi names/UUIDs to valid UUIDs
    const prodiId1 = pilihan_prodi_1 ? await BiodataModel.getProdiIdByName(pilihan_prodi_1) : null;
    const prodiId2 = pilihan_prodi_2 ? await BiodataModel.getProdiIdByName(pilihan_prodi_2) : null;

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
      pilihan_prodi_1: prodiId1,
      pilihan_prodi_2: prodiId2,
      pendidikan_terakhir: pendidikan_terakhir || null,
      nama_sekolah: nama_sekolah || null,
      jurusan_sekolah: jurusan_sekolah || null,
      tahun_lulus: tahun_lulus || null,
      nisn: nisn || null,
      alamat_sekolah: alamat_sekolah || null,
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
      pilihan_prodi_1,
      pilihan_prodi_2,
      pendidikan_terakhir,
      nama_sekolah,
      jurusan_sekolah,
      tahun_lulus,
      nisn,
      alamat_sekolah,
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
    if (pilihan_prodi_1 !== undefined) {
      dataUpdate.pilihan_prodi_1 = pilihan_prodi_1 ? await BiodataModel.getProdiIdByName(pilihan_prodi_1) : null;
    }
    if (pilihan_prodi_2 !== undefined) {
      dataUpdate.pilihan_prodi_2 = pilihan_prodi_2 ? await BiodataModel.getProdiIdByName(pilihan_prodi_2) : null;
    }
    if (pendidikan_terakhir !== undefined) dataUpdate.pendidikan_terakhir = pendidikan_terakhir || null;
    if (nama_sekolah !== undefined) dataUpdate.nama_sekolah = nama_sekolah || null;
    if (jurusan_sekolah !== undefined) dataUpdate.jurusan_sekolah = jurusan_sekolah || null;
    if (tahun_lulus !== undefined) dataUpdate.tahun_lulus = tahun_lulus || null;
    if (nisn !== undefined) dataUpdate.nisn = nisn || null;
    if (alamat_sekolah !== undefined) dataUpdate.alamat_sekolah = alamat_sekolah || null;

    // Validasi nilai kosong jika disertakan (kecuali pilihan prodi dan data sekolah yang boleh null saat pendaftaran awal)
    for (const key in dataUpdate) {
      if (
        key === 'pilihan_prodi_1' ||
        key === 'pilihan_prodi_2' ||
        key === 'pendidikan_terakhir' ||
        key === 'nama_sekolah' ||
        key === 'jurusan_sekolah' ||
        key === 'tahun_lulus' ||
        key === 'nisn' ||
        key === 'alamat_sekolah'
      ) continue;
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

// POST /api/biodata/rapor
export async function isiRapor(req: Request, res: Response): Promise<Response> {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Akses ditolak. Silahkan login terlebih dahulu',
      });
    }

    const userId = req.user.id;
    const { semester_1, semester_2, semester_3, semester_4, semester_5 } = req.body;

    if (semester_1 === undefined || semester_2 === undefined || semester_3 === undefined || semester_4 === undefined || semester_5 === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Semua kolom nilai rapor (Semester 1 s.d. 5) wajib diisi!',
      });
    }

    const dataRapor = {
      semester_1: parseFloat(semester_1),
      semester_2: parseFloat(semester_2),
      semester_3: parseFloat(semester_3),
      semester_4: parseFloat(semester_4),
      semester_5: parseFloat(semester_5),
    };

    if (isNaN(dataRapor.semester_1) || isNaN(dataRapor.semester_2) || isNaN(dataRapor.semester_3) || isNaN(dataRapor.semester_4) || isNaN(dataRapor.semester_5)) {
      return res.status(400).json({
        success: false,
        message: 'Semua nilai rapor harus berupa angka yang valid!',
      });
    }

    const raporBaru = await BiodataModel.saveOrUpdateRapor(userId, dataRapor);

    return res.status(200).json({
      success: true,
      message: 'Nilai rata-rata rapor semester 1 s.d. 5 berhasil disimpan!',
      data: raporBaru,
    });
  } catch (error) {
    console.error('Error saat menyimpan rapor:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan internal di server',
    });
  }
}

// GET /api/biodata/rapor
export async function getRapor(req: Request, res: Response): Promise<Response> {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Akses ditolak. Silahkan login terlebih dahulu',
      });
    }

    const userId = req.user.id;
    const rapor = await BiodataModel.getRaporByUserId(userId);

    return res.status(200).json({
      success: true,
      message: 'Berhasil mengambil data nilai rapor.',
      data: rapor,
    });
  } catch (error) {
    console.error('Error saat mengambil rapor:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan internal di server',
    });
  }
}

// GET /api/biodata/biodata
export async function getBiodata(req: Request, res: Response): Promise<Response> {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Akses ditolak. Silahkan login terlebih dahulu',
      });
    }

    const userId = req.user.id;
    const biodata = await BiodataModel.getBiodataWithProdiNames(userId);

    return res.status(200).json({
      success: true,
      message: 'Berhasil mengambil data biodata.',
      data: biodata || null,
    });
  } catch (error) {
    console.error('Error saat mengambil biodata:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan internal di server',
    });
  }
}
