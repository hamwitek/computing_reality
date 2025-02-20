import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { classNames } from "../utils";

export default function SearchPage() {
  const [products, setProducts] = useState([]);
  const [productCart, setProductCart] = useState([]);
  const [hideCart, setHideCart] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function fetchProducts(query = "") {
    setLoading(true);
    setError(null);
    try {
      const endpoint = query
        ? `http://localhost:8003/search/products?query=${query}`
        : `http://localhost:8003/products`;
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data);
      setProducts(data);
      console.log("In useEffect");
    } catch (error) {
      console.log(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  function addProductToCart(product) {
    setProductCart([...productCart, product]);
  }

  useEffect(() => {
    fetchProducts(searchQuery);
  }, []);

  // Uncomment this version to use the onChange event instead of useEffect
  function handleSearchChange(event) {
    const query = event.target.value;
    setSearchQuery(query);
    fetchProducts(query);
  }

  return (
    <>
      <div className="flex justify-center my-4">
        <input
          type="text"
          placeholder="Search for products..."
          className="p-2 border border-gray-300 rounded-lg"
          value={searchQuery}
          // Uncomment this line to use the onChange event instead of useEffect
          onChange={(e) => handleSearchChange(e)}
        />
      </div>
      <div
        className={classNames(
          "fixed p-4 bg-white border border-gray-300 shadow-xl top-5 right-5 w-64 min-h-32 rounded-lg",
          hideCart === true && "hidden"
        )}
      >
        <div className="flex items-center">
          <h3 className="text-lg font-semibold mb-4">Product Cart</h3>
          <div
            className="ml-auto hover:underline cursor-pointer"
            onClick={() => setHideCart(true)}
          >
            Close
          </div>
        </div>
        <ul className="space-y-2">
          {productCart.map((product, index) => (
            <li
              key={index}
              className="flex justify-between items-center p-2 border-b border-gray-200"
            >
              <span>{product.name}</span>
              <span className="text-sm text-gray-500">${product.price}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4">
          <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
            Checkout
          </button>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-8 my-20">
        {loading && <div>Loading...</div>}
        {error && <div>Error: {error}</div>}
        {!loading && !error && products.length === 0 && (
          <div>No products found</div>
        )}
        {!loading &&
          !error &&
          products.map((product, index) => (
            <ProductCard
              product={product}
              handleBuy={addProductToCart}
              key={index}
            />
          ))}
      </div>
    </>
  );
}
