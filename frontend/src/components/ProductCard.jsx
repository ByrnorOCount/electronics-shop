/**
 * Small presentational product card.
 *
 * Usage:
 * <ProductCard product={{ id:1, name: 'Raspberry Pi 4', price: 49.99, rating: 4.7 }} />
 */
import React from "react";

export default function ProductCard({ product }) {
  return (
    <article className="bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-md overflow-hidden flex flex-col transform transition duration-200 hover:shadow-lg hover:-translate-y-1">
      {/* image placeholder */}
      <div className="w-full h-40 bg-gray-200 flex items-center justify-center overflow-hidden text-gray-400 text-sm">
          <img
            src={product.img}
            alt={product.name}
            className="object-cover w-full h-full"
            />
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
        <p className="text-gray-600 text-sm flex-grow">{product.short}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="font-bold text-blue-700">฿{product.price.toFixed(2)}</span>
          <button className="px-4 py-1.5 text-sm rounded-full bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600 shadow-sm">
            Add
          </button>
        </div>
      </div>
    </article>
  );
}
