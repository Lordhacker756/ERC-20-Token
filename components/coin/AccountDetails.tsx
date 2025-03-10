import React, { useEffect, useState } from "react";
import useContract from "@/lib/hooks/useContract";
import { useUserStore } from "@/lib/store/user-provider";
import { formatTokenAmount, copyToClipboard } from "@/lib/utils/formatting";
import { toast } from "sonner";

const AccountDetails = () => {
  const { contract } = useContract();
  const { wallet, isWalletConnected } = useUserStore((state) => state);
  const [isLoading, setIsLoading] = useState(false);

  const [accountInfo, setAccountInfo] = useState({
    balance: "0",
    hasClaimedFaucet: false,
    allowances: [] as { spender: string; amount: string }[],
  });

  // For the allowance check form
  const [spenderAddress, setSpenderAddress] = useState("");
  const [spenderAllowance, setSpenderAllowance] = useState("");

  const fetchAccountInfo = async () => {
    if (contract && isWalletConnected && wallet) {
      setIsLoading(true);
      try {
        const [balance, hasClaimedFaucet] = await Promise.all([
          contract.balanceOf(wallet),
          contract.hasClaimedFaucet(wallet),
        ]);

        setAccountInfo({
          balance: balance.toString(),
          hasClaimedFaucet,
          allowances: [...accountInfo.allowances], // Preserve existing allowances
        });

        toast.success("Balance updated");
      } catch (error) {
        console.error("Error fetching account info:", error);
        toast.error("Failed to fetch account information");
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    if (contract && isWalletConnected && wallet) {
      fetchAccountInfo();
    }
  }, [contract, isWalletConnected, wallet]);

  const checkAllowance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (contract && isWalletConnected && wallet && spenderAddress) {
      try {
        const allowance = await contract.allowance(wallet, spenderAddress);
        setSpenderAllowance(allowance.toString());

        // Add to the list if not already there
        if (!accountInfo.allowances.some((a) => a.spender === spenderAddress)) {
          setAccountInfo((prev) => ({
            ...prev,
            allowances: [
              ...prev.allowances,
              {
                spender: spenderAddress,
                amount: allowance.toString(),
              },
            ],
          }));
        } else {
          // Update existing allowance
          setAccountInfo((prev) => ({
            ...prev,
            allowances: prev.allowances.map((a) =>
              a.spender === spenderAddress
                ? { ...a, amount: allowance.toString() }
                : a
            ),
          }));
        }
        toast.success(`Allowance checked: ${allowance.toString()} TSUN`);
      } catch (error) {
        console.error("Error checking allowance:", error);
        toast.error("Failed to check allowance");
      }
    }
  };

  const handleCopyAddress = async () => {
    if (wallet) {
      const success = await copyToClipboard(wallet);
      if (success) {
        toast.success("Your address copied to clipboard!");
      } else {
        toast.error("Failed to copy address");
      }
    }
  };

  if (!isWalletConnected) {
    return (
      <div className="card-gradient-border bg-black shadow-md mb-6">
        <h2 className="text-xl font-bold text-purple-400 mb-4">
          Account Details
        </h2>
        <p className="text-gray-400">Connect wallet to see account details</p>
      </div>
    );
  }

  return (
    <div className="card-gradient-border bg-black shadow-md mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-purple-400">Account Details</h2>
        <button
          onClick={fetchAccountInfo}
          disabled={isLoading}
          className="flex items-center space-x-1 text-purple-400 hover:text-purple-300 transition-colors"
          title="Refresh account information"
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
          <span>{isLoading ? "Loading..." : "Refresh"}</span>
        </button>
      </div>

      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center mb-2 bg-gray-800/40 p-3 rounded-md">
          <div className="flex-1">
            <span className="font-semibold text-gray-400 mr-2">
              Your Address:
            </span>
            <div className="flex items-center">
              <button
                onClick={handleCopyAddress}
                className="text-gray-200 hover:text-purple-400 transition-colors flex items-center"
                title="Click to copy your address"
              >
                <span className="truncate max-w-[240px] md:max-w-md">
                  {wallet}
                </span>
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
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center mb-2">
          <span className="font-semibold text-gray-400 mr-2">Balance:</span>
          <span className="text-lg font-medium text-gray-200">
            {formatTokenAmount(accountInfo.balance)} TSUN
          </span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center">
          <span className="font-semibold text-gray-400 mr-2">
            Faucet Status:
          </span>
          <span
            className={`${
              accountInfo.hasClaimedFaucet ? "text-red-400" : "text-green-400"
            }`}
          >
            {accountInfo.hasClaimedFaucet
              ? "Already Claimed"
              : "Available to Claim"}
          </span>
        </div>
      </div>

      <div className="border-t border-gray-700 pt-4">
        <h3 className="font-semibold text-gray-300 mb-3">Check Allowance</h3>
        <form
          onSubmit={checkAllowance}
          className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2"
        >
          <input
            type="text"
            placeholder="Spender Address"
            value={spenderAddress}
            onChange={(e) => setSpenderAddress(e.target.value)}
            className="flex-1 p-2 border border-gray-700 rounded bg-gray-800 text-gray-200"
            required
          />
          <button
            type="submit"
            className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-600 transition duration-200"
          >
            Check
          </button>
        </form>

        {accountInfo.allowances.length > 0 && (
          <div className="mt-4">
            <h4 className="font-semibold text-gray-300 mb-2">
              Current Allowances:
            </h4>
            <div className="max-h-40 overflow-y-auto">
              {accountInfo.allowances.map((item, index) => (
                <div key={index} className="border-b border-gray-700 py-2">
                  <div className="text-sm text-gray-400">{item.spender}</div>
                  <div className="font-medium text-gray-200">
                    {item.amount} TSUN
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountDetails;
