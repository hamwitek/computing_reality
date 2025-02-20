import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ProductPage() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchProduct() {
    try {
      const response = await fetch(
        `http://localhost:8003/products/${productId}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setProduct(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProduct();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!product) {
    return <div>No product found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow-md my-10">
      <div className="flex">
        <img
          className="md:w-1/2 h-64 object-cover rounded-lg"
          src="/t_1.png"
          alt={product.name}
        />
        <div className="md:ml-6 mt-4 md:mt-0 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">
              {product.name}
            </h1>
            <p className="text-gray-700 mt-2">${product.price}</p>
            <p className="text-gray-700 mt-4">{product.description}</p>
            {product.is_in_stock === false && (
              <div className="text-red-500 mt-2">Not in stock</div>
            )}
          </div>
          <button
            onClick={() => alert("Added to cart")}
            className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors cursor-pointer"
          >
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
}
