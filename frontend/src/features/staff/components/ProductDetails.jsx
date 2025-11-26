import React from "react";
import { formatCurrency } from "../../../utils/formatters";

const ProductDetails = ({ product }) => {
  if (!product) return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow-inner border border-gray-200">
      <h4 className="text-xl font-semibold mb-4">
        Product Details: {product.name}
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p>
            <strong>ID:</strong> {product.id}
          </p>
          <p>
            <strong>Name:</strong> {product.name}
          </p>
          <p>
            <strong>Description:</strong> {product.description || "N/A"}
          </p>
          <p>
            <strong>Price:</strong> {formatCurrency(Number(product.price))}
          </p>
          <p>
            <strong>Stock:</strong> {product.stock}
          </p>
          <p>
            <strong>Category ID:</strong> {product.category_id || "N/A"}
          </p>
          <p>
            <strong>Featured:</strong> {product.is_featured ? "Yes" : "No"}
          </p>
          <p>
            <strong>Created At:</strong>{" "}
            {new Date(product.created_at).toLocaleString()}
          </p>
          <p>
            <strong>Last Updated:</strong>{" "}
            {new Date(product.updated_at).toLocaleString()}
          </p>
        </div>
        {product.image_url && (
          <div className="flex justify-center items-center">
            <img
              src={product.image_url}
              alt={product.name}
              className="max-w-full h-48 object-contain rounded-md shadow-sm"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
