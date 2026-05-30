/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  // Aktifkan ekstensi uuid-ossp di PostgreSQL agar bisa generate UUID otomatis
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
  // Buat table users
  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('nama_lengkap', 255).notNullable();
    table.string('nik', 16).notNullable().unique();
    table.string('nomor_wa', 15).notNullable();
    table.string('email', 255).notNullable().unique();
    table.string('password', 255).notNullable();
    table.string('role', 50).defaultTo('student');
    table.timestamps(true, true); // Otomatis membuat kolom created_at dan updated_at
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  // Menghapus tabel dengan urutan terbalik
  await knex.schema.dropTableIfExists('users');
};
