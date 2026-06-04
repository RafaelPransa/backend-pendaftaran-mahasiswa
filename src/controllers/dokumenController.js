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

    // 2. Mapping data secara dinamis (Hanya field yang di-upload yang dimasukkan)
    const dataOlah = {};
    if (req.files['ktp']) dataOlah.ktp = req.files['ktp'][0].filename;
    if (req.files['kartu_keluarga'])
      dataOlah.kartu_keluarga = req.files['kartu_keluarga'][0].filename;
    if (req.files['ijazah_skl'])
      dataOlah.ijazah_skl = req.files['ijazah_skl'][0].filename;
    if (req.files['pas_foto'])
      dataOlah.pas_foto = req.files['pas_foto'][0].filename;

    // 3. Tembak ke Model! Biarkan model yang mikir mau INSERT atau UPDATE
    const hasilBerkas = await DokumenModel.saveOrUpdate(userId, dataOlah);

    // 4. Kembalikan respon sukses
    return res.status(200).json({
      success: true,
      message: 'Dokumen pendaftaran berhasil diperbarui!',
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
