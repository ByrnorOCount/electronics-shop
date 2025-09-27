import knex from "knex";
import knexConfig from "../../database/knexfile.js";

const db = knex(knexConfig[process.env.NODE_ENV || "development"]);

export default db;