import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Check if we already have matakuliah to prevent duplicate inserts on migration rerun
  const count = await knex('matakuliah').count('id as count').first();
  if (count && parseInt(count.count as string, 10) > 0) {
    return;
  }

  // 1. Insert Matakuliah and return their IDs
  const mkIds = await knex('matakuliah').insert([
    { kode: 'IF101', nama: 'Algoritma dan Pemrograman', sks: 4, semester: 1 },
    { kode: 'IF102', nama: 'Pengantar Teknologi Informasi', sks: 2, semester: 1 },
    { kode: 'IF103', nama: 'Matematika Diskrit', sks: 3, semester: 1 },
    { kode: 'IF104', nama: 'Dasar Desain Web', sks: 3, semester: 1 },
    { kode: 'IF105', nama: 'Pancasila dan Kewarganegaraan', sks: 2, semester: 1 }
  ]).returning('id');

  // 2. Insert Kelas corresponding to the seeded Matakuliah
  await knex('kelas').insert([
    { matakuliah_id: mkIds[0].id, hari: 'Senin', jam: '08:00 - 11:30', ruangan: 'R. 301', dosen: 'Bpk. Budi Santoso', kuota: 40 },
    { matakuliah_id: mkIds[1].id, hari: 'Selasa', jam: '08:00 - 09:40', ruangan: 'R. 102', dosen: 'Ibu Ratna D.', kuota: 40 },
    { matakuliah_id: mkIds[2].id, hari: 'Rabu', jam: '10:00 - 12:30', ruangan: 'R. 205', dosen: 'Dr. Hendra K.', kuota: 40 },
    { matakuliah_id: mkIds[3].id, hari: 'Kamis', jam: '13:00 - 15:30', ruangan: 'Lab 2', dosen: 'Ibu Anita S.', kuota: 40 },
    { matakuliah_id: mkIds[4].id, hari: 'Jumat', jam: '08:00 - 09:40', ruangan: 'R. 201', dosen: 'Bpk. Ahmad J.', kuota: 40 }
  ]);
}

export async function down(knex: Knex): Promise<void> {
  // Clear seeded classes and subjects
  await knex('kelas').del();
  await knex('matakuliah').del();
}
