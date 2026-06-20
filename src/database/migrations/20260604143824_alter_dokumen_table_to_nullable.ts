import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('dokumen', (table) => {
    table.string('ktp', 255).nullable().alter();
    table.string('kartu_keluarga', 255).nullable().alter();
    table.string('ijazah_skl', 255).nullable().alter();
    table.string('pas_foto', 255).nullable().alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('dokumen', (table) => {
    table.string('ktp', 255).notNullable().alter();
    table.string('kartu_keluarga', 255).notNullable().alter();
    table.string('ijazah_skl', 255).notNullable().alter();
    table.string('pas_foto', 255).notNullable().alter();
  });
}
