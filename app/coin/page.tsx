"use client";
import useContract from "@/lib/hooks/useContract";
import useWallet from "@/lib/hooks/useWallet";
import { useUserStore } from "@/lib/store/user-provider";
import React from "react";

const page = () => {
  const { wallet, isWalletConnected, connectWallet, disconnectWallet } =
    useUserStore((state) => state);
  const { connectMetaMask, disconnectMetaMask, getBalance } = useWallet();
  const { contract, connectContract } = useContract();

  // Only log when values exist (after hydration)
  if (wallet !== undefined && isWalletConnected !== undefined) {
    console.log({ wallet, isWalletConnected });
  }
  return (
    <div>
      <h1>Is wallet connected? {isWalletConnected}</h1>
      <h1>Wallet address? {wallet}</h1>

      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => {
          connectMetaMask();
        }}
      >
        Connect Wallet
      </button>
      <button
        onClick={() => {
          disconnectMetaMask();
        }}
      >
        Disconnect Wallet
      </button>

      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => {
          connectContract();
        }}
      >
        Connect Contract
      </button>
      {/*  About Token*/}

      {/* Account Details - Holding and Allowance */}

      {/* Transactions - Transfer, Approve, Trasfer From, Claim Facuet */}

      {/* Owner Actions - Pause, Mint, Burn, Transfer Ownership */}
    </div>
  );
};

export default page;
