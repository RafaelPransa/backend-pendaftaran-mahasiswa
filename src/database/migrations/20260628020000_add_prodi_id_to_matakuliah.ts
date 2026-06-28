import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // 1. Add prodi_id column to matakuliah
  await knex.schema.alterTable('matakuliah', (table) => {
    table.uuid('prodi_id')
      .nullable()
      .references('id')
      .inTable('program_studi')
      .onDelete('SET NULL');
  });

  const prodiIf = 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d';
  const prodiSi = 'b2c3d4e5-f67a-8b9c-0d1e-2f3a4b5c6d7e';
  const prodiMn = 'c3d4e5f6-7a8b-9c0d-1e2f-3a4b5c6d7e8f';

  // 2. Update existing matakuliah to belong to Teknik Informatika (IF)
  await knex('matakuliah').update({ prodi_id: prodiIf });

  // 3. Seed additional matakuliah and kelas for Sistem Informasi and Manajemen
  const [mkSi] = await knex('matakuliah').insert({
    kode: 'SI101',
    nama: 'Analisis dan Desain Sistem',
    sks: 3,
    semester: 1,
    prodi_id: prodiSi
  }).returning('id');

  await knex('kelas').insert({
    matakuliah_id: mkSi.id,
    hari: 'Rabu',
    jam: '08:00 - 10:30',
    ruangan: 'R. 302',
    dosen: 'Bpk. Kurniawan M.',
    kuota: 40
  });

  const [mkMn] = await knex('matakuliah').insert({
    kode: 'MN101',
    nama: 'Pengantar Manajemen Bisnis',
    sks: 3,
    semester: 1,
    prodi_id: prodiMn
  }).returning('id');

  await knex('kelas').insert({
    matakuliah_id: mkMn.id,
    hari: 'Kamis',
    jam: '08:00 - 10:30',
    ruangan: 'R. 101',
    dosen: 'Ibu Herlina S.',
    kuota: 40
  });
}

export async function down(knex: Knex): Promise<void> {
  const siMk = await knex('matakuliah').whereIn('kode', ['SI101', 'MN101']).select('id');
  const mkIds = siMk.map(m => m.id);
  
  if (mkIds.length > 0) {
    await knex('kelas').whereIn('matakuliah_id', mkIds).del();
    await knex('matakuliah').whereIn('id', mkIds).del();
  }

  await knex.schema.alterTable('matakuliah', (table) => {
    table.dropColumn('prodi_id');
  });
}
