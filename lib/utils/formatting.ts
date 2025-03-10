import { ethers } from "ethers";

/**
 * Format a wei value to a human-readable token amount
 * Handles values stored as strings or BigNumber
 */
export function formatTokenAmount(amount: string | bigint | number): string {
    try {
        // Handle different input types
        let bigIntValue: bigint;

        if (typeof amount === 'string') {
            bigIntValue = amount ? ethers.getBigInt(amount) : 0n;
        } else if (typeof amount === 'bigint') {
            bigIntValue = amount;
        } else if (typeof amount === 'number') {
            bigIntValue = BigInt(Math.floor(amount));
        } else {
            bigIntValue = 0n;
        }

        // Format with ethers to handle the 18 decimals correctly
        const formattedValue = ethers.formatUnits(bigIntValue, 18);

        // Remove trailing zeros
        const trimmed = formattedValue.replace(/\.?0+$/, "");

        return trimmed === "" ? "0" : trimmed;
    } catch (error) {
        console.error("Error formatting token amount:", error);
        return "0";
    }
}

/**
 * Shorten an address for display
 */
export function shortenAddress(address?: string): string {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (error) {
        console.error("Failed to copy:", error);
        return false;
    }
}
