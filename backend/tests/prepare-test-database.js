import { Client } from "pg";
import knex from "knex";
import knexConfig from "../database/knexfile.js";

const testDatabaseName = "electronics_shop_test";
const testConfig = knexConfig.test;
const adminClient = new Client({
  ...testConfig.connection,
  database: "postgres",
});

await adminClient.connect();
try {
  const { rows } = await adminClient.query(
    "SELECT 1 FROM pg_database WHERE datname = $1",
    [testDatabaseName]
  );

  if (rows.length === 0) {
    await adminClient.query(`CREATE DATABASE "${testDatabaseName}"`);
  }
} finally {
  await adminClient.end();
}

const testDb = knex(testConfig);
try {
  await testDb.migrate.latest();
} finally {
  await testDb.destroy();
}
