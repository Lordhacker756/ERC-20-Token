"use client";
import useContract from "@/lib/hooks/useContract";
import useWallet from "@/lib/hooks/useWallet";
import { useUserStore } from "@/lib/store/user-provider";
import Header from "@/components/globals/Header";
import AboutToken from "@/components/coin/AboutToken";
import AccountDetails from "@/components/coin/AccountDetails";
import Transactions from "@/components/coin/Transactions";
import OwnerActions from "@/components/coin/OwnerActions";
import React, { useEffect } from "react";

const Page = () => {
  const { isWalletConnected } = useUserStore((state) => state);
  const { connectMetaMask } = useWallet();
  const { contract, connectContract } = useContract();

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200">
      <div className="container mx-auto px-4 py-8">
        {!isWalletConnected ? (
          <div className="text-center py-12">
            <h1 className="text-3xl font-bold text-purple-400 mb-6">
              Welcome to Tsundere Token
            </h1>
            <p className="text-gray-400 mb-8 max-w-lg mx-auto">
              Connect your wallet to interact with the token contract and access
              all features.
            </p>
            <button
              className="bg-gradient-to-r from-purple-800 to-pink-700 text-white font-bold py-3 px-8 rounded-full hover:from-purple-700 hover:to-pink-600 transition-all duration-200 border border-purple-500"
              onClick={() => connectMetaMask()}
            >
              Connect Wallet
            </button>
          </div>
        ) : !contract ? (
          <div className="text-center py-12">
            <h1 className="text-3xl font-bold text-purple-400 mb-6">
              Connect to Contract
            </h1>
            <button
              className="bg-gradient-to-r from-purple-800 to-pink-700 text-white font-bold py-3 px-8 rounded-full hover:from-purple-700 hover:to-pink-600 transition-all duration-200 border border-purple-500"
              onClick={() => connectContract()}
            >
              Connect to Contract
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <AboutToken />
            <AccountDetails />
            <Transactions />
            <OwnerActions />
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
