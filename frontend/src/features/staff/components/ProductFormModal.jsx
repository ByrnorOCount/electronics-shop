import React, { useState, useEffect } from "react";
import Modal from "../../../components/ui/Modal";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import Select from "../../../components/ui/Select";
import { useApi } from "../../../hooks/useApi";
import { staffService, productService } from "../../../api";
import toast from "react-hot-toast";
import logger from "../../../utils/logger";

const ProductFormModal = ({ isOpen, onClose, product, onSave }) => {
  const isEditing = !!product;
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category_id: "",
    image_url: "",
    is_featured: false,
  });

  const {
    isLoading: isSaving,
    error: saveError,
    request: saveProduct,
  } = useApi(
    isEditing ? staffService.updateProduct : staffService.createProduct
  );

  const { isLoading: isUploading, request: uploadImage } = useApi(
    staffService.uploadProductImage
  );

  const { data: categories, request: fetchCategories } = useApi(
    productService.getProductCategories,
    { defaultData: [] }
  );

  useEffect(() => {
    if (!isOpen) return; // Don't log when closing

    logger.info(
      `ProductFormModal opened in ${isEditing ? "edit" : "create"} mode.`
    );

    // Fetch categories whenever the modal is opened
    fetchCategories();

    if (isEditing && product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price || "",
        stock: product.stock ?? "",
        category_id: product.category_id || "",
        image_url: product.image_url || "",
        is_featured: product.is_featured || false,
      });
      logger.info("Form populated with existing product data:", product);
    } else {
      // Reset form for new product
      setFormData({
        name: "",
        description: "",
        price: "",
        stock: "",
        category_id: "",
        image_url: "",
        is_featured: false,
      });
      logger.info("Form reset for new product.");
    }
  }, [product, isEditing, isOpen, fetchCategories]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    logger.info("File selected for upload:", {
      name: file.name,
      size: file.size,
      type: file.type,
    });
    // Frontend validation for file type
    if (!file.type.startsWith("image/")) {
      toast.error("Invalid file type. Please upload an image.");
      return;
    }

    try {
      logger.info("Attempting to upload image...");
      const { imageUrl } = await uploadImage(file);
      setFormData((prev) => ({ ...prev, image_url: imageUrl }));
      logger.info("Image uploaded successfully. URL:", imageUrl);
      toast.success("Image uploaded successfully!");
    } catch (err) {
      logger.error("Image upload failed.", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Failed to upload image.");
    }
  };

  const handleSubmit = async (e) => {
    logger.info(
      `Form submission started for ${
        isEditing ? "updating" : "creating"
      } product.`
    );
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock, 10),
        category_id: formData.category_id
          ? parseInt(formData.category_id, 10)
          : null,
      };

      logger.info("Product save payload:", payload);

      let savedProduct;
      if (isEditing) {
        savedProduct = await saveProduct(product.id, payload);
      } else {
        savedProduct = await saveProduct(payload);
      }
      logger.info("Product saved successfully. Response:", savedProduct);

      onSave(savedProduct);
      toast.success(
        `Product ${isEditing ? "updated" : "created"} successfully!`
      );
      onClose();
    } catch (err) {
      logger.error(
        `Failed to ${isEditing ? "update" : "create"} product.`,
        err.response?.data || err.message
      );
      toast.error(
        err.response?.data?.message ||
          `Failed to ${isEditing ? "update" : "create"} product.`
      );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? `Edit Product: ${product.name}` : "Add New Product"}
    >
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          name="name"
          label="Product Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <Input
          name="description"
          label="Description"
          value={formData.description}
          onChange={handleChange}
        />
        <div className="grid grid-cols-2 gap-3">
          <Input
            name="price"
            label="Price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            required
            step="0.01"
          />
          <Input
            name="stock"
            label="Stock"
            type="number"
            value={formData.stock}
            onChange={handleChange}
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Select
            name="category_id"
            label="Category"
            value={formData.category_id}
            onChange={handleChange}
            placeholder="Select a category"
            options={categories.map((c) => ({ value: c.id, label: c.name }))}
          />
          <Input
            name="image_url"
            label="Image URL"
            type="text"
            value={formData.image_url}
            onChange={handleChange}
          />
        </div>
        <div className="flex justify-between items-center pt-1">
          {/* Featured Product Checkbox */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_featured"
              name="is_featured"
              checked={formData.is_featured}
              onChange={handleChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label
              htmlFor="is_featured"
              className="ml-2 block text-sm text-gray-900"
            >
              Featured Product
            </label>
          </div>

          {/* Upload Image Button */}
          <div>
            <Button
              type="button"
              variant="secondary"
              onClick={() => document.getElementById("image-upload").click()}
              disabled={isUploading}
            >
              {isUploading ? "Uploading..." : "Upload Image"}
            </Button>
            <input
              id="image-upload"
              name="image"
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              disabled={isUploading}
              className="hidden"
            />
          </div>
        </div>

        {/* Image Preview Section */}
        {formData.image_url && (
          <div className="flex justify-end">
            <div className="mt-2 text-right">
              <img
                src={formData.image_url}
                alt="Preview"
                className="h-24 w-24 object-cover rounded-md inline-block"
              />
              <p className="text-xs text-gray-500 truncate max-w-xs">
                {formData.image_url}
              </p>
            </div>
          </div>
        )}

        {saveError && (
          <p className="text-sm text-red-600">
            Error: {saveError.response?.data?.message || "An error occurred."}
          </p>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Product"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ProductFormModal;
