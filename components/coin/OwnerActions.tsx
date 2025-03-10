import React, { useEffect, useState } from "react";
import useContract from "@/lib/hooks/useContract";
import { useUserStore } from "@/lib/store/user-provider";

const OwnerActions = () => {
  const { contract } = useContract();
  const { wallet, isWalletConnected } = useUserStore((state) => state);

  const [isOwner, setIsOwner] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [mintForm, setMintForm] = useState({ recipient: "", amount: "" });
  const [burnForm, setBurnForm] = useState({ amount: "" });
  const [newOwnerAddress, setNewOwnerAddress] = useState("");
  const [txStatus, setTxStatus] = useState("");

  useEffect(() => {
    const checkOwnership = async () => {
      if (contract && isWalletConnected && wallet) {
        try {
          const contractOwner = await contract.owner();
          const paused = await contract.paused();
          setIsOwner(wallet.toLowerCase() === contractOwner.toLowerCase());
          setIsPaused(paused);
        } catch (error) {
          console.error("Error checking ownership:", error);
        }
      }
    };

    checkOwnership();
  }, [contract, wallet, isWalletConnected]);

  const handlePauseToggle = async () => {
    if (!contract || !isWalletConnected || !isOwner) return;

    setTxStatus(isPaused ? "Unpausing contract..." : "Pausing contract...");
    try {
      const tx = isPaused ? await contract.unpause() : await contract.pause();
      await tx.wait();
      setIsPaused(!isPaused);
      setTxStatus(isPaused ? "Contract unpaused!" : "Contract paused!");
    } catch (error: any) {
      console.error("Pause toggle error:", error);
      setTxStatus(`${isPaused ? "Unpause" : "Pause"} failed: ${error.message}`);
    }
  };

  const handleMint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contract || !isWalletConnected || !isOwner) return;

    setTxStatus("Minting tokens...");
    try {
      const tx = await contract.mint(mintForm.recipient, mintForm.amount);
      await tx.wait();
      setTxStatus("Tokens minted successfully!");
      setMintForm({ recipient: "", amount: "" });
    } catch (error: any) {
      console.error("Mint error:", error);
      setTxStatus(`Mint failed: ${error.message}`);
    }
  };

  const handleBurn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contract || !isWalletConnected || !isOwner) return;

    setTxStatus("Burning tokens...");
    try {
      const tx = await contract.burn(burnForm.amount);
      await tx.wait();
      setTxStatus("Tokens burned successfully!");
      setBurnForm({ amount: "" });
    } catch (error: any) {
      console.error("Burn error:", error);
      setTxStatus(`Burn failed: ${error.message}`);
    }
  };

  const handleTransferOwnership = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contract || !isWalletConnected || !isOwner) return;

    setTxStatus("Transferring ownership...");
    try {
      const tx = await contract.transferOwnership(newOwnerAddress);
      await tx.wait();
      setTxStatus("Ownership transferred successfully!");
      setIsOwner(false);
      setNewOwnerAddress("");
    } catch (error: any) {
      console.error("Transfer ownership error:", error);
      setTxStatus(`Transfer ownership failed: ${error.message}`);
    }
  };

  if (!isWalletConnected) {
    return (
      <div className="p-6 bg-gray-900 rounded-lg shadow-md border border-gray-800">
        <h2 className="text-xl font-bold text-purple-400 mb-4">
          Owner Actions
        </h2>
        <p className="text-gray-400">
          Connect wallet to access owner functions
        </p>
      </div>
    );
  }

  if (!isOwner) {
    return (
      <div className="p-6 bg-gray-900 rounded-lg shadow-md border border-gray-800">
        <h2 className="text-xl font-bold text-purple-400 mb-4">
          Owner Actions
        </h2>
        <p className="text-gray-400">You are not the owner of this contract</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-900 rounded-lg shadow-md border border-gray-800">
      <h2 className="text-xl font-bold text-purple-400 mb-4">Owner Actions</h2>

      {txStatus && (
        <div
          className={`p-3 mb-4 rounded ${
            txStatus.includes("failed")
              ? "bg-red-900/30 text-red-400 border border-red-700"
              : txStatus.includes("ing")
              ? "bg-yellow-900/30 text-yellow-400 border border-yellow-700"
              : "bg-green-900/30 text-green-400 border border-green-700"
          }`}
        >
          {txStatus}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pause/Unpause */}
        <div className="border border-gray-700 p-4 rounded-lg bg-gray-800/50 flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-gray-200 mb-3">
              Contract Status
            </h3>
            <p className="text-sm text-gray-400 mb-2">
              Current status:{" "}
              <span
                className={
                  isPaused
                    ? "text-red-400 font-medium"
                    : "text-green-400 font-medium"
                }
              >
                {isPaused ? "Paused" : "Active"}
              </span>
            </p>
            <p className="text-sm text-gray-400 mb-4">
              {isPaused
                ? "When paused, all token transfers are disabled."
                : "When active, token transfers are enabled."}
            </p>
          </div>
          <button
            onClick={handlePauseToggle}
            className={`w-full py-2 px-4 rounded transition duration-200 ${
              isPaused
                ? "bg-green-700 hover:bg-green-600 text-white"
                : "bg-red-700 hover:bg-red-600 text-white"
            }`}
          >
            {isPaused ? "Unpause Contract" : "Pause Contract"}
          </button>
        </div>

        {/* Mint */}
        <div className="border border-gray-700 p-4 rounded-lg bg-gray-800/50">
          <h3 className="font-semibold text-gray-200 mb-3">Mint Tokens</h3>
          <form onSubmit={handleMint} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Recipient
              </label>
              <input
                type="text"
                value={mintForm.recipient}
                onChange={(e) =>
                  setMintForm({ ...mintForm, recipient: e.target.value })
                }
                className="w-full p-2 mt-1 border border-gray-700 rounded bg-gray-800 text-gray-200"
                placeholder="0x..."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Amount
              </label>
              <input
                type="text"
                value={mintForm.amount}
                onChange={(e) =>
                  setMintForm({ ...mintForm, amount: e.target.value })
                }
                className="w-full p-2 mt-1 border border-gray-700 rounded bg-gray-800 text-gray-200"
                placeholder="Amount"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-700 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-200"
            >
              Mint
            </button>
          </form>
        </div>

        {/* Burn */}
        <div className="border border-gray-700 p-4 rounded-lg bg-gray-800/50">
          <h3 className="font-semibold text-gray-200 mb-3">Burn Tokens</h3>
          <form onSubmit={handleBurn} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Amount
              </label>
              <input
                type="text"
                value={burnForm.amount}
                onChange={(e) =>
                  setBurnForm({ ...burnForm, amount: e.target.value })
                }
                className="w-full p-2 mt-1 border border-gray-700 rounded bg-gray-800 text-gray-200"
                placeholder="Amount"
                required
              />
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Burning tokens will permanently destroy them from your account
              balance and reduce the total supply.
            </p>
            <button
              type="submit"
              className="w-full bg-orange-700 text-white py-2 px-4 rounded hover:bg-orange-600 transition duration-200"
            >
              Burn
            </button>
          </form>
        </div>

        {/* Transfer Ownership */}
        <div className="border border-gray-700 p-4 rounded-lg bg-gray-800/50">
          <h3 className="font-semibold text-gray-200 mb-3">
            Transfer Ownership
          </h3>
          <form onSubmit={handleTransferOwnership} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-300">
                New Owner Address
              </label>
              <input
                type="text"
                value={newOwnerAddress}
                onChange={(e) => setNewOwnerAddress(e.target.value)}
                className="w-full p-2 mt-1 border border-gray-700 rounded bg-gray-800 text-gray-200"
                placeholder="0x..."
                required
              />
            </div>
            <p className="text-sm text-red-400 font-medium mb-4">
              WARNING: This action is irreversible. Once ownership is
              transferred, you will no longer have access to owner functions.
            </p>
            <button
              type="submit"
              className="w-full bg-purple-700 text-white py-2 px-4 rounded hover:bg-purple-600 transition duration-200"
            >
              Transfer Ownership
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OwnerActions;
