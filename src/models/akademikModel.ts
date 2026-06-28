import knex from 'knex';
import config from '../../knexfile';

const db = knex(config.development);

// Feature 1: Dashboard Akademik
export async function getDashboardData(userId: string): Promise<any> {
  // Hitung SKS diambil di KRS aktif
  const sksResult = await db('krs')
    .join('kelas', 'krs.kelas_id', 'kelas.id')
    .join('matakuliah', 'kelas.matakuliah_id', 'matakuliah.id')
    .where('krs.user_id', userId)
    .sum('matakuliah.sks as total_sks')
    .first();

  const totalSksAmbil = parseInt(sksResult?.total_sks as string || '0', 10);

  // Ambil nilai KHS untuk menghitung IPK
  const grades = await db('khs')
    .join('matakuliah', 'khs.matakuliah_id', 'matakuliah.id')
    .select('khs.nilai_angka', 'matakuliah.sks')
    .where('khs.user_id', userId);

  let totalBobot = 0;
  let totalSksLulus = 0;
  
  grades.forEach((grade) => {
    const nilai = parseFloat(grade.nilai_angka as string);
    const sks = parseInt(grade.sks as string, 10);
    totalBobot += nilai * sks;
    totalSksLulus += sks;
  });

  const ipk = totalSksLulus > 0 ? parseFloat((totalBobot / totalSksLulus).toFixed(2)) : 0.0;

  // Cari semester aktif dinamis berdasarkan data KRS dan KHS
  const maxKrs = await db('krs').where('user_id', userId).max('semester as max_sem').first();
  const maxKhs = await db('khs').where('user_id', userId).max('semester as max_sem').first();
  
  const krsSem = parseInt(maxKrs?.max_sem as string || '0', 10);
  const khsSem = parseInt(maxKhs?.max_sem as string || '0', 10);
  const semesterAktif = Math.max(krsSem, khsSem + 1, 1);

  // Pengumuman Akademik dinamis dari database
  const pengumumanDb = await db('pengumuman')
    .where({ kategori: 'Akademik' })
    .orderBy('created_at', 'desc')
    .limit(5);

  const pengumuman = pengumumanDb.map((p) => ({
    id: p.id,
    judul: p.judul,
    tanggal: p.created_at instanceof Date ? p.created_at.toISOString().split('T')[0] : p.created_at,
    konten: p.konten,
  }));

  return {
    ipk,
    total_sks: totalSksLulus,
    sks_aktif: totalSksAmbil,
    semester_aktif: semesterAktif,
    pengumuman
  };
}

// Feature 2: KRS (Kartu Rencana Studi)

export interface KrsEnrollment {
  user_id: string;
  kelas_id: string;
  semester: number;
  tahun_akademik: string;
}

export async function getAvailableKelas(userId: string): Promise<any[]> {
  const biodata = await db('biodata').where({ user_id: userId }).select('pilihan_prodi_1').first();
  const prodiId = biodata ? biodata.pilihan_prodi_1 : null;

  const query = db('kelas')
    .join('matakuliah', 'kelas.matakuliah_id', 'matakuliah.id')
    .select(
      'kelas.id as kelas_id',
      'matakuliah.kode as kode_matakuliah',
      'matakuliah.nama as nama_matakuliah',
      'matakuliah.sks',
      'matakuliah.semester as semester_matakuliah',
      'kelas.hari',
      'kelas.jam',
      'kelas.ruangan',
      'kelas.dosen',
      'kelas.kuota'
    );

  if (prodiId) {
    query.where('matakuliah.prodi_id', prodiId);
  }

  const available = await query;

  const enrollments = await db('krs')
    .select('kelas_id')
    .count('id as terdaftar')
    .groupBy('kelas_id');

  const enrollmentMap = new Map(
    enrollments.map((e) => [e.kelas_id, parseInt(e.terdaftar as string || '0', 10)])
  );

  return available.map((k) => {
    const terdaftar = enrollmentMap.get(k.kelas_id) || 0;
    return {
      ...k,
      terdaftar,
      sisa_kuota: Math.max(0, k.kuota - terdaftar)
    };
  });
}

// Mendapatkan KRS mahasiswa
export async function getKrsByUserId(userId: string): Promise<any[]> {
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
      'kelas.dosen',
      'krs.semester',
      'krs.tahun_akademik',
      'krs.status_persetujuan',
      'krs.catatan'
    )
    .where('krs.user_id', userId);
}

// Menyimpan pemrogaman KRS mahasiswa dalam Transaction
export async function enrollKrs(
  userId: string,
  kelasIds: string[],
  semester: number,
  tahunAkademik: string
): Promise<any[]> {
  return await db.transaction(async (trx) => {
    // Hapus KRS lama untuk semester dan tahun akademik yang sama agar tidak duplikat
    await trx('krs')
      .where({ user_id: userId, semester, tahun_akademik: tahunAkademik })
      .del();

    if (kelasIds.length === 0) {
      return [];
    }

    const records = kelasIds.map((kelasId) => ({
      user_id: userId,
      kelas_id: kelasId,
      semester,
      tahun_akademik: tahunAkademik
    }));

    await trx('krs').insert(records);

    return await trx('krs')
      .join('kelas', 'krs.kelas_id', 'kelas.id')
      .join('matakuliah', 'kelas.matakuliah_id', 'matakuliah.id')
      .select(
        'krs.id as krs_id',
        'matakuliah.nama as nama_matakuliah',
        'matakuliah.sks',
        'kelas.hari',
        'kelas.jam',
        'kelas.dosen'
      )
      .where({ 'krs.user_id': userId, 'krs.semester': semester, 'krs.tahun_akademik': tahunAkademik });
  });
}

