import { useEffect, useState } from "react";
import ERC20 from "../abi/tsundere.json";
import useWallet from "./useWallet";
import { Contract, ethers } from "ethers";

export default function useContract() {
  const { provider, signer } = useWallet();
  const [contract, setContract] = useState<Contract | null>(null);
  const contractAddress = "0x8A86B7C7b3B8a5FE4c07fC348D91A8f06262c276";

  useEffect(() => {
    console.log("Current provider and signer recieved:: ", {
      provider,
      signer,
    });
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
  };

  return {
    contract,
    connectContract,
  };
}
