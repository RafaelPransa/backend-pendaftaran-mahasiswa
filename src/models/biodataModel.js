const knex = require('../../knexfile');
const db = require('knex')(knex.development);

// Fungsi untuk menyimpan biodata baru ke PostgreSQL
exports.create = async (biodataData) => {
  const [newBiodata] = await db('biodata').insert(biodataData).returning('*');
  return newBiodata;
};

// Fungsi untuk mencari biodata berdasarkan user_id (validasi pencegahan double input)
exports.findByUserId = async (userId) => {
  return await db('biodata').where({ user_id: userId }).first();
};
