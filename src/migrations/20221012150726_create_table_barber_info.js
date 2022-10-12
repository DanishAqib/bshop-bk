/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .raw(
      'CREATE EXTENSION IF NOT EXISTS "uuid-ossp"; CREATE EXTENSION IF NOT EXISTS tablefunc;'
    )
    .createTable("barber_info", (table) => {
      table.uuid("bi_id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
      table.uuid("b_id").references("u_id").inTable("users").notNullable();
      table.string("b_status").notNullable();
      table.string("b_city").notNullable();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("barber_info");
};