// Feature 3: KHS (Kartu Hasil Studi)
export async function getKhsBySemester(userId: string, semester: number): Promise<any> {
  const listKhs = await db('khs')
    .join('matakuliah', 'khs.matakuliah_id', 'matakuliah.id')
    .select(
      'khs.id as khs_id',
      'matakuliah.kode as kode_matakuliah',
      'matakuliah.nama as nama_matakuliah',
      'matakuliah.sks',
      'khs.nilai_angka',
      'khs.nilai_huruf'
    )
    .where({ 'khs.user_id': userId, 'khs.semester': semester });

  let totalBobot = 0;
  let totalSks = 0;

  listKhs.forEach((item) => {
    const nilai = parseFloat(item.nilai_angka as string);
    const sks = parseInt(item.sks as string, 10);
    totalBobot += nilai * sks;
    totalSks += sks;
  });

  const ips = totalSks > 0 ? parseFloat((totalBobot / totalSks).toFixed(2)) : 0.0;

  return {
    semester,
    ips,
    total_sks: totalSks,
    nilai: listKhs
  };
}

// Feature 4: Transkrip Nilai
export async function getTranskripData(userId: string): Promise<any> {
  const grades = await db('khs')
    .join('matakuliah', 'khs.matakuliah_id', 'matakuliah.id')
    .select(
      'khs.id as khs_id',
      'matakuliah.kode as kode_matakuliah',
      'matakuliah.nama as nama_matakuliah',
      'matakuliah.sks',
      'khs.semester',
      'khs.nilai_angka',
      'khs.nilai_huruf'
    )
    .orderBy('khs.semester', 'asc')
    .where('khs.user_id', userId);

  let totalBobot = 0;
  let totalSks = 0;

  grades.forEach((item) => {
    const nilai = parseFloat(item.nilai_angka as string);
    const sks = parseInt(item.sks as string, 10);
    totalBobot += nilai * sks;
    totalSks += sks;
  });

  const ipk = totalSks > 0 ? parseFloat((totalBobot / totalSks).toFixed(2)) : 0.0;

  return {
    ipk,
    total_sks: totalSks,
    nilai: grades
  };
}

// Feature 5: Keuangan (Tagihan UKT)
export interface KeuanganRecord {
  id: string;
  user_id: string;
  semester: number;
  tagihan: number;
  status: 'belum_bayar' | 'lunas';
  tanggal_bayar: Date | null;
}

export async function getKeuanganByUserId(userId: string): Promise<any[]> {
  return await db('keuangan')
    .select('id', 'semester', 'tagihan', 'status', 'tanggal_bayar')
    .where({ user_id: userId })
    .orderBy('semester', 'desc');
}

export async function payUkt(userId: string, semester: number): Promise<any> {
  const [updatedRecord] = await db('keuangan')
    .where({ user_id: userId, semester })
    .update({
      status: 'menunggu_verifikasi',
      updated_at: new Date()
    })
    .returning('*');
  return updatedRecord;
}

// Feature 6: Forum Diskusi

export interface ThreadData {
  user_id: string;
  judul: string;
  konten: string;
  kategori: string;
}

export interface ReplyData {
  thread_id: string;
  user_id: string;
  konten: string;
}

// Membuat thread baru
export async function createThread(threadData: ThreadData): Promise<any> {
  const [newThread] = await db('forum_threads').insert(threadData).returning('*');
  return newThread;
}

// Mendapatkan daftar thread (opsional filter kategori)
export async function getThreads(kategori?: string): Promise<any[]> {
  const query = db('forum_threads')
    .join('users', 'forum_threads.user_id', 'users.id')
    .select(
      'forum_threads.id as thread_id',
      'forum_threads.judul',
      'forum_threads.konten',
      'forum_threads.kategori',
      'users.nama_lengkap as pembuat',
      'users.role as pembuat_role',
      'forum_threads.created_at'
    )
    .orderBy('forum_threads.created_at', 'desc');

  if (kategori) {
    query.where('forum_threads.kategori', kategori);
  }

  // Hitung jumlah balasan per thread secara paralel
  const threads = await query;
  const replyCounts = await db('forum_replies')
    .select('thread_id')
    .count('id as count')
    .groupBy('thread_id');

  const countMap = new Map(replyCounts.map((rc) => [rc.thread_id, parseInt(rc.count as string || '0', 10)]));

  return threads.map((t) => ({
    ...t,
    jumlah_balasan: countMap.get(t.thread_id) || 0
  }));
}

// Mendapatkan detail thread tunggal
export async function getThreadById(threadId: string): Promise<any> {
  return await db('forum_threads')
    .join('users', 'forum_threads.user_id', 'users.id')
    .select(
      'forum_threads.id as thread_id',
      'forum_threads.judul',
      'forum_threads.konten',
      'forum_threads.kategori',
      'users.nama_lengkap as pembuat',
      'users.role as pembuat_role',
      'forum_threads.created_at'
    )
    .where('forum_threads.id', threadId)
    .first();
}

// Mendapatkan daftar balasan thread
export async function getThreadReplies(threadId: string): Promise<any[]> {
  return await db('forum_replies')
    .join('users', 'forum_replies.user_id', 'users.id')
    .select(
      'forum_replies.id as reply_id',
      'forum_replies.konten',
      'users.nama_lengkap as pembuat',
      'users.role as pembuat_role',
      'forum_replies.created_at'
    )
    .where('forum_replies.thread_id', threadId)
    .orderBy('forum_replies.created_at', 'asc');
}

// Menambahkan balasan baru
export async function createReply(replyData: ReplyData): Promise<any> {
  const [newReply] = await db('forum_replies').insert(replyData).returning('*');
  return newReply;
}
