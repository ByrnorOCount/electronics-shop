import db from "../../config/db.js";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

/**
 * Finds all users in the system.
 * @returns {Promise<Array>} A promise that resolves to an array of user objects.
 */
export const findAllUsers = () => {
  return db("users")
    .select("id", "first_name", "last_name", "email", "role", "created_at")
    .orderBy("id", "asc");
};

/**
 * Updates the role of a specific user.
 * @param {number} userId - The ID of the user to update.
 * @param {string} role - The new role for the user.
 * @returns {Promise<object|undefined>} The updated user object or undefined if not found.
 */
export const updateUserRole = async (userId, role) => {
  const [updatedUser] = await db("users")
    .where({ id: userId })
    .update({ role })
    .returning(["id", "email", "role"]);
  return updatedUser;
};

/**
 * Deletes a user from the database.
 * @param {number} userId - The ID of the user to delete.
 * @returns {Promise<number>} The number of deleted rows.
 */
export const deleteUser = (userId) => {
  return db("users").where({ id: userId }).del();
};

/**
 * Fetches key metrics for the admin dashboard.
 * @returns {Promise<object>} An object containing dashboard metrics.
 */
export const getDashboardMetrics = async () => {
  const [totalSales] = await db("orders").sum("total_amount as total");
  const [userCount] = await db("users").count("id as count");
  const [orderCount] = await db("orders").count("id as count");
  const recentOrders = await db("orders")
    .orderBy("created_at", "desc")
    .limit(5);

  return {
    totalSales: totalSales.total || 0,
    totalUsers: userCount.count || 0,
    totalOrders: orderCount.count || 0,
    recentOrders,
  };
};

/**
 * Creates a new product category.
 * @param {object} categoryData - The data for the new category.
 * @returns {Promise<object>} The newly created category object.
 */
export const createCategory = async (categoryData) => {
  const [newCategory] = await db("categories")
    .insert(categoryData)
    .returning("*");
  return newCategory;
};

/**
 * Finds all product categories.
 * @returns {Promise<Array>} An array of all category objects.
 */
export const findAllCategories = () => {
  return db("categories").orderBy("id", "asc");
};

/**
 * Updates an existing product category.
 * @param {number} categoryId - The ID of the category to update.
 * @param {object} updateData - The fields to update.
 * @returns {Promise<object|undefined>} The updated category object or undefined if not found.
 */
export const updateCategory = async (categoryId, updateData) => {
  const [updatedCategory] = await db("categories")
    .where({ id: categoryId })
    .update(updateData)
    .returning("*");
  return updatedCategory;
};

/**
 * Deletes a product category.
 * @param {number} categoryId - The ID of the category to delete.
 * @returns {Promise<number>} The number of deleted rows.
 */
export const deleteCategory = (categoryId) => {
  return db("categories").where({ id: categoryId }).del();
};

/**
 * Fetches detailed analytics data based on provided options.
 * @param {object} options - Filtering and aggregation options.
 * @returns {Promise<object>} Detailed analytics data.
 */
