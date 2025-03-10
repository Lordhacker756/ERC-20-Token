import { createStore } from "zustand";
import { persist, createJSONStorage } from 'zustand/middleware'

export type UserState = {
    wallet: String;
    isWalletConnected: boolean;
    isContractPaused: boolean;
}

export type UserActions = {
    connectWallet: (address: String) => void;
    disconnectWallet: () => void;
    pauseContract: () => void;
    resumeContract: () => void;
}

export type UserStore = UserState & UserActions;

export const defaultInitState: UserState = {
    wallet: "",
    isWalletConnected: false,
    isContractPaused: false
}

export const createUserStore = (
    initState: UserState = defaultInitState
) => {
    return createStore<UserStore>()(
        persist(
            (set) => ({
                ...initState,
                connectWallet: (address: String) => set(() => ({
                    wallet: address,
                    isWalletConnected: true
                })),
                disconnectWallet: () => set(() => ({
                    wallet: "",
                    isWalletConnected: false
                })),
                pauseContract: () => set(() => ({
                    isContractPaused: true,
                })),
                resumeContract: () => set(() => ({
                    isContractPaused: false,
                }))
            }),
            {
                name: "wallet-storage",
                storage: createJSONStorage(() => localStorage),
            }
        )
    )
}