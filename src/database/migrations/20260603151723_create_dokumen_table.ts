import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('dokumen', (table) => {
    // Terikat erat dengan user_id sebagai Primary Key & Foreign Key
    table
      .uuid('user_id')
      .primary()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');

    // Menyimpan nama/oath file yang diupload ke server
    table.string('ktp', 255).notNullable();
    table.string('kartu_keluarga', 255).notNullable();
    table.string('ijazah_skl', 255).notNullable();
    table.string('pas_foto', 255).notNullable();

    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('dokumen');
}
