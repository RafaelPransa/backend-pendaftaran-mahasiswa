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
