const DokumenModel = require('../models/dokumenModel');

exports.uploadBerkas = async (req, res) => {
  try {
    const userId = req.user.id;

    // Validasi: Pastikan mahasiswa belum pernah upload berkas sebelumnya
    const sudahUpload = await DokumenModel.findByUserId(userId);
    if (sudahUpload) {
      return res.status(409).json({
        success: false,
        message: 'Anda sudah mengunggah dokumen pendaftaran.',
      });
    }

    // Validasi: Pastikan ketiga file wajib diunggah oleh frontend
    if (
      !req.files ||
      !req.files['ktp'] ||
      !req.files['kartu_keluarga'] ||
      !req.files['ijazah_skl'] ||
      !req.files['pas_foto']
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Wajib mengunggah semua dokumen: KTP, Kartu Keluarga, Ijazah/SKL dan Pas Foto!',
      });
    }

    // Ambil nama file unik yang sudah digenerate oleh Multer untuk disimpan ke Database
    const dataDokumen = {
      user_id: userId,
      ktp: req.files['ktp'][0].filename,
      kartu_keluarga: req.files['kartu_keluarga'][0].filename,
      ijazah_skl: req.files['ijazah_skl'][0].filename,
      pas_foto: req.files['pas_foto'][0].filename,
    };

    // Simpan ke database via Model
    const berkasBaru = await DokumenModel.create(dataDokumen);

    return res.status(201).json({
      success: true,
      message: 'Semua dokumen pendaftaran berhasil di-upload dan disimpan!',
      data: berkasBaru,
    });
  } catch (error) {
    console.error('Error saat upload dokumen:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan internal saat memproses file.',
    });
  }
};
