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
    table.string('email', 255).notNullable().unique();
    table.string('password', 255).notNullable();
    table.string('role', 50).defaultTo('student');
    table.timestamps(true, true); // Otomatis membuat kolom created_at dan updated_at
  });
  // Buat table biodata (Relasi 1:1 dengan Users)
  await knex.schema.createTable('biodata', (table) => {
    // user_id bertindak sebagai Primary Key sekaligus Foreign Key yang menuju table users
    table
      .uuid('user_id')
      .primary()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table.string('nik', 16).notNullable().unique();
    table.string('nama_lengkap', 255).notNullable();
    table.boolean('nama_lengkap_match_diploma').defaultTo(true);
    table.string('tempat_lahir', 100).notNullable();
    table.date('tanggal_lahir').notNullable();
    table.string('jenis_kelamin', 20).notNullable();
    table.string('agama', 50).notNullable();
    table.string('nomor_wa', 20).notNullable();
    table.text('alamat_lengkap').notNullable();
    table.string('provinsi', 100).notNullable();
    table.string('kota_kabupaten', 100).notNullable();
    table.string('kecamatan', 100).notNullable();
    table.string('kode_pos', 10).notNullable();
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  // Menghapus tabel dengan urutan terbalik (biodata dulu karena dia bergantung pada users)
  await knex.schema.dropTableIfExists('biodata');
  await knex.schema.dropTableIfExists('users');
};
