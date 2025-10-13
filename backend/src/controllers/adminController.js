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
