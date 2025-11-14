import * as Admin from './admin.model.js';

/**
 * Get all users in the system.
 * @route GET /api/admin/users
 * @access Admin
 */
export const getAllUsers = async (req, res) => {
  try {
    const users = await Admin.findAllUsers();
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
    const updatedUser = await Admin.updateUserRole(id, role);
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
    const deletedCount = await Admin.deleteUser(id);
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
    const metrics = await Admin.getDashboardMetrics();
    res.status(200).json(metrics);
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
    const newCategory = await Admin.createCategory({ name, description });
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
    const categories = await Admin.findAllCategories();
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
    const updatedCategory = await Admin.updateCategory(id, { name, description });
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
    const deletedCount = await Admin.deleteCategory(id);
    if (deletedCount === 0) {
      return res.status(404).json({ message: 'Category not found.' });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ message: 'Server error while deleting category.' });
  }
};
