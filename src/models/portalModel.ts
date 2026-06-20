import knex from 'knex';
import config from '../../knexfile';

const db = knex(config.development);

export interface StatusPendaftaran {
  status_verifikasi: string;
  status_kelulusan: string;
  catatan: string | null;
}

// Mendapatkan status pendaftaran berdasarkan ID User
export async function getStatusByUserId(userId: string): Promise<StatusPendaftaran | undefined> {
  return await db('users')
    .select('status_verifikasi', 'status_kelulusan', 'catatan')
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
