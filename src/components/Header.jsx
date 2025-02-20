import React from "react";

export default function Header() {
  return (
    <header className="bg-gray-900 shadow">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-6">
          <div className="flex items-center">
            {/* <img
              className="w-auto h-8"
              src="/short_logo_transparent.webp"
              alt="Logo"
            /> */}
            <h1 className="ml-3 text-xl font-bold text-gray-100">
              Computing Reality
            </h1>
          </div>
          <nav className="flex space-x-4">
            <a src="/" className="text-gray-300 hover:text-gray-50">
              Home
            </a>
            <a src="/" className="text-gray-300 hover:text-gray-50">
              Projects
            </a>
            <a href="/about" className="text-gray-300 hover:text-gray-50">
              About
            </a>
            <a href="#" className="text-gray-300 hover:text-gray-50">
              Features
            </a>
            <a href="#" className="text-gray-300 hover:text-gray-50">
              Contact
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
