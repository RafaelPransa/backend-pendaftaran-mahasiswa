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
  pendidikan_terakhir?: string | null;
  nama_sekolah?: string | null;
  jurusan_sekolah?: string | null;
  tahun_lulus?: string | null;
  nisn?: string | null;
  alamat_sekolah?: string | null;
}

export interface Rapor {
  user_id: string;
  semester_1: number;
  semester_2: number;
  semester_3: number;
  semester_4: number;
  semester_5: number;
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
export async function getRaporByUserId(userId: string): Promise<any> {
  return await db('nilai_rapor')
    .where({ user_id: userId })
    .first();
}

// Simpan atau update nilai rapor untuk semua semester (1-5)
export async function saveOrUpdateRapor(userId: string, dataRapor: Omit<Rapor, 'user_id'>): Promise<any> {
  const exist = await db('nilai_rapor').where({ user_id: userId }).first();
  if (exist) {
    const [updated] = await db('nilai_rapor')
      .where({ user_id: userId })
      .update(dataRapor)
      .returning('*');
    return updated;
  } else {
    const [inserted] = await db('nilai_rapor')
      .insert({ user_id: userId, ...dataRapor })
      .returning('*');
    return inserted;
  }
}

// Fungsi untuk mencari ID program studi berdasarkan nama (dengan/tanpa awalan "S1 ") atau UUID
export async function getProdiIdByName(name: string | null | undefined): Promise<string | null> {
  if (!name) return null;

  // Cek apakah data input sudah berformat UUID
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(name)) {
    return name;
  }

  let cleanName = name.trim();
  if (cleanName.toUpperCase().startsWith('S1 ')) {
    cleanName = cleanName.substring(3).trim();
  }

  const prodi = await db('program_studi')
    .whereRaw('LOWER(nama) = ?', [cleanName.toLowerCase()])
    .first();

  return prodi ? prodi.id : null;
}

// Fungsi untuk mencari biodata berdasarkan user_id, dengan nama pilihan prodi yang kompatibel untuk dropdown
export async function getBiodataWithProdiNames(userId: string): Promise<any> {
  const biodata = await db('biodata')
    .leftJoin('program_studi as ps1', 'biodata.pilihan_prodi_1', 'ps1.id')
    .leftJoin('program_studi as ps2', 'biodata.pilihan_prodi_2', 'ps2.id')
    .select(
      'biodata.*',
      'ps1.nama as pilihan_prodi_1_nama',
      'ps2.nama as pilihan_prodi_2_nama'
    )
    .where({ 'biodata.user_id': userId })
    .first();

  if (biodata) {
    // Prepend "S1 " jika ada nama prodi untuk dropdown frontend
    if (biodata.pilihan_prodi_1_nama) {
      biodata.pilihan_prodi_1 = `S1 ${biodata.pilihan_prodi_1_nama}`;
    }
    if (biodata.pilihan_prodi_2_nama) {
      biodata.pilihan_prodi_2 = `S1 ${biodata.pilihan_prodi_2_nama}`;
    }
  }
  return biodata;
}


