import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // 1. Tabel PMB Jadwal
  await knex.schema.createTable('pmb_jadwal', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('gelombang', 100).notNullable();
    table.date('tanggal_mulai').notNullable();
    table.date('tanggal_selesai').notNullable();
    table.string('status', 50).notNullable();
    table.timestamps(true, true);
  });

  // 2. Tabel PMB Persyaratan
  await knex.schema.createTable('pmb_persyaratan', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('deskripsi', 255).notNullable();
    table.timestamps(true, true);
  });

  // 3. Masukkan Data Seed Awal
  await knex('pmb_jadwal').insert([
    { gelombang: 'Gelombang 1', tanggal_mulai: '2026-01-01', tanggal_selesai: '2026-03-31', status: 'Selesai' },
    { gelombang: 'Gelombang 2', tanggal_mulai: '2026-04-01', tanggal_selesai: '2026-06-30', status: 'Aktif' },
    { gelombang: 'Gelombang 3', tanggal_mulai: '2026-07-01', tanggal_selesai: '2026-08-31', status: 'Mendatang' },
  ]);

  await knex('pmb_persyaratan').insert([
    { deskripsi: 'Scan Kartu Tanda Penduduk (KTP)' },
    { deskripsi: 'Scan Kartu Keluarga (KK)' },
    { deskripsi: 'Scan Ijazah Terakhir / Surat Keterangan Lulus (SKL)' },
    { deskripsi: 'Pas Foto 4x6 latar belakang merah (format JPG/PNG)' },
  ]);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('pmb_persyaratan');
  await knex.schema.dropTableIfExists('pmb_jadwal');
}
