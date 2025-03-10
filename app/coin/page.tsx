"use client";
import useStore from "@/lib/hooks/useStore";
import { useUserStore } from "@/lib/store/user-provider";
import React from "react";

const page = () => {
  const { wallet, isWalletConnected, connectWallet, disconnectWallet } =
    useUserStore((state) => state);

  // Only log when values exist (after hydration)
  if (wallet !== undefined && isWalletConnected !== undefined) {
    console.log({ wallet, isWalletConnected });
  }
  return (
    <div>
      <h1>Is wallet connected? {isWalletConnected}</h1>
      <h1>Wallet address? {wallet}</h1>

      <button
        onClick={() => {
          connectWallet("21X01A6657");
        }}
      >
        Connect Wallet
      </button>
      <button
        onClick={() => {
          disconnectWallet();
        }}
      >
        Disconnect Wallet
      </button>
      {/*  About Token*/}

      {/* Account Details - Holding and Allowance */}

      {/* Transactions - Transfer, Approve, Trasfer From, Claim Facuet */}

      {/* Owner Actions - Pause, Mint, Burn, Transfer Ownership */}
    </div>
  );
};

export default page;
