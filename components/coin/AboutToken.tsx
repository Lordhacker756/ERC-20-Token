import React, { useEffect, useState } from "react";
import useContract from "@/lib/hooks/useContract";
import { useUserStore } from "@/lib/store/user-provider";

const AboutToken = () => {
  const { contract } = useContract();
  const { isWalletConnected } = useUserStore((state) => state);

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

  useEffect(() => {
    const fetchTokenInfo = async () => {
      if (contract && isWalletConnected) {
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
        }
      }
    };

    fetchTokenInfo();
  }, [contract, isWalletConnected]);

  if (!isWalletConnected) {
    return (
      <div className="p-6 bg-gray-900 rounded-lg shadow-md mb-6 border border-gray-800">
        <h2 className="text-xl font-bold text-purple-400 mb-4">About Token</h2>
        <p className="text-gray-400">Connect wallet to see token information</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-900 rounded-lg shadow-md mb-6 border border-gray-800">
      <h2 className="text-xl font-bold text-purple-400 mb-4">About Token</h2>
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
          <span className="text-gray-200">{tokenInfo.totalSupply}</span>
        </div>
        <div className="border-b border-gray-700 pb-2">
          <span className="font-semibold text-gray-400">Max Cap:</span>{" "}
          <span className="text-gray-200">{tokenInfo.cap}</span>
        </div>
        <div className="border-b border-gray-700 pb-2">
          <span className="font-semibold text-gray-400">Decimals:</span>{" "}
          <span className="text-gray-200">{tokenInfo.decimals}</span>
        </div>
        <div className="border-b border-gray-700 pb-2">
          <span className="font-semibold text-gray-400">Faucet Amount:</span>{" "}
          <span className="text-gray-200">{tokenInfo.faucetAmount}</span>
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
            {tokenInfo.owner
              ? `${tokenInfo.owner.slice(0, 6)}...${tokenInfo.owner.slice(-4)}`
              : ""}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AboutToken;
