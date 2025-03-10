"use client";
import React, { useState } from "react";
import useWallet from "@/lib/hooks/useWallet";
import { useUserStore } from "@/lib/store/user-provider";
import LoadingButton from "@/components/ui/LoadingButton";
import { toast } from "sonner";
import { copyToClipboard, shortenAddress } from "@/lib/utils/formatting";

const Header = () => {
  const { wallet, isWalletConnected } = useUserStore((state) => state);
  const { connectMetaMask, disconnectMetaMask } = useWallet();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      await connectMetaMask();
      toast.success("Wallet connected successfully");
    } catch (error: any) {
      toast.error(
        `Failed to connect wallet: ${error.message || "Unknown error"}`
      );
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    setIsDisconnecting(true);
    try {
      await disconnectMetaMask();
      toast.success("Wallet disconnected");
    } catch (error: any) {
      toast.error(
        `Failed to disconnect wallet: ${error.message || "Unknown error"}`
      );
    } finally {
      setIsDisconnecting(false);
    }
  };

  const handleCopyAddress = async () => {
    if (!wallet) return;

    const success = await copyToClipboard(wallet);
    if (success) {
      toast.success("Address copied to clipboard!");
    } else {
      toast.error("Failed to copy address");
    }
  };

  return (
    <header className="bg-black p-4  relative">
      {/* Gradient border bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600"></div>

      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white font-bold text-xl">Tsundere Token</div>
        <div className="flex items-center space-x-4">
          {isWalletConnected ? (
            <div className="flex items-center space-x-2">
              <button
                onClick={handleCopyAddress}
                className="text-white bg-black px-3 py-1 rounded-full text-sm border border-purple-500 hover:border-purple-400 transition-all duration-200 flex items-center"
                title="Click to copy address"
              >
                {wallet && shortenAddress(wallet)}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 ml-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </button>
              <LoadingButton
                onClick={handleDisconnect}
                isLoading={isDisconnecting}
                loadingText="Disconnecting..."
                variant="gradient-border"
                className="rounded-full"
              >
                Disconnect
              </LoadingButton>
            </div>
          ) : (
            <LoadingButton
              onClick={handleConnect}
              isLoading={isConnecting}
              loadingText="Connecting..."
              variant="gradient-border"
              className="rounded-full"
            >
              Connect Wallet
            </LoadingButton>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
