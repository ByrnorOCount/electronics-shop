import React, { useEffect, useState } from "react";
import { useApi } from "../../hooks/useApi";
import { staffService } from "../../api";
import Spinner from "../../components/ui/Spinner";
import { formatCurrency, formatStatus } from "../../utils/formatters";
import Button from "../../components/ui/Button";
import ProductDetails from "./components/ProductDetails";
import Modal from "../../components/ui/Modal";
import Icon from "../../components/ui/Icon";
import toast from "react-hot-toast";
import ProductFormModal from "./components/ProductFormModal";

const ProductRow = ({ product, onEdit, onDelete }) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  return (
    <>
      <tr className="hover:bg-gray-50">
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm font-medium text-gray-900">
            {product.name}
          </div>
          <div className="text-sm text-gray-500">ID: {product.id}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {product.stock}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {formatCurrency(Number(product.price))}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setIsDetailsOpen(!isDetailsOpen)}
          >
            {isDetailsOpen ? "Hide Details" : "View Details"}
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onEdit(product.id)}
          >
            Edit
          </Button>
          <Button size="sm" variant="danger" onClick={() => onDelete(product)}>
            Delete
          </Button>
        </td>
      </tr>
      {isDetailsOpen && (
        <tr>
          <td colSpan="4" className="p-4 bg-gray-50">
            <div className="relative">
              <button
                onClick={() => setIsDetailsOpen(false)}
                className="absolute top-2 right-2 p-1 bg-gray-200 rounded-full hover:bg-gray-300"
              >
                <Icon name="x" className="h-4 w-4" />
              </button>
              <ProductDetails product={product} />
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

const StaffProductsPage = () => {
  const {
    data: products,
    status,
    error,
    request: fetchAllProducts,
    setData: setProducts,
  } = useApi(staffService.getAllProducts, { defaultData: [] });

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [productToDelete, setProductToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { isLoading: isDeleting, request: deleteProductApi } = useApi(
    staffService.deleteProduct
  );

  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);

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
        Error: {error?.message || "Failed to load products."}
      </p>
    );
  }

  const handleOpenFormModal = (product = null) => {
    setEditingProduct(product);
    setIsFormModalOpen(true);
  };

  const handleCloseFormModal = () => {
    setEditingProduct(null);
    setIsFormModalOpen(false);
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteProduct = async () => {
    if (!productToDelete) return;
    try {
      await deleteProductApi(productToDelete.id);
      setProducts((prevProducts) =>
        prevProducts.filter((p) => p.id !== productToDelete.id)
      );
      toast.success(`Product "${productToDelete.name}" deleted successfully.`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete product.");
    } finally {
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
    }
  };

  const handleSaveProduct = (savedProduct) => {
    if (editingProduct) {
      // Update existing product in the list
      setProducts((prev) =>
        prev.map((p) => (p.id === savedProduct.id ? savedProduct : p))
      );
    } else {
      // Add new product to the list
      setProducts((prev) => [savedProduct, ...prev]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Products</h1>
        <Button variant="primary" onClick={() => handleOpenFormModal()}>
          Add New Product
        </Button>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        {products.length === 0 ? (
          <p className="text-gray-600">There are no products to display.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <ProductRow
                    key={product.id}
                    product={product}
                    onEdit={() => handleOpenFormModal(product)}
                    onDelete={handleDeleteClick}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Product Modal */}
      <ProductFormModal
        isOpen={isFormModalOpen}
        onClose={handleCloseFormModal}
        product={editingProduct}
        onSave={handleSaveProduct}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Product Deletion"
      >
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete product "
          <span className="font-semibold">{productToDelete?.name}</span>" (ID:{" "}
          {productToDelete?.id})? This action cannot be undone.
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
            onClick={confirmDeleteProduct}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default StaffProductsPage;
