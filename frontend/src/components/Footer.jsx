import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="py-8 text-white bg-gray-900 border-t border-gray-700">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl text-white font-bold">Computing Reality</h2>
            <p className="text-white mt-2">
              © 2025 Computing Reality. All rights reserved.
            </p>
          </div>
          <div className="flex space-x-6">
            <Link to="/about" className="text-gray-300 hover:text-gray-50">
              About
            </Link>

            <Link to="/contact" className="text-gray-300 hover:text-gray-50">
              Contact
            </Link>

            <Link to="/privacy" className="text-gray-300 hover:text-gray-50">
              Privacy Policy
            </Link>
          </div>
        </div>
        <div className="flex justify-center mt-8 space-x-6">
          <a href="#" className="text-white hover:text-white">
            <span className="sr-only">Facebook</span>
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22.675 0h-21.35C.595 0 0 .595 0 1.325v21.351C0 23.405.595 24 1.325 24h11.495v-9.294H9.691v-3.622h3.129V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.794.715-1.794 1.763v2.31h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.325-.595 1.325-1.324V1.325C24 .595 23.405 0 22.675 0z" />
            </svg>
          </a>
          <a href="#" className="text-white hover:text-white">
            <span className="sr-only">Twitter</span>
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 4.557a9.93 9.93 0 01-2.828.775 4.932 4.932 0 002.165-2.724 9.864 9.864 0 01-3.127 1.195 4.916 4.916 0 00-8.384 4.482A13.944 13.944 0 011.671 3.149a4.916 4.916 0 001.523 6.573 4.897 4.897 0 01-2.229-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.935 4.935 0 01-2.224.084 4.918 4.918 0 004.6 3.417 9.867 9.867 0 01-6.102 2.104c-.396 0-.787-.023-1.175-.069a13.945 13.945 0 007.548 2.212c9.057 0 14.01-7.506 14.01-14.01 0-.213-.005-.425-.014-.636A10.025 10.025 0 0024 4.557z" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
