import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('biodata', (table) => {
    table.string('pendidikan_terakhir', 50).nullable();
    table.string('nama_sekolah', 255).nullable();
    table.string('jurusan_sekolah', 100).nullable();
    table.string('tahun_lulus', 10).nullable();
    table.string('nisn', 20).nullable();
    table.text('alamat_sekolah').nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('biodata', (table) => {
    table.dropColumn('alamat_sekolah');
    table.dropColumn('nisn');
    table.dropColumn('tahun_lulus');
    table.dropColumn('jurusan_sekolah');
    table.dropColumn('nama_sekolah');
    table.dropColumn('pendidikan_terakhir');
  });
}
