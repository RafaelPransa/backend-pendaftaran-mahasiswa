import knex from 'knex';
import config from '../../knexfile';

const db = knex(config.development);

export interface StatusPendaftaran {
  nama_lengkap: string;
  nik: string;
  nomor_wa: string;
  email: string;
  status_verifikasi: string;
  status_kelulusan: string;
  catatan: string | null;
}

// Mendapatkan status pendaftaran berdasarkan ID User
export async function getStatusByUserId(userId: string): Promise<StatusPendaftaran | undefined> {
  return await db('users')
    .select('nama_lengkap', 'nik', 'nomor_wa', 'email', 'status_verifikasi', 'status_kelulusan', 'catatan', 'nim')
    .where({ id: userId })
    .first();
}

// Memperbarui status pendaftaran (Verifikasi & Kelulusan) oleh Admin
export async function updateStatus(
  userId: string,
  statusData: Partial<StatusPendaftaran>
): Promise<any> {
  const [updatedUser] = await db('users')
    .where({ id: userId })
    .update(statusData)
    .returning(['id', 'nama_lengkap', 'email', 'status_verifikasi', 'status_kelulusan', 'catatan']);
  return updatedUser;
}

// Mendapatkan statistik pendaftaran untuk Beranda Portal PMB (Landing Page)
export async function getPendaftaranStats(): Promise<any> {
  const totalPendaftar = await db('users').where({ role: 'student' }).count('id as count').first();
  const terverifikasi = await db('users').where({ role: 'student', status_verifikasi: 'diverifikasi' }).count('id as count').first();
  const lulus = await db('users').where({ role: 'student', status_kelulusan: 'lulus' }).count('id as count').first();

  return {
    total_pendaftar: parseInt(totalPendaftar?.count as string || '0', 10),
    terverifikasi: parseInt(terverifikasi?.count as string || '0', 10),
    lulus: parseInt(lulus?.count as string || '0', 10),
  };
}

// Mendapatkan daftar jadwal PMB dari database
export async function getJadwal(): Promise<any[]> {
  const rows = await db('pmb_jadwal')
    .select('gelombang', 'tanggal_mulai', 'tanggal_selesai', 'status')
    .orderBy('tanggal_mulai', 'asc');
  
  const formatDate = (d: any) => {
    if (d instanceof Date) {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    return d;
  };

  return rows.map((r) => ({
    gelombang: r.gelombang,
    tanggal_mulai: formatDate(r.tanggal_mulai),
    tanggal_selesai: formatDate(r.tanggal_selesai),
    status: r.status,
  }));
}

// Mendapatkan daftar persyaratan PMB dari database
export async function getPersyaratan(): Promise<string[]> {
  const rows = await db('pmb_persyaratan')
    .select('deskripsi')
    .orderBy('created_at', 'asc');
  
  return rows.map((r) => r.deskripsi);
}

// Mendapatkan daftar pengumuman untuk portal mahasiswa
export async function getPengumuman(): Promise<any[]> {
  return await db('pengumuman')
    .select('id', 'judul', 'konten', 'kategori', 'created_at')
    .orderBy('created_at', 'desc');
}

// Mendapatkan detail pengumuman berdasarkan ID
export async function getPengumumanById(id: string): Promise<any | undefined> {
  return await db('pengumuman').where({ id }).first();
}

