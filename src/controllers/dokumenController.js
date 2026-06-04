const DokumenModel = require('../models/dokumenModel');

exports.uploadBerkas = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Validasi awal: Pastikan ada file yang dikirim lewat form-data
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Tidak ada dokumen yang dipilih untuk di-upload!',
      });
    }

    if (Object.keys(req.files).length > 1) {
      return res.status(400).json({
        success: false,
        message:
          'Penyalahgunaan sistem! Dokumen harus diunggah satu per satu sesuai prosedur.',
      });
    }

    // 2. Mapping data secara dinamis & Tentukan custom message secara spesifik
    const dataOlah = {};
    let customMessage = '';

    if (req.files['ktp']) {
      dataOlah.ktp = req.files['ktp'][0].filename;
      customMessage = 'Kartu Tanda Penduduk (KTP) berhasil diunggah!';
    }
    if (req.files['kartu_keluarga']) {
      dataOlah.kartu_keluarga = req.files['kartu_keluarga'][0].filename;
      customMessage = 'Kartu Keluarga (KK) berhasil diunggah!';
    }
    if (req.files['ijazah_skl']) {
      dataOlah.ijazah_skl = req.files['ijazah_skl'][0].filename;
      customMessage = 'Ijazah / SKL berhasil diunggah!';
    }
    if (req.files['pas_foto']) {
      dataOlah.pas_foto = req.files['pas_foto'][0].filename;
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
};
