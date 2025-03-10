import React, { useEffect, useState } from "react";
import useContract from "@/lib/hooks/useContract";
import { useUserStore } from "@/lib/store/user-provider";
import { formatTokenAmount, shortenAddress } from "@/lib/utils/formatting";
import { toast } from "sonner";

const AboutToken = () => {
  const { contract } = useContract();
  const { isWalletConnected } = useUserStore((state) => state);
  const [isLoading, setIsLoading] = useState(false);

  const [tokenInfo, setTokenInfo] = useState({
    name: "",
    symbol: "",
    totalSupply: "0",
    cap: "0",
    decimals: "0",
    faucetAmount: "0",
    paused: false,
    owner: "",
  });

  const fetchTokenInfo = async () => {
    if (contract && isWalletConnected) {
      setIsLoading(true);
      try {
        const [
          name,
          symbol,
          totalSupply,
          cap,
          decimals,
          faucetAmount,
          paused,
          owner,
        ] = await Promise.all([
          contract.name(),
          contract.symbol(),
          contract.totalSupply(),
          contract.cap(),
          contract.decimals(),
          contract.faucetAmount(),
          contract.paused(),
          contract.owner(),
        ]);

        setTokenInfo({
          name,
          symbol,
          totalSupply: totalSupply.toString(),
          cap: cap.toString(),
          decimals: decimals.toString(),
          faucetAmount: faucetAmount.toString(),
          paused,
          owner,
        });
      } catch (error) {
        console.error("Error fetching token info:", error);
        toast.error("Failed to fetch token information");
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchTokenInfo();
  }, [contract, isWalletConnected]);

  if (!isWalletConnected) {
    return (
      <div className="card-gradient-border bg-black shadow-md mb-6">
        <h2 className="text-xl font-bold text-purple-400 mb-4">About Token</h2>
        <p className="text-gray-400">Connect wallet to see token information</p>
      </div>
    );
  }

  return (
    <div className="card-gradient-border bg-black shadow-md mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-purple-400">About Token</h2>
        <button
          onClick={fetchTokenInfo}
          disabled={isLoading}
          className="flex items-center space-x-1 text-purple-400 hover:text-purple-300 transition-colors"
          title="Refresh token information"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 ${isLoading ? "animate-spin" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          {isLoading ? <span>Loading...</span> : <span>Refresh</span>}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border-b border-gray-700 pb-2">
          <span className="font-semibold text-gray-400">Name:</span>{" "}
          <span className="text-gray-200">{tokenInfo.name}</span>
        </div>
        <div className="border-b border-gray-700 pb-2">
          <span className="font-semibold text-gray-400">Symbol:</span>{" "}
          <span className="text-gray-200">{tokenInfo.symbol}</span>
        </div>
        <div className="border-b border-gray-700 pb-2">
          <span className="font-semibold text-gray-400">Total Supply:</span>{" "}
          <span className="text-gray-200">
            {formatTokenAmount(tokenInfo.totalSupply)} {tokenInfo.symbol}
          </span>
        </div>
        <div className="border-b border-gray-700 pb-2">
          <span className="font-semibold text-gray-400">Max Cap:</span>{" "}
          <span className="text-gray-200">
            {formatTokenAmount(tokenInfo.cap)} {tokenInfo.symbol}
          </span>
        </div>
        <div className="border-b border-gray-700 pb-2">
          <span className="font-semibold text-gray-400">Decimals:</span>{" "}
          <span className="text-gray-200">{tokenInfo.decimals}</span>
        </div>
        <div className="border-b border-gray-700 pb-2">
          <span className="font-semibold text-gray-400">Faucet Amount:</span>{" "}
          <span className="text-gray-200">
            {formatTokenAmount(tokenInfo.faucetAmount)} {tokenInfo.symbol}
          </span>
        </div>
        <div className="border-b border-gray-700 pb-2">
          <span className="font-semibold text-gray-400">Status:</span>{" "}
          <span
            className={`${
              tokenInfo.paused ? "text-red-400" : "text-green-400"
            }`}
          >
            {tokenInfo.paused ? "Paused" : "Active"}
          </span>
        </div>
        <div className="border-b border-gray-700 pb-2">
          <span className="font-semibold text-gray-400">Owner:</span>{" "}
          <span className="text-gray-200 text-sm">
            {tokenInfo.owner ? shortenAddress(tokenInfo.owner) : ""}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AboutToken;
