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

// =========================================================================
// FEATURE 6: Verifikasi Dokumen Per Berkas
// =========================================================================

export async function getAllDocuments(): Promise<any[]> {
  return await db('dokumen')
    .join('users', 'dokumen.user_id', 'users.id')
    .select(
      'dokumen.id as dokumen_id',
      'dokumen.user_id',
      'users.nama_lengkap',
      'users.email',
      'dokumen.ktp',
      'dokumen.ktp_status',
      'dokumen.ktp_catatan',
      'dokumen.kartu_keluarga',
      'dokumen.kartu_keluarga_status',
      'dokumen.kartu_keluarga_catatan',
      'dokumen.ijazah_skl',
      'dokumen.ijazah_skl_status',
      'dokumen.ijazah_skl_catatan',
      'dokumen.pas_foto',
      'dokumen.pas_foto_status',
      'dokumen.pas_foto_catatan',
      'dokumen.created_at',
      'dokumen.updated_at'
    )
    .orderBy('dokumen.updated_at', 'desc');
}

export async function updateDocumentStatus(
  userId: string,
  fileType: string,
  status: string,
  catatan: string | null
): Promise<any> {
  const allowedFields = ['ktp', 'kartu_keluarga', 'ijazah_skl', 'pas_foto'];
  if (!allowedFields.includes(fileType)) {
    throw new Error(`File type '${fileType}' tidak didukung.`);
  }

  const updateData: any = {};
  updateData[`${fileType}_status`] = status;
  updateData[`${fileType}_catatan`] = catatan;

  const [updated] = await db('dokumen')
    .where({ user_id: userId })
    .update(updateData)
    .returning('*');
  return updated;
}

export async function getDocumentByUserId(userId: string): Promise<any | undefined> {
  return await db('dokumen').where({ user_id: userId }).first();
}

// =========================================================================
// FEATURE 7: Dashboard Statistik Admin & Tren
// =========================================================================

export async function getDashboardStats(): Promise<any> {
  // 1. Metrik KPI: Total, Terverifikasi, Lulus
  const totalRes = await db('users').where({ role: 'student' }).count('id as count').first();
  const terverifikasiRes = await db('users').where({ role: 'student', status_verifikasi: 'diverifikasi' }).count('id as count').first();
  const lulusRes = await db('users').where({ role: 'student', status_kelulusan: 'lulus' }).count('id as count').first();

  const total = parseInt(totalRes?.count as string || '0', 10);
  const terverifikasi = parseInt(terverifikasiRes?.count as string || '0', 10);
  const lulus = parseInt(lulusRes?.count as string || '0', 10);

  // Target pendaftaran (misal 3000)
  const targetPendaftaran = 3000;

  // 2. Metrik KPI: Pendaftar per Fakultas
  const pendaftarFakultas = await db('users')
    .where({ role: 'student' })
    .join('biodata', 'users.id', 'biodata.user_id')
    .join('program_studi', 'biodata.pilihan_prodi_1', 'program_studi.id')
    .select('program_studi.fakultas')
    .count('users.id as count')
    .groupBy('program_studi.fakultas');

  const pendaftarFakultasMapped = pendaftarFakultas.map((pf) => ({
    fakultas: pf.fakultas,
    jumlah: parseInt(pf.count as string || '0', 10)
  }));

  // 3. Donut Chart: Status Verifikasi
  const statusVerifikasiStats = await db('users')
    .where({ role: 'student' })
    .select('status_verifikasi')
    .count('id as count')
    .groupBy('status_verifikasi');

  const statusVerifikasiMapped = statusVerifikasiStats.map((sv) => ({
    status: sv.status_verifikasi,
    jumlah: parseInt(sv.count as string || '0', 10)
  }));

  // 4. Bar Chart: Program Studi Terfavorit
  const prodiTerfavoritStats = await db('users')
    .where({ role: 'student' })
    .join('biodata', 'users.id', 'biodata.user_id')
    .join('program_studi', 'biodata.pilihan_prodi_1', 'program_studi.id')
    .select('program_studi.nama as prodi_nama')
    .count('users.id as count')
    .groupBy('program_studi.nama')
    .orderBy('count', 'desc')
    .limit(5);

  const prodiTerfavoritMapped = prodiTerfavoritStats.map((pt) => ({
    program_studi: pt.prodi_nama,
    jumlah: parseInt(pt.count as string || '0', 10)
  }));

  // 5. Daftar Pendaftar Terbaru (5 pendaftar)
  const recentRegistrants = await db('users')
    .where({ role: 'student' })
    .select('id', 'nama_lengkap', 'email', 'created_at')
    .orderBy('created_at', 'desc')
    .limit(5);

  const formatTanggal = (d: any) => {
    if (d instanceof Date) {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    return d;
  };

  const recentRegistrantsFormatted = recentRegistrants.map((rr) => ({
    id: rr.id,
    nama_lengkap: rr.nama_lengkap,
    email: rr.email,
    tanggal_daftar: formatTanggal(rr.created_at)
  }));

  return {
    kpi: {
      total_pendaftar: total,
      terverifikasi,
      lulus,
      target_pendaftaran: targetPendaftaran,
      progress_target_persen: parseFloat(((total / targetPendaftaran) * 100).toFixed(2))
    },
    pendaftar_per_fakultas: pendaftarFakultasMapped,
    chart_status_verifikasi: statusVerifikasiMapped,
    chart_prodi_terfavorit: prodiTerfavoritMapped,
    pendaftar_terbaru: recentRegistrantsFormatted
  };
}

export async function getRegistrationTrends(): Promise<any[]> {
  const formatTanggal = (d: any) => {
    if (d instanceof Date) {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    return d;
  };

  const trends = await db('users')
    .where({ role: 'student' })
    .select(db.raw("to_char(created_at, 'YYYY-MM-DD') as tanggal"))
    .count('id as jumlah')
    .groupBy('tanggal')
    .orderBy('tanggal', 'asc')
    .limit(30);

  return trends.map((t) => ({
    tanggal: t.tanggal,
    jumlah: parseInt(t.jumlah as string || '0', 10)
  }));
}




