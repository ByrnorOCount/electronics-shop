import knex from "knex";
import knexConfig from "../../database/knexfile.js";
import env from "./env.js";

const db = knex(knexConfig[env.NODE_ENV || "development"]);

export default db;
