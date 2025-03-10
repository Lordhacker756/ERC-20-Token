import React from "react";
import { FaHeart } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-black p-4 text-gray-400 relative">
      {/* Gradient border top */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600"></div>

      <div className="container mx-auto text-center">
        <p>© {new Date().getFullYear()} Tsundere Token. All rights reserved.</p>

        <div className="mt-3 text-sm flex items-center justify-center gap-2">
          Made with{" "}
          <span className="inline-block animate-pulse text-pink-500">
            <FaHeart />
          </span>{" "}
          by <span className="text-purple-400">ウトカルシュ</span>{" "}
          <a
            href="https://github.com/Lordhacker756"
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-400 hover:text-purple-300 hover:underline"
          >
            @Lordhacker756
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
