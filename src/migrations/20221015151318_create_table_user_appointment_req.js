/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .raw(
      'CREATE EXTENSION IF NOT EXISTS "uuid-ossp"; CREATE EXTENSION IF NOT EXISTS tablefunc;'
    )
    .createTable("user_appointment_req", (table) => {
      table.uuid("uar_id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
      table.uuid("u_id").references("u_id").inTable("users").notNullable();
      table.uuid("b_id").references("u_id").inTable("users").notNullable();
      table.string("uar_time").notNullable();
      table.string("uar_services").notNullable();
      table.string("uar_total_price").notNullable();
      table.string("uar_status").defaultTo("pending");
      table.timestamp("uar_created_at").defaultTo(knex.fn.now());
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("user_appointment_req");
};
