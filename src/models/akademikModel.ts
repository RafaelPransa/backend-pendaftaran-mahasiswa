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

  // Pengumuman Akademik
  const pengumuman = [
    { id: 1, judul: 'Pemilihan KRS Semester Ganjil 2026/2027', tanggal: '2026-06-20', konten: 'Pengisian KRS dimulai dari tanggal 22 Juni s.d. 30 Juni 2026.' },
    { id: 2, judul: 'Pembayaran UKT Semester Ganjil', tanggal: '2026-06-15', konten: 'Batas akhir pembayaran UKT adalah tanggal 19 Juni 2026.' }
  ];

  return {
    ipk,
    total_sks: totalSksLulus,
    sks_aktif: totalSksAmbil,
    semester_aktif: 6, // Asumsi Semester 6 sesuai data user
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

// Mendapatkan daftar kelas yang tersedia untuk diprogram
export async function getAvailableKelas(): Promise<any[]> {
  const available = await db('kelas')
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
      'krs.tahun_akademik'
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
