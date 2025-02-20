import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { classNames } from "../utils";

function HomeApi() {
  const [products, setProducts] = useState([]);
  const [productCart, setProductCart] = useState([]);
  const [hideCart, setHideCart] = useState(false);

  async function fetchProducts() {
    try {
      const response = await fetch("http://localhost:8003/products");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.log(error);
    }
  }

  function addProductToCart(product) {
    setProductCart([...productCart, product]);
  }

  //   The empty array at the end means it will only run when the component mounts
  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <>
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
        {products.map((product, index) => (
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

export default HomeApi;
