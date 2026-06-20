import knex from 'knex';
import config from '../../knexfile';

const db = knex(config.development);

export interface DokumenData {
  ktp?: string;
  kartu_keluarga?: string;
  ijazah_skl?: string;
  pas_foto?: string;
}

// Fungsi untuk mencari berkas berdasarkan ID User
export async function findByUserId(userId: string): Promise<any> {
  return await db('dokumen').where({ user_id: userId }).first();
}

// Fungsi gabungan INSERT & UPDATE
export async function saveOrUpdate(userId: string, dataOlah: DokumenData): Promise<any> {
  // Cek dulu apakah baris data user sudah ada di database
  const berkasExist = await findByUserId(userId);

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
}
