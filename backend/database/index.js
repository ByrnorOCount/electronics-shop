import knex from "knex";
import config from "./knexfile.js";

const db = knex(config.development);

export default db;

// usage example in service file
// import db from "../../database/index.js";

// export async function getAllProducts() {
//   return await db("products").select("*");
// }
