import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import authStore from "../store/authStore"; // Import the auth store

export default function Header() {
  // Get authentication state and functions from your store
  const token = authStore((state) => state.token);
  const logout = authStore((state) => state.logout);
  const fetchUser = authStore((state) => state.fetchUser);
  const userData = authStore((state) => state.userData);
  const navigate = useNavigate();

  function logoutUser() {
    logout();
    navigate("/");
  }

  useEffect(() => {
    fetchUser();
  }, []);
  


  return (
    <header className="bg-gray-900 shadow">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-6">
          <div className="flex items-center">
            <Link to="/">
              <img
                className="w-auto h-8"
                src="/cr_logo_v1.webp"
                alt="Logo"
              />
            </Link>
            <Link to="/">
              <h1 className="ml-3 text-xl font-bold text-gray-100">
                Computing Reality
              </h1>
            </Link>
          </div>
          <nav className="flex space-x-4">
            <Link to="/" className="text-gray-300 hover:text-gray-50">
              Home
            </Link>

            <Link to="/start" className="text-gray-300 hover:text-gray-50">
              Projects
            </Link>

            {/* <Link to="/" className="text-gray-300 hover:text-gray-50">
              Features
            </Link> */}

            {/* Conditional rendering based on authentication status */}
            {token ? (
              <>
                <span className="text-gray-300">
                  {userData && userData.first_name ? `Hi ${userData.first_name}` : 'Hi there'}
                </span>

                <Link to="/account" className="text-gray-300 hover:text-gray-50">
                  Account
                </Link>

                <button 
                  className="text-gray-300 hover:text-gray-50"
                  onClick={() => logoutUser()}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-300 hover:text-gray-50">
                  Login
                </Link>
                
                <Link to="/register" className="text-gray-300 hover:text-gray-50">
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
