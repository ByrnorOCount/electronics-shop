import app from "./app.js";
import db from "./config/db.js";
import logger from "./config/logger.js";
import env from "./config/env.js";

const PORT = env.PORT || 3001;

let server;

const startServer = async () => {
  try {
    server = app.listen(PORT, () => {
      logger.info(`🚀 Server running on http://localhost:${PORT}`);
      logger.info(`✨ Frontend should be at ${env.FRONTEND_URL}`);
    });

    // 2. After the server is listening, test the database connection.
    // This prevents a slow DB connection from blocking the server startup.
    await db.raw("SELECT 1");
    logger.info("✅ Database connection successful.");
  } catch (error) {
    logger.error("❌ Failed to start server or connect to database:", error);
    process.exit(1);
  }
};

startServer();

const unexpectedErrorHandler = (error) => {
  logger.error("UNHANDLED ERROR:", error);
  if (server) {
    server.close(() => {
      logger.info("Server closed due to unhandled error.");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

// Listen for uncaught exceptions (synchronous errors)
process.on("uncaughtException", unexpectedErrorHandler);

// Listen for unhandled promise rejections (asynchronous errors)
process.on("unhandledRejection", (reason) => {
  // The 'reason' for a rejection can be any value, not just an Error object.
  // We wrap it in an error to ensure a consistent stack trace for logging.
  const error = new Error(`UNHANDLED REJECTION: ${reason}`);
  unexpectedErrorHandler(error);
});
