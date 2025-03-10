import { createStore } from "zustand";
import { persist, createJSONStorage } from 'zustand/middleware'

export type UserState = {
    wallet: String;
    isWalletConnected: boolean;
}

export type UserActions = {
    connectWallet: (address: String) => void;
    disconnectWallet: () => void;
}

export type UserStore = UserState & UserActions;

export const defaultInitState: UserState = {
    wallet: "",
    isWalletConnected: false
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
            }),
            {
                name: "wallet-storage",
                storage: createJSONStorage(() => localStorage),
            }
        )
    )
}