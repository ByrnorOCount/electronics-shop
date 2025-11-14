import db from '../../config/db.js';

/**
 * Finds all users in the system.
 * @returns {Promise<Array>} A promise that resolves to an array of user objects.
 */
export const findAllUsers = () => {
    return db('users')
        .select('id', 'first_name', 'last_name', 'email', 'role', 'created_at')
        .orderBy('id', 'asc');
};

/**
 * Updates the role of a specific user.
 * @param {number} userId - The ID of the user to update.
 * @param {string} role - The new role for the user.
 * @returns {Promise<object|undefined>} The updated user object or undefined if not found.
 */
export const updateUserRole = async (userId, role) => {
    const [updatedUser] = await db('users')
        .where({ id: userId })
        .update({ role })
        .returning(['id', 'email', 'role']);
    return updatedUser;
};

/**
 * Deletes a user from the database.
 * @param {number} userId - The ID of the user to delete.
 * @returns {Promise<number>} The number of deleted rows.
 */
export const deleteUser = (userId) => {
    return db('users').where({ id: userId }).del();
};

/**
 * Fetches key metrics for the admin dashboard.
 * @returns {Promise<object>} An object containing dashboard metrics.
 */
export const getDashboardMetrics = async () => {
    const [totalSales] = await db('orders').sum('total_amount as total');
    const [userCount] = await db('users').count('id as count');
    const [orderCount] = await db('orders').count('id as count');
    const recentOrders = await db('orders').orderBy('created_at', 'desc').limit(5);

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
    const [newCategory] = await db('categories').insert(categoryData).returning('*');
    return newCategory;
};

/**
 * Finds all product categories.
 * @returns {Promise<Array>} An array of all category objects.
 */
export const findAllCategories = () => {
    return db('categories').orderBy('id', 'asc');
};

/**
 * Updates an existing product category.
 * @param {number} categoryId - The ID of the category to update.
 * @param {object} updateData - The fields to update.
 * @returns {Promise<object|undefined>} The updated category object or undefined if not found.
 */
export const updateCategory = async (categoryId, updateData) => {
    const [updatedCategory] = await db('categories')
        .where({ id: categoryId })
        .update(updateData)
        .returning('*');
    return updatedCategory;
};

/**
 * Deletes a product category.
 * @param {number} categoryId - The ID of the category to delete.
 * @returns {Promise<number>} The number of deleted rows.
 */
export const deleteCategory = (categoryId) => {
    return db('categories').where({ id: categoryId }).del();
};
