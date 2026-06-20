import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // 1. Tabel Mata Kuliah
  await knex.schema.createTable('matakuliah', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('kode', 50).notNullable().unique();
    table.string('nama', 255).notNullable();
    table.integer('sks').notNullable();
    table.integer('semester').notNullable();
    table.timestamps(true, true);
  });

  // 2. Tabel Kelas Kuliah
  await knex.schema.createTable('kelas', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table
      .uuid('matakuliah_id')
      .references('id')
      .inTable('matakuliah')
      .onDelete('CASCADE');
    table.string('hari', 20).notNullable();
    table.string('jam', 20).notNullable();
    table.string('ruangan', 50).notNullable();
    table.string('dosen', 255).notNullable();
    table.integer('kuota').notNullable();
    table.timestamps(true, true);
  });

  // 3. Tabel KRS (Kartu Rencana Studi)
  await knex.schema.createTable('krs', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.uuid('kelas_id').references('id').inTable('kelas').onDelete('CASCADE');
    table.integer('semester').notNullable();
    table.string('tahun_akademik', 20).notNullable();
    table.timestamps(true, true);
    table.unique(['user_id', 'kelas_id', 'tahun_akademik']);
  });

  // 4. Tabel KHS (Kartu Hasil Studi / Nilai)
  await knex.schema.createTable('khs', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
    table
      .uuid('matakuliah_id')
      .references('id')
      .inTable('matakuliah')
      .onDelete('CASCADE');
    table.integer('semester').notNullable();
    table.decimal('nilai_angka', 5, 2).notNullable();
    table.string('nilai_huruf', 2).notNullable();
    table.timestamps(true, true);
    table.unique(['user_id', 'matakuliah_id']);
  });

  // 5. Tabel Keuangan (Tagihan UKT)
  await knex.schema.createTable('keuangan', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.integer('semester').notNullable();
    table.decimal('tagihan', 12, 2).notNullable();
    table.string('status', 20).defaultTo('belum_bayar'); // 'belum_bayar', 'lunas'
    table.timestamp('tanggal_bayar').nullable();
    table.timestamps(true, true);
    table.unique(['user_id', 'semester']);
  });

  // 6. Tabel Forum Threads
  await knex.schema.createTable('forum_threads', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.string('judul', 255).notNullable();
    table.text('konten').notNullable();
    table.string('kategori', 50).notNullable();
    table.timestamps(true, true);
  });

  // 7. Tabel Forum Replies
  await knex.schema.createTable('forum_replies', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table
      .uuid('thread_id')
      .references('id')
      .inTable('forum_threads')
      .onDelete('CASCADE');
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.text('konten').notNullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  // Drop tables in reverse order of creation to prevent foreign key constraint issues
  await knex.schema.dropTableIfExists('forum_replies');
  await knex.schema.dropTableIfExists('forum_threads');
  await knex.schema.dropTableIfExists('keuangan');
  await knex.schema.dropTableIfExists('khs');
  await knex.schema.dropTableIfExists('krs');
  await knex.schema.dropTableIfExists('kelas');
  await knex.schema.dropTableIfExists('matakuliah');
}
