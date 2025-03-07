import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
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

            
            <Link to="/">
              <a src="/" className="text-gray-300 hover:text-gray-50">
                Home
              </a>
            </Link>

            <Link to="/">
              <a src="/" className="text-gray-300 hover:text-gray-50">
                Projects
              </a>
            </Link>

            <Link to="/">
              <a className="text-gray-300 hover:text-gray-50">
                Features
              </a>
            </Link>

            <Link to="/contact">
              <a className="text-gray-300 hover:text-gray-50">
                Contact
              </a>
            </Link>

            <Link to="/login">
              <a className="text-gray-300 hover:text-gray-50">
                Login
              </a>
            </Link>
            
            <Link to="/register">
              <a className="text-gray-300 hover:text-gray-50">
                Register
              </a>
            </Link>

          </nav>
        </div>
      </div>
    </header>
  );
}
