export default {
  development: {
    client: "pg",
    connection: {
      host: process.env.DB_HOST || "127.0.0.1",
      port: process.env.DB_PORT || 5432,
      user: process.env.DB_USER || "postgres",
      password: process.env.DB_PASS || "password",
      database: process.env.DB_NAME || "online_shop"
    },
    migrations: {
      directory: "./database/migrations"
    },
    seeds: {
      directory: "./database/seeders"
    }
  }
};
