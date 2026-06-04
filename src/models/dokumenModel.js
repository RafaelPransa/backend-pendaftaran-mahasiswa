const knex = require('../../knexfile');
const db = require('knex')(knex.development);

// Fungsi untuk mencari berkas berdasarkan ID User
exports.findByUserId = async (userId) => {
  return await db('dokumen').where({ user_id: userId }).first();
};

// Fungsi gabungan INSERT & UPDATE (Sangat Rapi & Standar Industri)
exports.saveOrUpdate = async (userId, dataOlah) => {
  // Cek dulu apakah baris data user sudah ada di database
  const berkasExist = await this.findByUserId(userId);

  if (berkasExist) {
    // Jika sudah ada, langsung eksekusi UPDATE
    const [updatedDoc] = await db('dokumen')
      .where({ user_id: userId })
      .update(dataOlah)
      .returning('*');
    return updatedDoc;
  } else {
    // Jika belum ada, gabungkan user_id ke dalam objek lalu INSERT
    const dataBaru = { user_id: userId, ...dataOlah };
    const [insertedDoc] = await db('dokumen').insert(dataBaru).returning('*');
    return insertedDoc;
  }
};
