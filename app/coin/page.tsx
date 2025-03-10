"use client";
import useContract from "@/lib/hooks/useContract";
import useWallet from "@/lib/hooks/useWallet";
import { useUserStore } from "@/lib/store/user-provider";
import AboutToken from "@/components/coin/AboutToken";
import AccountDetails from "@/components/coin/AccountDetails";
import Transactions from "@/components/coin/Transactions";
import OwnerActions from "@/components/coin/OwnerActions";
import LoadingButton from "@/components/ui/LoadingButton";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const Page = () => {
  const { isWalletConnected } = useUserStore((state) => state);
  const { connectMetaMask } = useWallet();
  const { contract, connectContract } = useContract();

  const [isConnectingWallet, setIsConnectingWallet] = useState(false);
  const [isConnectingContract, setIsConnectingContract] = useState(false);

  // Connect to contract when wallet is connected
  useEffect(() => {
    if (isWalletConnected) {
      handleConnectContract();
    }
  }, [isWalletConnected]);

  const handleConnectWallet = async () => {
    setIsConnectingWallet(true);
    try {
      await connectMetaMask();
      toast.success("Wallet connected successfully");
    } catch (error: any) {
      console.error("Connection error:", error);
      toast.error(
        `Failed to connect wallet: ${error.message || "Unknown error"}`
      );
    } finally {
      setIsConnectingWallet(false);
    }
  };

  const handleConnectContract = async () => {
    setIsConnectingContract(true);
    try {
      await connectContract();
      if (contract) {
        toast.success("Contract connected successfully");
      }
    } catch (error: any) {
      console.error("Contract connection error:", error);
      toast.error(
        `Failed to connect to contract: ${error.message || "Unknown error"}`
      );
    } finally {
      setIsConnectingContract(false);
    }
  };

  return (
    <div className="min-h-[80vh] bg-black text-gray-200">
      <div className="container mx-auto px-4 py-8">
        {!isWalletConnected ? (
          <div className="text-center py-12 flex flex-col items-center justify-center h-[60vh]">
            <h1 className="text-3xl font-bold text-purple-400 mb-6">
              Welcome to Tsundere Token
            </h1>
            <p className="text-gray-400 mb-8 max-w-lg mx-auto">
              Connect your wallet to interact with the token contract and access
              all features.
            </p>
            <LoadingButton
              onClick={handleConnectWallet}
              isLoading={isConnectingWallet}
              loadingText="Connecting..."
              variant="gradient-border"
              className="rounded-full px-8 py-3 text-lg"
            >
              Connect Wallet
            </LoadingButton>
          </div>
        ) : !contract ? (
          <div className="text-center py-12">
            <h1 className="text-3xl font-bold text-purple-400 mb-6">
              Connect to Contract
            </h1>
            <LoadingButton
              onClick={handleConnectContract}
              isLoading={isConnectingContract}
              loadingText="Connecting..."
              variant="gradient-border"
              className="rounded-full px-8 py-3 text-lg"
            >
              Connect to Contract
            </LoadingButton>
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
