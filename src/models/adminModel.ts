import knex from 'knex';
import config from '../../knexfile';

const db = knex(config.development);

export interface ProgramStudi {
  id?: string;
  kode: string;
  nama: string;
  fakultas: string;
}

// =========================================================================
// FEATURE 3: CRUD Program Studi
// =========================================================================

export async function getAllProdi(): Promise<any[]> {
  return await db('program_studi').select('*').orderBy('nama', 'asc');
}

export async function getProdiById(id: string): Promise<any | undefined> {
  return await db('program_studi').where({ id }).first();
}

export async function createProdi(data: ProgramStudi): Promise<any> {
  const [newProdi] = await db('program_studi').insert(data).returning('*');
  return newProdi;
}

export async function updateProdi(id: string, data: Partial<ProgramStudi>): Promise<any> {
  const [updatedProdi] = await db('program_studi')
    .where({ id })
    .update(data)
    .returning('*');
  return updatedProdi;
}

export async function deleteProdi(id: string): Promise<number> {
  return await db('program_studi').where({ id }).del();
}

export async function getProdiByKode(kode: string): Promise<any | undefined> {
  return await db('program_studi').where({ kode }).first();
}

// =========================================================================
// FEATURE 4: CRUD Pengumuman
// =========================================================================

export interface Pengumuman {
  id?: string;
  judul: string;
  konten: string;
  kategori: string;
}

export async function getAllPengumuman(): Promise<any[]> {
  return await db('pengumuman').select('*').orderBy('created_at', 'desc');
}

export async function getPengumumanById(id: string): Promise<any | undefined> {
  return await db('pengumuman').where({ id }).first();
}

export async function createPengumuman(data: Pengumuman): Promise<any> {
  const [newPengumuman] = await db('pengumuman').insert(data).returning('*');
  return newPengumuman;
}

export async function updatePengumuman(id: string, data: Partial<Pengumuman>): Promise<any> {
  const [updatedPengumuman] = await db('pengumuman')
    .where({ id })
    .update(data)
    .returning('*');
  return updatedPengumuman;
}

export async function deletePengumuman(id: string): Promise<number> {
  return await db('pengumuman').where({ id }).del();
}

// =========================================================================
// FEATURE 5: KRS Approval (Persetujuan KRS)
// =========================================================================

export async function getKrsSubmissions(): Promise<any[]> {
  const rows = await db('krs')
    .join('users', 'krs.user_id', 'users.id')
    .join('kelas', 'krs.kelas_id', 'kelas.id')
    .join('matakuliah', 'kelas.matakuliah_id', 'matakuliah.id')
    .select(
      'krs.user_id',
      'users.nama_lengkap',
      'users.email',
      'krs.semester',
      'krs.tahun_akademik',
      'krs.status_persetujuan',
      'krs.catatan'
    )
    .sum('matakuliah.sks as total_sks')
    .groupBy(
      'krs.user_id',
      'users.nama_lengkap',
      'users.email',
      'krs.semester',
      'krs.tahun_akademik',
      'krs.status_persetujuan',
      'krs.catatan'
    )
    .orderBy('krs.tahun_akademik', 'desc')
    .orderBy('krs.semester', 'desc');

  return rows.map((r) => ({
    user_id: r.user_id,
    nama_lengkap: r.nama_lengkap,
    email: r.email,
    semester: r.semester,
    tahun_akademik: r.tahun_akademik,
    status_persetujuan: r.status_persetujuan,
    catatan: r.catatan,
    total_sks: parseInt(r.total_sks as string || '0', 10)
  }));
}

export async function getKrsDetail(userId: string, semester: number, tahunAkademik: string): Promise<any[]> {
  return await db('krs')
    .join('kelas', 'krs.kelas_id', 'kelas.id')
    .join('matakuliah', 'kelas.matakuliah_id', 'matakuliah.id')
    .select(
      'krs.id as krs_id',
      'kelas.id as kelas_id',
      'matakuliah.kode as kode_matakuliah',
      'matakuliah.nama as nama_matakuliah',
      'matakuliah.sks',
      'kelas.hari',
      'kelas.jam',
      'kelas.ruangan',
      'kelas.dosen'
    )
    .where({
      'krs.user_id': userId,
      'krs.semester': semester,
      'krs.tahun_akademik': tahunAkademik
    });
}

export async function updateKrsStatus(
  userId: string,
  semester: number,
  tahunAkademik: string,
  status: string,
  catatan: string | null
): Promise<any> {
  return await db('krs')
    .where({ user_id: userId, semester, tahun_akademik: tahunAkademik })
    .update({
      status_persetujuan: status,
      catatan
    })
    .returning('*');
}


