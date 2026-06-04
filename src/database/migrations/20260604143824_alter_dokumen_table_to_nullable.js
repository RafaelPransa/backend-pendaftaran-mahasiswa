/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.alterTable('dokumen', (table) => {
    table.string('ktp', 255).nullable().alter();
    table.string('kartu_keluarga', 255).nullable().alter();
    table.string('ijazah_skl', 255).nullable().alter();
    table.string('pas_foto', 255).nullable().alter();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.alterTable('dokumen', (table) => {
    table.string('ktp', 255).notNullable().alter();
    table.string('kartu_keluarga', 255).notNullable().alter();
    table.string('ijazah_skl', 255).notNullable().alter();
    table.string('pas_foto', 255).notNullable().alter();
  });
};
