const BiodataModel = require('../models/biodataModel');

exports.isiBiodata = async (req, res) => {
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
};
