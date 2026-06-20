import knex from 'knex';
import config from '../../knexfile';

const db = knex(config.development);

export interface Biodata {
  user_id: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  jenis_kelamin: 'L' | 'P';
  agama: string;
  alamat_lengkap: string;
  provinsi: string;
  kota_kabupaten: string;
  kecamatan: string;
  kode_pos: string;
}

// Fungsi untuk menyimpan biodata baru ke PostgreSQL
export async function create(biodataData: Biodata): Promise<any> {
  const [newBiodata] = await db('biodata').insert(biodataData).returning('*');
  return newBiodata;
}

// Fungsi untuk mencari biodata berdasarkan user_id (validasi pencegahan double input)
export async function findByUserId(userId: string): Promise<any> {
  return await db('biodata').where({ user_id: userId }).first();
}

// Fungsi untuk memperbarui data biodata berdasarkan user_id
export async function update(userId: string, biodataData: Partial<Biodata>): Promise<any> {
  const [updatedBiodata] = await db('biodata')
    .where({ user_id: userId })
    .update(biodataData)
    .returning('*');
  return updatedBiodata;
}
