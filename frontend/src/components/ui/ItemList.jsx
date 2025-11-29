import React from "react";

/**
 * A shared component to display a list of items with image, name, quantity, and price.
 * @param {object} props
 * @param {Array<object>} props.items - An array of item objects, each with id, img, name, qty, price, and optionally stock.
 * @param {boolean} [props.showStock=false] - Whether to display the stock quantity for each item.
 * @param {string} [props.containerClassName=""] - Additional CSS classes for the item list container.
 */
export default function ItemList({
  items,
  showStock = false,
  containerClassName = "",
}) {
  return (
    <div className={`space-y-4 mb-4 ${containerClassName}`}>
      {items.map((item) => (
        <div key={item.id} className="flex items-center gap-4">
          <img
            src={item.img}
            alt={item.name}
            className="w-16 h-16 object-cover rounded"
          />
          <div className="flex-1 text-sm">
            <p className="font-medium">{item.name}</p>
            <p className="text-gray-500">Quantity: {item.qty}</p>
            {showStock && item.stock !== undefined && (
              <p className="text-xs text-gray-500">In Stock: {item.stock}</p>
            )}
          </div>
          <span className="font-medium text-sm">
            ${(Number(item.price) * item.qty).toFixed(2)}
          </span>
        </div>
      ))}
    </div>
  );
}
