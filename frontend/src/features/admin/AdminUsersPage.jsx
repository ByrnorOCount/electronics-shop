import React, { useState, useEffect } from "react";
import { useApi } from "../../hooks/useApi";
import { adminService } from "../../api";
import { useAuth } from "../auth/useAuth";
import Spinner from "../../components/ui/Spinner";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import toast from "react-hot-toast";
import { formatStatus } from "../../utils/formatters";

const UserRow = ({ user, onEdit, onDelete, currentAdminId }) => {
  const isCurrentUser = user.id === currentAdminId;

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {user.id}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {user.first_name} {user.last_name}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
        {user.email}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
        <span
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            {
              admin: "bg-red-100 text-red-800",
              staff: "bg-blue-100 text-blue-800",
              customer: "bg-green-100 text-green-800",
            }[user.role.toLowerCase()] || "bg-gray-100 text-gray-800"
          }`}
        >
          {formatStatus(user.role)}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
        {new Date(user.created_at).toLocaleDateString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
        <Button
          size="sm"
          variant="secondary"
          onClick={() => onEdit(user)}
          disabled={isCurrentUser}
          title={isCurrentUser ? "You cannot change your own role" : ""}
        >
          Update Role
        </Button>
        <Button
          size="sm"
          variant="danger"
          onClick={() => onDelete(user)}
          disabled={isCurrentUser}
          title={isCurrentUser ? "You cannot delete your own account" : ""}
        >
          Delete
        </Button>
      </td>
    </tr>
  );
};

export default function AdminUsersPage() {
  const { user: currentAdmin } = useAuth();
  const {
    data: users,
    status,
    error,
    request: fetchUsers,
    setData: setUsers,
  } = useApi(adminService.getAllUsers, { defaultData: [] });

  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");

  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { isLoading: isUpdating, request: updateUserRoleApi } = useApi(
    adminService.updateUserRole
  );
  const { isLoading: isDeleting, request: deleteUserApi } = useApi(
    adminService.deleteUser
  );

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleOpenRoleModal = (user) => {
    setEditingUser(user);
    setSelectedRole(user.role);
    setIsRoleModalOpen(true);
  };

  const handleCloseRoleModal = () => {
    setEditingUser(null);
    setIsRoleModalOpen(false);
  };

  const handleSaveRole = async () => {
    if (!editingUser) return;
    try {
      const updatedUser = await updateUserRoleApi(editingUser.id, {
        role: selectedRole,
      });
      setUsers((prev) =>
        prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
      );
      toast.success(`Role for ${editingUser.email} updated successfully!`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update user role.");
    } finally {
      handleCloseRoleModal();
    }
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      await deleteUserApi(userToDelete.id);
      setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
      toast.success(`User "${userToDelete.email}" has been deleted.`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete user.");
    } finally {
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex justify-center p-8">
        <Spinner />
      </div>
    );
  }

  if (status === "failed") {
    return (
      <p className="text-red-500 p-8">
        Error: {error?.message || "Failed to load users."}
      </p>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Manage Users</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        {users.length === 0 ? (
          <p className="text-gray-800">No users found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <UserRow
                    key={user.id}
                    user={user}
                    onEdit={handleOpenRoleModal}
                    onDelete={handleDeleteClick}
                    currentAdminId={currentAdmin?.id}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Update Role Modal */}
      <Modal
        isOpen={isRoleModalOpen}
        onClose={handleCloseRoleModal}
        title={`Update Role for ${editingUser?.email}`}
      >
        <div className="space-y-4">
          <label
            htmlFor="role"
            className="block text-sm font-medium text-gray-700"
          >
            Select new role:
          </label>
          <select
            id="role"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="customer">Customer</option>
            <option value="staff">Staff</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div className="mt-6 flex justify-end gap-4">
          <Button
            type="button"
            variant="secondary"
            onClick={handleCloseRoleModal}
            disabled={isUpdating}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={handleSaveRole}
            disabled={isUpdating}
          >
            {isUpdating ? "Saving..." : "Save Role"}
          </Button>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm User Deletion"
      >
        <p className="text-gray-700 mb-6">
          Are you sure you want to delete the user{" "}
          <span className="font-semibold">{userToDelete?.email}</span>? This
          action is irreversible.
        </p>
        <div className="flex justify-end gap-4">
          <Button
            variant="secondary"
            onClick={() => setIsDeleteModalOpen(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={confirmDeleteUser}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete User"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
