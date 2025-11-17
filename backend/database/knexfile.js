import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Since we are using ES Modules, __dirname is not available. This is the workaround.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env file from the parent 'backend' directory
dotenv.config({ path: path.resolve(__dirname, "../.env") });

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
export default {
  development: {
    client: "pg",
    connection: {
      host: process.env.DB_HOST || "localhost",
      port: process.env.DB_PORT || 5432,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    },
    migrations: {
      directory: path.join(__dirname, "/migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "/seeders"),
    },
  },

  // Production configuration can be added here later
};
