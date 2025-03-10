import React, { useState } from "react";
import useContract from "@/lib/hooks/useContract";
import { useUserStore } from "@/lib/store/user-provider";

const Transactions = () => {
  const { contract } = useContract();
  const { wallet, isWalletConnected } = useUserStore((state) => state);

  // Form states
  const [transferForm, setTransferForm] = useState({
    recipient: "",
    amount: "",
  });
  const [approveForm, setApproveForm] = useState({ spender: "", amount: "" });
  const [transferFromForm, setTransferFromForm] = useState({
    owner: "",
    recipient: "",
    amount: "",
  });

  // Transaction status
  const [txStatus, setTxStatus] = useState("");

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contract || !isWalletConnected) return;

    setTxStatus("Processing transfer...");
    try {
      const tx = await contract.transfer(
        transferForm.recipient,
        transferForm.amount
      );
      await tx.wait();
      setTxStatus("Transfer successful!");
      setTransferForm({ recipient: "", amount: "" });
    } catch (error: any) {
      console.error("Transfer error:", error);
      setTxStatus(`Transfer failed: ${error.message}`);
    }
  };

  const handleApprove = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contract || !isWalletConnected) return;

    setTxStatus("Processing approval...");
    try {
      const tx = await contract.approve(
        approveForm.spender,
        approveForm.amount
      );
      await tx.wait();
      setTxStatus("Approval successful!");
      setApproveForm({ spender: "", amount: "" });
    } catch (error: any) {
      console.error("Approve error:", error);
      setTxStatus(`Approval failed: ${error.message}`);
    }
  };

  const handleTransferFrom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contract || !isWalletConnected) return;

    setTxStatus("Processing transfer from...");
    try {
      const tx = await contract.transferFrom(
        transferFromForm.owner,
        transferFromForm.recipient,
        transferFromForm.amount
      );
      await tx.wait();
      setTxStatus("TransferFrom successful!");
      setTransferFromForm({ owner: "", recipient: "", amount: "" });
    } catch (error: any) {
      console.error("TransferFrom error:", error);
      setTxStatus(`TransferFrom failed: ${error.message}`);
    }
  };

  const handleClaimFaucet = async () => {
    if (!contract || !isWalletConnected) return;

    setTxStatus("Claiming from faucet...");
    try {
      const tx = await contract.claimFaucet();
      await tx.wait();
      setTxStatus("Claimed tokens from faucet!");
    } catch (error: any) {
      console.error("Faucet error:", error);
      setTxStatus(`Faucet claim failed: ${error.message}`);
    }
  };

  if (!isWalletConnected) {
    return (
      <div className="p-6 bg-gray-900 rounded-lg shadow-md mb-6 border border-gray-800">
        <h2 className="text-xl font-bold text-purple-400 mb-4">Transactions</h2>
        <p className="text-gray-400">Connect wallet to perform transactions</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-900 rounded-lg shadow-md mb-6 border border-gray-800">
      <h2 className="text-xl font-bold text-purple-400 mb-4">Transactions</h2>

      {txStatus && (
        <div
          className={`p-3 mb-4 rounded ${
            txStatus.includes("failed")
              ? "bg-red-900/30 text-red-400 border border-red-700"
              : txStatus.includes("Processing")
              ? "bg-yellow-900/30 text-yellow-400 border border-yellow-700"
              : "bg-green-900/30 text-green-400 border border-green-700"
          }`}
        >
          {txStatus}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Transfer */}
        <div className="border border-gray-700 p-4 rounded-lg bg-gray-800/50">
          <h3 className="font-semibold text-gray-200 mb-3">Transfer</h3>
          <form onSubmit={handleTransfer} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Recipient
              </label>
              <input
                type="text"
                value={transferForm.recipient}
                onChange={(e) =>
                  setTransferForm({
                    ...transferForm,
                    recipient: e.target.value,
                  })
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
                value={transferForm.amount}
                onChange={(e) =>
                  setTransferForm({ ...transferForm, amount: e.target.value })
                }
                className="w-full p-2 mt-1 border border-gray-700 rounded bg-gray-800 text-gray-200"
                placeholder="Amount"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-purple-700 text-white py-2 px-4 rounded hover:bg-purple-600 transition duration-200"
            >
              Transfer
            </button>
          </form>
        </div>

        {/* Approve */}
        <div className="border border-gray-700 p-4 rounded-lg bg-gray-800/50">
          <h3 className="font-semibold text-gray-200 mb-3">Approve</h3>
          <form onSubmit={handleApprove} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Spender
              </label>
              <input
                type="text"
                value={approveForm.spender}
                onChange={(e) =>
                  setApproveForm({ ...approveForm, spender: e.target.value })
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
                value={approveForm.amount}
                onChange={(e) =>
                  setApproveForm({ ...approveForm, amount: e.target.value })
                }
                className="w-full p-2 mt-1 border border-gray-700 rounded bg-gray-800 text-gray-200"
                placeholder="Amount"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-purple-700 text-white py-2 px-4 rounded hover:bg-purple-600 transition duration-200"
            >
              Approve
            </button>
          </form>
        </div>

        {/* TransferFrom */}
        <div className="border border-gray-700 p-4 rounded-lg bg-gray-800/50">
          <h3 className="font-semibold text-gray-200 mb-3">Transfer From</h3>
          <form onSubmit={handleTransferFrom} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Owner
              </label>
              <input
                type="text"
                value={transferFromForm.owner}
                onChange={(e) =>
                  setTransferFromForm({
                    ...transferFromForm,
                    owner: e.target.value,
                  })
                }
                className="w-full p-2 mt-1 border border-gray-700 rounded bg-gray-800 text-gray-200"
                placeholder="0x..."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Recipient
              </label>
              <input
                type="text"
                value={transferFromForm.recipient}
                onChange={(e) =>
                  setTransferFromForm({
                    ...transferFromForm,
                    recipient: e.target.value,
                  })
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
                value={transferFromForm.amount}
                onChange={(e) =>
                  setTransferFromForm({
                    ...transferFromForm,
                    amount: e.target.value,
                  })
                }
                className="w-full p-2 mt-1 border border-gray-700 rounded bg-gray-800 text-gray-200"
                placeholder="Amount"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-purple-700 text-white py-2 px-4 rounded hover:bg-purple-600 transition duration-200"
            >
              Transfer From
            </button>
          </form>
        </div>

        {/* Claim Faucet */}
        <div className="border border-gray-700 p-4 rounded-lg bg-gray-800/50 flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-gray-200 mb-3">Faucet</h3>
            <p className="text-sm text-gray-400 mb-4">
              Claim free tokens from the faucet. Can only be claimed once per
              address.
            </p>
          </div>
          <button
            onClick={handleClaimFaucet}
            className="w-full bg-gradient-to-r from-purple-800 to-pink-700 text-white py-2 px-4 rounded hover:from-purple-700 hover:to-pink-600 transition duration-200"
          >
            Claim Faucet
          </button>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
