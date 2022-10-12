const Knex = require("knex");

const databaseName = "bshop";

const connection = {
  host: "localhost",
  user: "postgres",
  password: "postgres",
};

async function main() {
  let knex = Knex({
    client: "pg",
    connection,
  });

  await knex.raw(`CREATE DATABASE ${databaseName}`);

  knex = Knex({
    client: "pg",
    connection: {
      ...connection,
      database: databaseName,
    },
  });
}

main().catch().then(process.exit);
