import React from 'react';
import ProductCard from './ProductCard';

const FeaturedGrid = ({ products, status, error }) => {
  let content;

  if (status === 'loading') {
    // Hiển thị skeleton loading trong khi chờ dữ liệu
    content = Array.from({ length: 4 }).map((_, index) => (
      <div key={index} className="border border-gray-200 rounded-lg p-4 animate-pulse">
        <div className="bg-gray-300 h-48 w-full rounded-md mb-4"></div>
        <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
        <div className="h-6 bg-gray-300 rounded w-1/2"></div>
      </div>
    ));
  } else if (status === 'succeeded') {
    // Hiển thị danh sách sản phẩm khi có dữ liệu
    content = products.map((product) => (
      <ProductCard key={product.id} product={product} />
    ));
  } else if (status === 'failed') {
    // Hiển thị lỗi nếu gọi API thất bại
    content = <p className="text-red-500 col-span-full">Error: {error}</p>;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {content}
    </div>
  );
};

export default FeaturedGrid;