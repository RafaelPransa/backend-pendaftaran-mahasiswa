import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Menambahkan kolom status_verifikasi, status_kelulusan, dan catatan ke tabel users
  await knex.schema.alterTable('users', (table) => {
    table.string('status_verifikasi', 50).defaultTo('belum_diverifikasi');
    table.string('status_kelulusan', 50).defaultTo('proses');
    table.text('catatan').nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  // Menghapus kolom jika rollback
  await knex.schema.alterTable('users', (table) => {
    table.dropColumn('status_verifikasi');
    table.dropColumn('status_kelulusan');
    table.dropColumn('catatan');
  });
}
