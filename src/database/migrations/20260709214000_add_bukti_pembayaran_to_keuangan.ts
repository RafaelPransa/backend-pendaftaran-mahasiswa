import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('keuangan', (table) => {
    table.string('bukti_pembayaran', 255).nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('keuangan', (table) => {
    table.dropColumn('bukti_pembayaran');
  });
}
