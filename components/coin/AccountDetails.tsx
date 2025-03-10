import React, { useEffect, useState } from "react";
import useContract from "@/lib/hooks/useContract";
import { useUserStore } from "@/lib/store/user-provider";

const AccountDetails = () => {
  const { contract } = useContract();
  const { wallet, isWalletConnected } = useUserStore((state) => state);

  const [accountInfo, setAccountInfo] = useState({
    balance: "0",
    hasClaimedFaucet: false,
    allowances: [] as { spender: string; amount: string }[],
  });

  // For the allowance check form
  const [spenderAddress, setSpenderAddress] = useState("");
  const [spenderAllowance, setSpenderAllowance] = useState("");

  useEffect(() => {
    const fetchAccountInfo = async () => {
      if (contract && isWalletConnected && wallet) {
        try {
          const [balance, hasClaimedFaucet] = await Promise.all([
            contract.balanceOf(wallet),
            contract.hasClaimedFaucet(wallet),
          ]);

          setAccountInfo({
            balance: balance.toString(),
            hasClaimedFaucet,
            allowances: [],
          });
        } catch (error) {
          console.error("Error fetching account info:", error);
        }
      }
    };

    fetchAccountInfo();
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
        }
      } catch (error) {
        console.error("Error checking allowance:", error);
      }
    }
  };

  if (!isWalletConnected) {
    return (
      <div className="p-6 bg-gray-900 rounded-lg shadow-md mb-6 border border-gray-800">
        <h2 className="text-xl font-bold text-purple-400 mb-4">
          Account Details
        </h2>
        <p className="text-gray-400">Connect wallet to see account details</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-900 rounded-lg shadow-md mb-6 border border-gray-800">
      <h2 className="text-xl font-bold text-purple-400 mb-4">
        Account Details
      </h2>

      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center mb-2">
          <span className="font-semibold text-gray-400 mr-2">Balance:</span>
          <span className="text-lg font-medium text-gray-200">
            {accountInfo.balance} TSUN
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
