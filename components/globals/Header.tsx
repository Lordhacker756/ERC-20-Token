"use client";
import React from "react";
import useWallet from "@/lib/hooks/useWallet";
import { useUserStore } from "@/lib/store/user-provider";

const Header = () => {
  const { wallet, isWalletConnected, connectWallet, disconnectWallet } =
    useUserStore((state) => state);
  const { connectMetaMask, disconnectMetaMask } = useWallet();

  return (
    <header className="bg-gradient-to-r from-purple-900 to-pink-800 p-4 shadow-lg border-b border-gray-800">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white font-bold text-xl">Tsundere Token</div>
        <div className="flex items-center space-x-4">
          {isWalletConnected ? (
            <div className="flex items-center space-x-2">
              <span className="text-white bg-gray-800 px-3 py-1 rounded-full text-sm border border-purple-500">
                {wallet && `${wallet.slice(0, 6)}...${wallet.slice(-4)}`}
              </span>
              <button
                onClick={() => disconnectMetaMask()}
                className="bg-gray-800 text-purple-400 hover:bg-gray-900 font-semibold py-2 px-4 rounded-full transition-all duration-200 border border-purple-500"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              onClick={() => connectMetaMask()}
              className="bg-purple-800 text-white hover:bg-purple-700 font-semibold py-2 px-4 rounded-full transition-all duration-200 border border-purple-500"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
