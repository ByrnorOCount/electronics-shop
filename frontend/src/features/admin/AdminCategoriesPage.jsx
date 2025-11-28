import React, { useState, useEffect } from "react";
import { useApi } from "../../hooks/useApi";
import { adminService } from "../../api";
import Spinner from "../../components/ui/Spinner";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import toast from "react-hot-toast";

const CategoryRow = ({ category, onEdit, onDelete }) => {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {category.id}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {category.name}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 max-w-md truncate">
        {category.description || "N/A"}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
        {new Date(category.created_at).toLocaleDateString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
        <Button size="sm" variant="secondary" onClick={() => onEdit(category)}>
          Edit
        </Button>
        <Button size="sm" variant="danger" onClick={() => onDelete(category)}>
          Delete
        </Button>
      </td>
    </tr>
  );
};

export default function AdminCategoriesPage() {
  const {
    data: categories,
    status,
    error,
    request: fetchCategories,
    setData: setCategories,
  } = useApi(adminService.getAllCategories, { defaultData: [] });

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: "", description: "" });

  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { isLoading: isSaving, request: saveCategoryApi } = useApi(
    editingCategory ? adminService.updateCategory : adminService.createCategory
  );
  const { isLoading: isDeleting, request: deleteCategoryApi } = useApi(
    adminService.deleteCategory
  );

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleOpenFormModal = (category = null) => {
    setEditingCategory(category);
    setFormData(
      category
        ? { name: category.name, description: category.description || "" }
        : { name: "", description: "" }
    );
    setIsFormModalOpen(true);
  };

  const handleCloseFormModal = () => {
    setEditingCategory(null);
    setIsFormModalOpen(false);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    try {
      let savedCategory;
      if (editingCategory) {
        savedCategory = await saveCategoryApi(editingCategory.id, formData);
        setCategories((prev) =>
          prev.map((c) => (c.id === savedCategory.id ? savedCategory : c))
        );
        toast.success("Category updated successfully!");
      } else {
        savedCategory = await saveCategoryApi(formData);
        setCategories((prev) => [savedCategory, ...prev]);
        toast.success("Category created successfully!");
      }
      handleCloseFormModal();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save category.");
    }
  };

  const handleDeleteClick = (category) => {
    setCategoryToDelete(category);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteCategory = async () => {
    if (!categoryToDelete) return;
    try {
      await deleteCategoryApi(categoryToDelete.id);
      setCategories((prev) => prev.filter((c) => c.id !== categoryToDelete.id));
      toast.success(`Category "${categoryToDelete.name}" deleted.`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete category.");
    } finally {
      setIsDeleteModalOpen(false);
      setCategoryToDelete(null);
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
        Error: {error?.message || "Failed to load categories."}
      </p>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Categories</h1>
        <Button variant="primary" onClick={() => handleOpenFormModal()}>
          Add New Category
        </Button>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        {categories.length === 0 ? (
          <p className="text-gray-800">No categories found.</p>
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
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Created At
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categories.map((category) => (
                  <CategoryRow
                    key={category.id}
                    category={category}
                    onEdit={handleOpenFormModal}
                    onDelete={handleDeleteClick}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Category Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={handleCloseFormModal}
        title={editingCategory ? "Edit Category" : "Add New Category"}
      >
        <form onSubmit={handleSaveCategory}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleFormChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <textarea
                name="description"
                id="description"
                value={formData.description}
                onChange={handleFormChange}
                rows="3"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              ></textarea>
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-4">
            <Button
              type="button"
              variant="secondary"
              onClick={handleCloseFormModal}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Category Deletion"
      >
        <p className="text-gray-700 mb-6">
          Are you sure you want to delete the category "
          <span className="font-semibold">{categoryToDelete?.name}</span>"?
          Deleting it will not delete associated products, but they will become
          uncategorized.
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
            onClick={confirmDeleteCategory}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
