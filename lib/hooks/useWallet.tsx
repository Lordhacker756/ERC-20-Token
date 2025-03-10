import { ethers } from "ethers";
import { BrowserProvider } from "ethers";
import { useUserStore } from "../store/user-provider";
import { useState, useEffect } from "react";

const useWallet = () => {
  const { wallet, isWalletConnected, connectWallet, disconnectWallet } =
    useUserStore((state) => state);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);

  // Auto-reconnect wallet if previously connected
  useEffect(() => {
    const checkAndConnectWallet = async () => {
      // Check both that we're connected and ethereum is available
      if (
        isWalletConnected &&
        typeof window !== "undefined" &&
        window.ethereum
      ) {
        console.log("Automatically Connecting To Metamask...");
        await connectMetaMask();
      } else if (isWalletConnected) {
        console.log("Wallet was connected but MetaMask not detected");
      }
    };

    // Run connection check
    checkAndConnectWallet();
  }, [isWalletConnected]);

  // Connect wallet
  const connectMetaMask = async () => {
    try {
      const provider = new BrowserProvider(window.ethereum);

      // MetaMask requires requesting permission to connect users accounts
      await provider.send("eth_requestAccounts", []);

      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      console.log("Connected Wallet:", address);

      // Update local state
      setProvider(provider);
      setSigner(signer);

      // Update persistent store
      connectWallet(address);

      return { provider, signer, address };
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      return null;
    }
  };

  // Disconnect wallet
  const disconnectMetaMask = async () => {
    setProvider(null);
    setSigner(null);
    disconnectWallet();
    console.log("Disconnected Wallet");
  };

  // Get balance
  const getBalance = async () => {
    if (!signer) return null;
    return await provider?.getBalance(await signer.getAddress());
  };

  return {
    provider,
    signer,
    address: wallet,
    isConnected: isWalletConnected,
    connectMetaMask,
    disconnectMetaMask,
    getBalance,
  };
};

export default useWallet;
