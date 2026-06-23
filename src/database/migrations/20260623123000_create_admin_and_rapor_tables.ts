import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // 1. Buat Tabel Program Studi
  await knex.schema.createTable('program_studi', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('kode', 50).notNullable().unique();
    table.string('nama', 255).notNullable();
    table.string('fakultas', 255).notNullable();
    table.timestamps(true, true);
  });

  // 2. Buat Tabel Nilai Rapor Semester 1-5
  await knex.schema.createTable('nilai_rapor', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.integer('semester').notNullable();
    table.decimal('matematika', 5, 2).notNullable();
    table.decimal('bahasa_indonesia', 5, 2).notNullable();
    table.decimal('bahasa_inggris', 5, 2).notNullable();
    table.decimal('ipa', 5, 2).notNullable();
    table.decimal('ips', 5, 2).notNullable();
    table.timestamps(true, true);
    table.unique(['user_id', 'semester']);
  });

  // 3. Buat Tabel Pengumuman
  await knex.schema.createTable('pengumuman', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('judul', 255).notNullable();
    table.text('konten').notNullable();
    table.string('kategori', 100).notNullable(); // 'PMB', 'Akademik'
    table.timestamps(true, true);
  });

  // 4. Alter Tabel biodata: Tambah Pilihan Prodi 1 & 2
  await knex.schema.alterTable('biodata', (table) => {
    table.uuid('pilihan_prodi_1').nullable().references('id').inTable('program_studi').onDelete('SET NULL');
    table.uuid('pilihan_prodi_2').nullable().references('id').inTable('program_studi').onDelete('SET NULL');
  });

  // 5. Alter Tabel dokumen: Tambah Status & Catatan Verifikasi Per Berkas
  await knex.schema.alterTable('dokumen', (table) => {
    table.string('ktp_status', 50).defaultTo('belum_diverifikasi');
    table.text('ktp_catatan').nullable();
    table.string('kartu_keluarga_status', 50).defaultTo('belum_diverifikasi');
    table.text('kartu_keluarga_catatan').nullable();
    table.string('ijazah_skl_status', 50).defaultTo('belum_diverifikasi');
    table.text('ijazah_skl_catatan').nullable();
    table.string('pas_foto_status', 50).defaultTo('belum_diverifikasi');
    table.text('pas_foto_catatan').nullable();
  });

  // 6. Alter Tabel krs: Tambah Status Persetujuan & Catatan
  await knex.schema.alterTable('krs', (table) => {
    table.string('status_persetujuan', 50).defaultTo('proses'); // 'proses', 'disetujui', 'ditolak'
    table.text('catatan').nullable();
  });

  // 7. Seed Program Studi Default
  const prodiIds = [
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    'b2c3d4e5-f67a-8b9c-0d1e-2f3a4b5c6d7e',
    'c3d4e5f6-7a8b-9c0d-1e2f-3a4b5c6d7e8f',
    'd4e5f67a-8b9c-0d1e-2f3a-4b5c6d7e8f9a',
    'e5f67a8b-9c0d-1e2f-3a4b-5c6d7e8f9a0b'
  ];

  await knex('program_studi').insert([
    { id: prodiIds[0], kode: 'IF', nama: 'Teknik Informatika', fakultas: 'Teknik' },
    { id: prodiIds[1], kode: 'SI', nama: 'Sistem Informasi', fakultas: 'Teknik' },
    { id: prodiIds[2], kode: 'MN', nama: 'Manajemen', fakultas: 'Ekonomi dan Bisnis' },
    { id: prodiIds[3], kode: 'AK', nama: 'Akuntansi', fakultas: 'Ekonomi dan Bisnis' },
    { id: prodiIds[4], kode: 'HI', nama: 'Hubungan Internasional', fakultas: 'Ilmu Sosial dan Ilmu Politik' }
  ]);

  // 8. Seed Pengumuman Default
  await knex('pengumuman').insert([
    {
      judul: 'Penerimaan Mahasiswa Baru Gelombang 2 Dibuka!',
      konten: 'Pendaftaran Gelombang 2 resmi dibuka dari 1 April s.d 30 Juni 2026. Segera daftarkan diri Anda dan lengkapi berkas persyaratan.',
      kategori: 'PMB'
    },
    {
      judul: 'Jadwal Pengisian KRS Semester Ganjil 2026/2027',
      konten: 'Pengisian KRS dimulai dari tanggal 22 Juni s.d. 30 Juni 2026. Pastikan Anda telah melunasi tagihan UKT semester ini.',
      kategori: 'Akademik'
    }
  ]);
}

export async function down(knex: Knex): Promise<void> {
  // 1. Rollback Alter krs
  await knex.schema.alterTable('krs', (table) => {
    table.dropColumn('status_persetujuan');
    table.dropColumn('catatan');
  });

  // 2. Rollback Alter dokumen
  await knex.schema.alterTable('dokumen', (table) => {
    table.dropColumn('ktp_status');
    table.dropColumn('ktp_catatan');
    table.dropColumn('kartu_keluarga_status');
    table.dropColumn('kartu_keluarga_catatan');
    table.dropColumn('ijazah_skl_status');
    table.dropColumn('ijazah_skl_catatan');
    table.dropColumn('pas_foto_status');
    table.dropColumn('pas_foto_catatan');
  });

  // 3. Rollback Alter biodata
  await knex.schema.alterTable('biodata', (table) => {
    table.dropColumn('pilihan_prodi_2');
    table.dropColumn('pilihan_prodi_1');
  });

  // 4. Drop Tables
  await knex.schema.dropTableIfExists('pengumuman');
  await knex.schema.dropTableIfExists('nilai_rapor');
  await knex.schema.dropTableIfExists('program_studi');
}