export const fetchAnalyticsData = async ({ startDate, endDate }) => {
  const salesByDay = await db("orders")
    .select(
      db.raw("DATE(created_at) as date"),
      db.raw("SUM(total_amount) as total")
    )
    .whereBetween("created_at", [startDate, endDate])
    .whereNot("status", "Cancelled")
    .groupBy("date")
    .orderBy("date", "asc");

  const topProducts = await db("order_items")
    .join("products", "order_items.product_id", "products.id")
    .join("orders", "order_items.order_id", "orders.id")
    .select(
      "products.id",
      "products.name",
      db.raw("CAST(SUM(order_items.quantity) AS INTEGER) as total_quantity"),
      db.raw("SUM(order_items.quantity * order_items.price) as total_sales")
    )
    .whereBetween("orders.created_at", [startDate, endDate])
    .whereNot("orders.status", "Cancelled")
    .groupBy("products.id", "products.name")
    .orderBy("total_quantity", "desc")
    .limit(5);

  const salesByCategory = await db("order_items")
    .join("orders", "order_items.order_id", "orders.id")
    .join("products", "order_items.product_id", "products.id")
    .leftJoin("categories", "products.category_id", "categories.id")
    .select(
      "categories.id",
      db.raw("COALESCE(categories.name, 'Uncategorized') as name"),
      db.raw("CAST(SUM(order_items.quantity) AS INTEGER) as total_quantity"),
      db.raw("SUM(order_items.quantity * order_items.price) as total_sales")
    )
    .whereBetween("orders.created_at", [startDate, endDate])
    .whereNot("orders.status", "Cancelled")
    .groupBy("categories.id", "categories.name")
    .orderBy("total_sales", "desc");

  const customerPurchases = () =>
    db("orders")
      .join("users", "orders.user_id", "users.id")
      .select(
        "users.id",
        "users.first_name",
        "users.last_name",
        "users.email",
        db.raw("CAST(COUNT(orders.id) AS INTEGER) as order_count"),
        db.raw("SUM(orders.total_amount) as total_spent"),
        db.raw("AVG(orders.total_amount) as average_order_value")
      )
      .whereBetween("orders.created_at", [startDate, endDate])
      .whereNot("orders.status", "Cancelled")
      .whereRaw("LOWER(users.role) = ?", ["customer"])
      .groupBy("users.id");

  const topCustomers = await customerPurchases()
    .orderBy("total_spent", "desc")
    .limit(10);

  const customerSegments = await db
    .from(customerPurchases().as("customer_purchases"))
    .select(
      db.raw(`
        CASE
          WHEN order_count = 1 THEN 'One-time'
          WHEN order_count BETWEEN 2 AND 4 THEN 'Repeat'
          ELSE 'Loyal'
        END as segment
      `),
      db.raw("CAST(COUNT(*) AS INTEGER) as customer_count"),
      db.raw("SUM(total_spent) as total_spent")
    )
    .groupBy("segment")
    .orderBy("segment", "asc");

  const newUserSignups = await db("users")
    .select(db.raw("DATE(created_at) as date"), db.raw("COUNT(id) as count"))
    .whereBetween("created_at", [startDate, endDate])
    .groupBy("date")
    .orderBy("date", "asc");

  const [orderStatusDistribution] = await db("orders")
    .select(
      db.raw("COUNT(*) as total"),
      db.raw("SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) as pending"),
      db.raw(
        "SUM(CASE WHEN status = 'Processing' THEN 1 ELSE 0 END) as processing"
      ),
      db.raw("SUM(CASE WHEN status = 'Shipped' THEN 1 ELSE 0 END) as shipped"),
      db.raw(
        "SUM(CASE WHEN status = 'Delivered' THEN 1 ELSE 0 END) as delivered"
      ),
      db.raw(
        "SUM(CASE WHEN status = 'Cancelled' THEN 1 ELSE 0 END) as cancelled"
      )
    )
    .whereBetween("created_at", [startDate, endDate]);

  return {
    salesByDay,
    topProducts,
    salesByCategory,
    topCustomers,
    customerSegments,
    newUserSignups,
    orderStatusDistribution,
  };
};

/**
 * Fetches system logs based on provided options.
 * @param {object} options - Filtering options for logs (e.g., date range, level).
 * @returns {Promise<object>} An object containing log entries.
 */
export const fetchSystemLogs = async (options) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const logDir = path.resolve(__dirname, "../../../logs");

  const readLogFile = async (fileName) => {
    try {
      const filePath = path.join(logDir, fileName);
      const data = await fs.readFile(filePath, "utf8");
      // Return the last 100 lines to avoid sending huge files
      return data.split("\n").slice(-100);
    } catch (error) {
      if (error.code === "ENOENT") {
        return [`Log file not found: ${fileName}`];
      }
      console.error(`Error reading log file ${fileName}:`, error);
      return [`Error reading log file: ${fileName}`];
    }
  };

  const allLogs = await readLogFile("all.log");
  const errorLogs = await readLogFile("error.log");

  return { all: allLogs, error: errorLogs };
};
