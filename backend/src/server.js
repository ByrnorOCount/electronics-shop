import app from "./app.js";
import db from "./config/db.js";

const PORT = process.env.PORT || 3001;

const startServer = async () => {
  try {
    // 1. Start the Express server and listen for incoming requests immediately.
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });

    // 2. After the server is listening, test the database connection.
    // This prevents a slow DB connection from blocking the server startup.
    await db.raw("SELECT 1");
    console.log("✅ Database connection successful.");
  } catch (error) {
    console.error("❌ Failed to start server or connect to database:", error);
    process.exit(1);
  }
};

startServer();
