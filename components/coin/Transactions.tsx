import React, { useEffect, useState } from "react";
import useContract from "@/lib/hooks/useContract";
import { useUserStore } from "@/lib/store/user-provider";
import LoadingButton from "@/components/ui/LoadingButton";
import { formatTokenAmount } from "@/lib/utils/formatting";
import { toast } from "sonner";
import { ethers } from "ethers";

const Transactions = () => {
  const { contract } = useContract();
  const { wallet, isWalletConnected, isContractPaused, setContractPaused } =
    useUserStore((state) => state);

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

  // Loading states
  const [isTransferring, setIsTransferring] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isTransferringFrom, setIsTransferringFrom] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [isCheckingPaused, setIsCheckingPaused] = useState(false);

  // Check if contract is paused - initial fetch
  useEffect(() => {
    const checkContractStatus = async () => {
      if (contract && isWalletConnected) {
        setIsCheckingPaused(true);
        try {
          const paused = await contract.paused();
          setContractPaused(paused);
        } catch (error) {
          console.error("Error checking contract pause status:", error);
        } finally {
          setIsCheckingPaused(false);
        }
      }
    };

    checkContractStatus();
  }, [contract, isWalletConnected, setContractPaused]);

  //  Clearing Status
  useEffect(() => {
    console.log(
      "txStatus ends wiht successful?",
      txStatus,
      txStatus.endsWith("successful!")
    );
    if (txStatus.endsWith("successful!")) {
      setTimeout(() => {
        setTxStatus("");
      }, 3000);
    }
  }, [txStatus]);

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contract || !isWalletConnected || isContractPaused) return;

    setIsTransferring(true);
    setTxStatus("Processing transfer...");
    try {
      const tx = await contract.transfer(
        transferForm.recipient,
        transferForm.amount
      );
      await tx.wait();
      setTxStatus("Transfer successful!");
      toast.success(
        `Successfully transferred ${
          transferForm.amount
        } TSUN to ${transferForm.recipient.slice(0, 6)}...`
      );
      setTransferForm({ recipient: "", amount: "" });
    } catch (error: any) {
      console.error("Transfer error:", error);
      setTxStatus(`Transfer failed: ${error.message}`);
      toast.error(`Transfer failed: ${error.message}`);
    } finally {
      setIsTransferring(false);
    }
  };

  const handleApprove = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contract || !isWalletConnected || isContractPaused) return;

    setIsApproving(true);
    setTxStatus("Processing approval...");
    try {
      const tx = await contract.approve(
        approveForm.spender,
        approveForm.amount
      );
      await tx.wait();
      setTxStatus("Approval successful!");
      toast.success(
        `Successfully approved ${
          approveForm.amount
        } TSUN for ${approveForm.spender.slice(0, 6)}...`
      );
      setApproveForm({ spender: "", amount: "" });
    } catch (error: any) {
      console.error("Approve error:", error);
      setTxStatus(`Approval failed: ${error.message}`);
      toast.error(`Approval failed: ${error.message}`);
    } finally {
      setIsApproving(false);
    }
  };

  const handleTransferFrom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contract || !isWalletConnected || isContractPaused) return;

    setIsTransferringFrom(true);
    setTxStatus("Processing transfer from...");
    try {
      const tx = await contract.transferFrom(
        transferFromForm.owner,
        transferFromForm.recipient,
        transferFromForm.amount
      );
      await tx.wait();
      setTxStatus("TransferFrom successful!");
      toast.success(
        `Successfully transferred ${
          transferFromForm.amount
        } TSUN from ${transferFromForm.owner.slice(
          0,
          6
        )}... to ${transferFromForm.recipient.slice(0, 6)}...`
      );
      setTransferFromForm({ owner: "", recipient: "", amount: "" });
    } catch (error: any) {
      console.error("TransferFrom error:", error);
      setTxStatus(`TransferFrom failed: ${error.message}`);
      toast.error(`TransferFrom failed: ${error.message}`);
    } finally {
      setIsTransferringFrom(false);
    }
  };

  const handleClaimFaucet = async () => {
    if (!contract || !isWalletConnected) return;

    setIsClaiming(true);
    setTxStatus("Claiming from faucet...");
    try {
      const tx = await contract.claimFaucet();
      await tx.wait();
      const faucetAmount = await contract.faucetAmount();
      setTxStatus("Claimed tokens from faucet!");
      toast.success(
        `Successfully claimed ${formatTokenAmount(
          faucetAmount
        )} TSUN from faucet!`
      );
    } catch (error: any) {
      console.error("Faucet error:", error);
      setTxStatus(`Faucet claim failed: ${error.message}`);
      toast.error(`Faucet claim failed: ${error.message}`);
    } finally {
      setIsClaiming(false);
    }
  };

  if (!isWalletConnected) {
    return (
      <div className="card-gradient-border bg-black shadow-md mb-6">
        <h2 className="text-xl font-bold text-purple-400 mb-4">Transactions</h2>
        <p className="text-gray-400">Connect wallet to perform transactions</p>
      </div>
    );
  }

  return (
    <div className="card-gradient-border bg-black shadow-md mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-purple-400">Transactions</h2>
        {isContractPaused && (
          <div className="bg-red-900/30 text-red-400 border border-red-700 px-4 py-2 rounded-full flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            Contract Paused
          </div>
        )}
      </div>

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

      {isContractPaused && (
        <div className="p-4 mb-4 bg-red-900/20 border border-red-700 rounded-lg text-gray-300">
          <h3 className="font-bold text-red-400 mb-2 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Contract Paused
          </h3>
          <p>
            All transfer operations are currently disabled because the contract
            has been paused by the owner. This is typically done for maintenance
            or security reasons. Please wait until the contract is unpaused
            before attempting any transfers.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Transfer */}
        <div
          className={`border ${
            isContractPaused ? "border-red-800 opacity-60" : "border-gray-800"
          } p-4 rounded-lg bg-black/50`}
        >
          <h3 className="font-semibold text-gray-200 mb-3 flex items-center">
            Transfer
            {isContractPaused && (
              <span className="ml-2 text-xs bg-red-900/50 text-red-400 px-2 py-1 rounded">
                Disabled
              </span>
            )}
          </h3>
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
                disabled={isTransferring || isContractPaused}
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
                disabled={isTransferring || isContractPaused}
              />
            </div>
            <LoadingButton
              type="submit"
              isLoading={isTransferring}
              loadingText="Processing..."
              fullWidth
              variant="primary"
              disabled={isContractPaused}
            >
              {isContractPaused ? "Transfers Disabled" : "Transfer"}
            </LoadingButton>
          </form>
        </div>

        {/* Approve */}
        <div
          className={`border ${
            isContractPaused ? "border-red-800 opacity-60" : "border-gray-800"
          } p-4 rounded-lg bg-black/50`}
        >
          <h3 className="font-semibold text-gray-200 mb-3 flex items-center">
            Approve
            {isContractPaused && (
              <span className="ml-2 text-xs bg-red-900/50 text-red-400 px-2 py-1 rounded">
                Disabled
              </span>
            )}
          </h3>
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
                disabled={isApproving || isContractPaused}
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
                disabled={isApproving || isContractPaused}
              />
            </div>
            <LoadingButton
              type="submit"
              isLoading={isApproving}
              loadingText="Approving..."
              fullWidth
              variant="primary"
              disabled={isContractPaused}
            >
              {isContractPaused ? "Approvals Disabled" : "Approve"}
            </LoadingButton>
          </form>
        </div>

        {/* TransferFrom */}
        <div
          className={`border ${
            isContractPaused ? "border-red-800 opacity-60" : "border-gray-800"
          } p-4 rounded-lg bg-black/50`}
        >
          <h3 className="font-semibold text-gray-200 mb-3 flex items-center">
            Transfer From
            {isContractPaused && (
              <span className="ml-2 text-xs bg-red-900/50 text-red-400 px-2 py-1 rounded">
                Disabled
              </span>
            )}
          </h3>
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
                disabled={isTransferringFrom || isContractPaused}
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
                disabled={isTransferringFrom || isContractPaused}
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
                disabled={isTransferringFrom || isContractPaused}
              />
            </div>
            <LoadingButton
              type="submit"
              isLoading={isTransferringFrom}
              loadingText="Processing..."
              fullWidth
              variant="primary"
              disabled={isContractPaused}
            >
              {isContractPaused ? "Transfers Disabled" : "Transfer From"}
            </LoadingButton>
          </form>
        </div>

        {/* Claim Faucet */}
        <div className="border border-gray-800 p-4 rounded-lg bg-black/50 flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-gray-200 mb-3">Faucet</h3>
            <p className="text-sm text-gray-400 mb-4">
              Claim free tokens from the faucet. Can only be claimed once per
              address.
            </p>
          </div>
          <LoadingButton
            onClick={handleClaimFaucet}
            isLoading={isClaiming}
            loadingText="Claiming..."
            fullWidth
            variant="gradient-border"
          >
            Claim Faucet
          </LoadingButton>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
