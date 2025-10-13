/**
 * Displays a single product in a card format.
 * @param {object} props
 * @param {object} props.product - The product object from the API.
 * @param {string} props.product.name - The name of the product.
 * @param {string} props.product.description - A short description.
 * @param {number|string} props.product.price - The price of the product.
 * @param {string} props.product.image_url - The URL for the product image.
 */

import React from "react";
import { useAppDispatch } from "../store/hooks";
import { addItem } from "../features/cart/cartSlice";
import Button from './Button';

export default function ProductCard({ product }) {
  const dispatch = useAppDispatch();

  const handleAdd = () => {
    dispatch(
      addItem({
        id: product.id,
        name: product.name,
        price: Number(product.price),
        qty: 1,
        img: product.img,
      })
    );
  };

  return (
    <div className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
      <img src={product.image_url} alt={product.name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="font-bold text-lg truncate">{product.name}</h3>
        <p className="text-gray-600 text-sm my-2 h-10">{product.description}</p>
        <p className="text-lg font-semibold text-gray-800">${Number(product.price).toFixed(2)}</p>
        <Button onClick={handleAdd} size="sm" className="rounded-full">Add</Button>
      </div>
    </div>
  );
}
