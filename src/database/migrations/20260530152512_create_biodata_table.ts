import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('biodata', (table) => {
    // Relasi ke table users (1 user memiliki 1 biodata)
    table
      .uuid('user_id')
      .primary()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE'); // Jika akun user dihapus, biodata otomatis ikut terhapus

    // Data Pribadi
    table.string('tempat_lahir', 100).notNullable();
    table.string('tanggal_lahir', 10).notNullable();
    table.enum('jenis_kelamin', ['L', 'P']).notNullable();
    table.string('agama', 50).notNullable();

    // Kontak & Alamat
    table.text('alamat_lengkap').notNullable();
    table.string('provinsi', 50).notNullable();
    table.string('kota_kabupaten', 50).notNullable();
    table.string('kecamatan', 50).notNullable();
    table.string('kode_pos', 5).notNullable();

    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('biodata');
}
