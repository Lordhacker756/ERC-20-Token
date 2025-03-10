import React from "react";
import Link from "next/link";
import { FaGithub, FaHeart } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="w-full bg-gradient-to-r from-purple-600 via-pink-500 to-black py-4 px-6 text-white z-20">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center mb-4 md:mb-0">
          <span className="text-xl font-bold mr-2">ツンデレ</span>
          <span className="text-sm opacity-80">v1.0.0</span>
        </div>

        <div className="flex flex-col items-center md:items-end">
          <div className="flex items-center mb-2">
            <span className="mr-2 text-sm">Made with</span>
            <FaHeart className="text-red-300 animate-pulse mx-1" />
            <span className="ml-1 text-sm">by</span>
            <span className="ml-2 font-bold text-yellow-200">ウトカーシュ</span>
          </div>

          <Link
            href="https://github.com/Lordhacker756"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center hover:text-pink-200 transition-colors cursor-pointer px-3 py-1 rounded-md relative z-30"
          >
            <FaGithub className="mr-1" />
            <span className="text-sm">Lordhacker756</span>
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
