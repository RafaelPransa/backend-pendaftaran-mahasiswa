import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Drop existing nilai_rapor table and recreate it with the flat structure
  await knex.schema.dropTableIfExists('nilai_rapor');

  await knex.schema.createTable('nilai_rapor', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE').unique();
    table.decimal('semester_1', 5, 2).nullable();
    table.decimal('semester_2', 5, 2).nullable();
    table.decimal('semester_3', 5, 2).nullable();
    table.decimal('semester_4', 5, 2).nullable();
    table.decimal('semester_5', 5, 2).nullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('nilai_rapor');

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
}
