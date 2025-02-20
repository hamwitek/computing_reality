import React, { useState } from "react";

function ProductCard({ product, handleBuy }) {
  const [cart, setCart] = useState([]);
  return (
    <div
      key={product.id}
      className="max-w-sm bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden"
    >
      <a href={`/products/${product.id}`}>
        <img
          className="w-full h-48 object-cover"
          src="/t_2.png"
          alt={product.name}
        />
      </a>
      <div className="px-6 py-4 flex flex-col h-full">
        <div>
          <a href={`/products/${product.id}`}>
            <h2 className="text-xl font-semibold text-gray-900">
              {product.name}
            </h2>
          </a>
          <p className="text-gray-700 mt-2">${product.price}</p>
          {product.isInStock === false && (
            <div className="text-red-500 mt-2">Not in stock</div>
          )}
        </div>
        <button
          onClick={() => handleBuy(product)}
          className="mt-4 w-full bg-violet-800 text-white py-2 rounded-lg hover:bg-violet-500 transition-colors cursor-pointer"
        >
          Add to cart
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
