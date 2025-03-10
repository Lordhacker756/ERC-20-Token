"use client";

import { create } from "zustand";
import { createContext, useContext, useRef, PropsWithChildren } from "react";

interface UserState {
  wallet: string | null;
  isWalletConnected: boolean;
  isContractPaused: boolean;
  connectWallet: (address: string) => void;
  disconnectWallet: () => void;
  setContractPaused: (isPaused: boolean) => void;
}

const defaultState: UserState = {
  wallet: null,
  isWalletConnected: false,
  isContractPaused: false,
  connectWallet: () => {},
  disconnectWallet: () => {},
  setContractPaused: () => {},
};

export const createUserSlice = () => {
  return {
    wallet: null,
    isWalletConnected: false,
    isContractPaused: false,
    connectWallet: (address: string) =>
      set({
        wallet: address,
        isWalletConnected: true,
      }),
    disconnectWallet: () =>
      set({
        wallet: null,
        isWalletConnected: false,
      }),
    setContractPaused: (isPaused: boolean) =>
      set({ isContractPaused: isPaused }),
  };
};

export const useUserStore = create<UserState>((set) => ({
  ...defaultState,
  connectWallet: (address: string) =>
    set({
      wallet: address,
      isWalletConnected: true,
    }),
  disconnectWallet: () =>
    set({
      wallet: null,
      isWalletConnected: false,
    }),
  setContractPaused: (isPaused: boolean) => set({ isContractPaused: isPaused }),
}));

const UserStoreContext = createContext<typeof useUserStore | null>(null);

export const UserStoreProvider = ({ children }: PropsWithChildren) => {
  const storeRef = useRef(useUserStore);
  return (
    <UserStoreContext.Provider value={storeRef.current}>
      {children}
    </UserStoreContext.Provider>
  );
};
