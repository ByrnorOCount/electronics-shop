import React from 'react';
import { Link } from 'react-router-dom';

// Hàm helper để định dạng tiền tệ
const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

const ProductCard = ({ product }) => {
  return (
    <Link to={`/products/${product.id}`} className="group block bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="relative">
        <img src={product.image_url || 'https://via.placeholder.com/300'} alt={product.name} className="w-full h-48 object-cover" />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 truncate group-hover:text-blue-600">{product.name}</h3>
        <p className="text-xl font-bold text-gray-900 mt-2">{formatPrice(product.price)}</p>
      </div>
    </Link>
  );
};

export default ProductCard;