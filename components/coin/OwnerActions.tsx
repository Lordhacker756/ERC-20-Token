import React, { useEffect, useState } from "react";
import useContract from "@/lib/hooks/useContract";
import { useUserStore } from "@/lib/store/user-provider";
import LoadingButton from "@/components/ui/LoadingButton";
import { toast } from "sonner";

const OwnerActions = () => {
  const { contract } = useContract();
  const { wallet, isWalletConnected, isContractPaused, setContractPaused } =
    useUserStore((state) => state);

  const [isOwner, setIsOwner] = useState(false);
  const [mintForm, setMintForm] = useState({ recipient: "", amount: "" });
  const [burnForm, setBurnForm] = useState({ amount: "" });
  const [newOwnerAddress, setNewOwnerAddress] = useState("");
  const [txStatus, setTxStatus] = useState("");

  // Loading states
  const [isPauseToggling, setIsPauseToggling] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [isBurning, setIsBurning] = useState(false);
  const [isTransferringOwnership, setIsTransferringOwnership] = useState(false);

  useEffect(() => {
    const checkOwnership = async () => {
      if (contract && isWalletConnected && wallet) {
        try {
          const contractOwner = await contract.owner();
          const paused = await contract.paused();
          setIsOwner(wallet.toLowerCase() === contractOwner.toLowerCase());
          setContractPaused(paused);
        } catch (error) {
          console.error("Error checking ownership:", error);
          toast.error("Failed to check contract ownership");
        }
      }
    };

    checkOwnership();
  }, [contract, wallet, isWalletConnected, setContractPaused]);

  const handlePauseToggle = async () => {
    if (!contract || !isWalletConnected || !isOwner) return;

    setIsPauseToggling(true);
    setTxStatus(
      isContractPaused ? "Unpausing contract..." : "Pausing contract..."
    );
    try {
      const tx = isContractPaused
        ? await contract.unpause()
        : await contract.pause();
      await tx.wait();

      // Update both local and global state
      setContractPaused(!isContractPaused);

      setTxStatus(isContractPaused ? "Contract unpaused!" : "Contract paused!");
      toast.success(
        isContractPaused
          ? "Contract successfully unpaused"
          : "Contract successfully paused"
      );
    } catch (error: any) {
      console.error("Pause toggle error:", error);
      setTxStatus(
        `${isContractPaused ? "Unpause" : "Pause"} failed: ${error.message}`
      );
      toast.error(
        `${isContractPaused ? "Unpause" : "Pause"} failed: ${error.message}`
      );
    } finally {
      setIsPauseToggling(false);
    }
  };

  const handleMint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contract || !isWalletConnected || !isOwner) return;

    setIsMinting(true);
    setTxStatus("Minting tokens...");
    try {
      const tx = await contract.mint(mintForm.recipient, mintForm.amount);
      await tx.wait();
      setTxStatus("Tokens minted successfully!");
      toast.success(
        `Successfully minted ${
          mintForm.amount
        } TSUN to ${mintForm.recipient.slice(0, 6)}...`
      );
      setMintForm({ recipient: "", amount: "" });
    } catch (error: any) {
      console.error("Mint error:", error);
      setTxStatus(`Mint failed: ${error.message}`);
      toast.error(`Mint failed: ${error.message}`);
    } finally {
      setIsMinting(false);
    }
  };

  const handleBurn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contract || !isWalletConnected || !isOwner) return;

    setIsBurning(true);
    setTxStatus("Burning tokens...");
    try {
      const tx = await contract.burn(burnForm.amount);
      await tx.wait();
      setTxStatus("Tokens burned successfully!");
      toast.success(`Successfully burned ${burnForm.amount} TSUN`);
      setBurnForm({ amount: "" });
    } catch (error: any) {
      console.error("Burn error:", error);
      setTxStatus(`Burn failed: ${error.message}`);
      toast.error(`Burn failed: ${error.message}`);
    } finally {
      setIsBurning(false);
    }
  };

  const handleTransferOwnership = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contract || !isWalletConnected || !isOwner) return;

    // Ask for confirmation
    if (
      !confirm(
        `Are you sure you want to transfer ownership to ${newOwnerAddress}? This action cannot be undone!`
      )
    ) {
      return;
    }

    setIsTransferringOwnership(true);
    setTxStatus("Transferring ownership...");
    try {
      const tx = await contract.transferOwnership(newOwnerAddress);
      await tx.wait();
      setTxStatus("Ownership transferred successfully!");
      toast.success(
        `Ownership successfully transferred to ${newOwnerAddress.slice(
          0,
          6
        )}...`
      );
      setIsOwner(false);
      setNewOwnerAddress("");
    } catch (error: any) {
      console.error("Transfer ownership error:", error);
      setTxStatus(`Transfer ownership failed: ${error.message}`);
      toast.error(`Transfer ownership failed: ${error.message}`);
    } finally {
      setIsTransferringOwnership(false);
    }
  };

  if (!isWalletConnected) {
    return (
      <div className="card-gradient-border bg-black shadow-md">
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
      <div className="card-gradient-border bg-black shadow-md">
        <h2 className="text-xl font-bold text-purple-400 mb-4">
          Owner Actions
        </h2>
        <p className="text-gray-400">You are not the owner of this contract</p>
      </div>
    );
  }

  return (
    <div className="card-gradient-border bg-black shadow-md">
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
        <div className="border border-gray-800 p-4 rounded-lg bg-black/50 flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-gray-200 mb-3">
              Contract Status
            </h3>
            <p className="text-sm text-gray-400 mb-2">
              Current status:{" "}
              <span
                className={
                  isContractPaused
                    ? "text-red-400 font-medium"
                    : "text-green-400 font-medium"
                }
              >
                {isContractPaused ? "Paused" : "Active"}
              </span>
            </p>
            <p className="text-sm text-gray-400 mb-4">
              {isContractPaused
                ? "When paused, all token transfers are disabled."
                : "When active, token transfers are enabled."}
            </p>
          </div>
          <LoadingButton
            onClick={handlePauseToggle}
            isLoading={isPauseToggling}
            loadingText={isContractPaused ? "Unpausing..." : "Pausing..."}
            fullWidth
            variant={isContractPaused ? "success" : "danger"}
          >
            {isContractPaused ? "Unpause Contract" : "Pause Contract"}
          </LoadingButton>
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
                disabled={isMinting}
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
                disabled={isMinting}
              />
            </div>
            <LoadingButton
              type="submit"
              isLoading={isMinting}
              loadingText="Minting..."
              fullWidth
              variant="success"
            >
              Mint
            </LoadingButton>
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
                disabled={isBurning}
              />
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Burning tokens will permanently destroy them from your account
              balance and reduce the total supply.
            </p>
            <LoadingButton
              type="submit"
              isLoading={isBurning}
              loadingText="Burning..."
              fullWidth
              variant="warning"
            >
              Burn
            </LoadingButton>
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
                disabled={isTransferringOwnership}
              />
            </div>
            <p className="text-sm text-red-400 font-medium mb-4">
              WARNING: This action is irreversible. Once ownership is
              transferred, you will no longer have access to owner functions.
            </p>
            <LoadingButton
              type="submit"
              isLoading={isTransferringOwnership}
              loadingText="Transferring..."
              fullWidth
              variant="danger"
            >
              Transfer Ownership
            </LoadingButton>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OwnerActions;
