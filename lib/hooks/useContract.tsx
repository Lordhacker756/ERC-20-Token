import { useEffect, useState } from "react";
import ERC20 from "../abi/tsundere.json";
import useWallet from "./useWallet";
import { Contract, ethers } from "ethers";
import { useUserStore } from "@/lib/store/user-provider";

export default function useContract() {
  const { provider, signer } = useWallet();
  const { setContractPaused } = useUserStore();
  const [contract, setContract] = useState<Contract | null>(null);
  const contractAddress = "0x8A86B7C7b3B8a5FE4c07fC348D91A8f06262c276";

  useEffect(() => {
    console.log("::useContract::", { provider, signer });
    connectContract();
  }, [provider, signer]);

  // Interact with the deployed contract
  const connectContract = async () => {
    if (!provider || !signer) {
      console.log("No provider and signer available");
      return null;
    }

    // Create a new contract instance
    const tsundereContract = new ethers.Contract(
      contractAddress,
      ERC20.abi,
      signer
    );

    // Update local state
    setContract(tsundereContract);
    console.log("Connected Contract:", { tsundereContract });

    // Check if contract is paused
    try {
      const paused = await tsundereContract.paused();
      setContractPaused(paused);
    } catch (error) {
      console.error("Error checking contract paused status:", error);
    }
  };

  return {
    contract,
    connectContract,
  };
}
