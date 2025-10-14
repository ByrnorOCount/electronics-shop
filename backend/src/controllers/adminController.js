import db from '../config/db.js';

/**
 * Get all users in the system.
 * @route GET /api/admin/users
 * @access Admin
 */
export const getAllUsers = async (req, res) => {
  try {
    const users = await db('users')
      .select('id', 'first_name', 'last_name', 'email', 'role', 'created_at')
      .orderBy('id', 'asc');
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching all users:', error);
    res.status(500).json({ message: 'Server error while fetching users.' });
  }
};

/**
 * Update a user's role.
 * @route PUT /api/admin/users/:id
 * @access Admin
 */
export const updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!role || !['customer', 'staff', 'admin'].includes(role)) {
    return res.status(400).json({ message: 'A valid role (customer, staff, admin) is required.' });
  }

  try {
    const [updatedUser] = await db('users')
      .where({ id })
      .update({ role })
      .returning(['id', 'email', 'role']);

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.status(200).json({ message: 'User role updated successfully.', user: updatedUser });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ message: 'Server error while updating user role.' });
  }
};

/**
 * Delete a user.
 * @route DELETE /api/admin/users/:id
 * @access Admin
 */
export const deleteUser = async (req, res) => {
  const { id } = req.params;

  // Prevent admin from deleting themselves
  if (Number(id) === req.user.id) {
    return res.status(400).json({ message: 'Cannot delete your own admin account.' });
  }

  try {
    const deletedCount = await db('users').where({ id }).del();
    if (deletedCount === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error while deleting user.' });
  }
};

/**
 * Get dashboard metrics.
 * @route GET /api/admin/dashboard
 * @access Admin
 */
export const getDashboardMetrics = async (req, res) => {
  try {
    const [totalSales] = await db('orders').sum('total_amount as total');
    const [userCount] = await db('users').count('id as count');
    const [orderCount] = await db('orders').count('id as count');
    const recentOrders = await db('orders').orderBy('created_at', 'desc').limit(5);

    res.status(200).json({
      totalSales: totalSales.total || 0,
      totalUsers: userCount.count || 0,
      totalOrders: orderCount.count || 0,
      recentOrders,
    });
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    res.status(500).json({ message: 'Server error while fetching dashboard metrics.' });
  }
};

/**
 * Create a new category.
 * @route POST /api/admin/categories
 * @access Admin
 */
export const createCategory = async (req, res) => {
  const { name, description } = req.body;
  if (!name) {
    return res.status(400).json({ message: 'Category name is required.' });
  }

  try {
    const [newCategory] = await db('categories').insert({ name, description }).returning('*');
    res.status(201).json(newCategory);
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ message: 'Server error while creating category.' });
  }
};

/**
 * Get all categories.
 * @route GET /api/admin/categories
 * @access Admin
 */
export const getAllCategories = async (req, res) => {
  try {
    const categories = await db('categories').orderBy('id', 'asc');
    res.status(200).json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Server error while fetching categories.' });
  }
};

/**
 * Update a category.
 * @route PUT /api/admin/categories/:id
 * @access Admin
 */
export const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  if (!name && !description) {
    return res.status(400).json({ message: 'Name or description is required to update.' });
  }

  try {
    const [updatedCategory] = await db('categories').where({ id }).update({ name, description }).returning('*');
    if (!updatedCategory) {
      return res.status(404).json({ message: 'Category not found.' });
    }
    res.status(200).json(updatedCategory);
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ message: 'Server error while updating category.' });
  }
};

/**
 * Delete a category.
 * @route DELETE /api/admin/categories/:id
 * @access Admin
 */
export const deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    // Note: Products using this category will have their category_id set to NULL
    // due to the onDelete('SET NULL') constraint in the migration.
    const deletedCount = await db('categories').where({ id }).del();
    if (deletedCount === 0) {
      return res.status(404).json({ message: 'Category not found.' });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ message: 'Server error while deleting category.' });
  }
};
