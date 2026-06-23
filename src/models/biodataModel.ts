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
  pilihan_prodi_1?: string | null;
  pilihan_prodi_2?: string | null;
}

export interface Rapor {
  user_id: string;
  semester: number;
  matematika: number;
  bahasa_indonesia: number;
  bahasa_inggris: number;
  ipa: number;
  ips: number;
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

// Mendapatkan nilai rapor berdasarkan user_id
export async function getRaporByUserId(userId: string): Promise<any[]> {
  return await db('nilai_rapor')
    .where({ user_id: userId })
    .orderBy('semester', 'asc');
}

// Simpan atau update nilai rapor per semester
export async function saveOrUpdateRapor(userId: string, semester: number, dataRapor: Omit<Rapor, 'user_id' | 'semester'>): Promise<any> {
  const exist = await db('nilai_rapor').where({ user_id: userId, semester }).first();
  if (exist) {
    const [updated] = await db('nilai_rapor')
      .where({ user_id: userId, semester })
      .update(dataRapor)
      .returning('*');
    return updated;
  } else {
    const [inserted] = await db('nilai_rapor')
      .insert({ user_id: userId, semester, ...dataRapor })
      .returning('*');
    return inserted;
  }
}

