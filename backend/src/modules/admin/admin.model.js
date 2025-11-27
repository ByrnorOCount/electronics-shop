import db from "../../config/db.js";

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
    .groupBy("date")
    .orderBy("date", "asc");

  const topProducts = await db("order_items")
    .join("products", "order_items.product_id", "products.id")
    .select("products.name")
    .sum("order_items.quantity as total_quantity")
    .groupBy("products.name")
    .orderBy("total_quantity", "desc")
    .limit(5);

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
  // This is a placeholder for reading from a file system or a logging service.
  // For a real implementation, you'd use fs.readFile or a stream.
  // We will simulate this in the service layer for now.
  return {
    // This would be populated by reading and parsing log files.
    // Example:
    // const allLogs = fs.readFileSync('logs/all.log', 'utf8');
    // const errorLogs = fs.readFileSync('logs/error.log', 'utf8');
    // return { all: allLogs.split('\n'), error: errorLogs.split('\n') };
    all: ["INFO: Server started successfully.", "DEBUG: User 1 logged in."],
    error: ["ERROR: Database connection failed at ..."],
  };
};
