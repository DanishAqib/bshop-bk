/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .raw(
      'CREATE EXTENSION IF NOT EXISTS "uuid-ossp"; CREATE EXTENSION IF NOT EXISTS tablefunc;'
    )
    .createTable("users", (table) => {
      table.uuid("u_id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
      table.string("u_firstname").notNullable();
      table.string("u_lastname").notNullable();
      table.string("u_email").notNullable();
      table.string("u_password").notNullable();
      table.string("u_role").notNullable().defaultTo("customer");
      table.unique("u_email");
    });
};

exports.down = function (knex) {
  return knex.schema.dropTable("users");
};
