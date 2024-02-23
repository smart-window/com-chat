import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WalletData {
  address: string | null;
  amount: number | null;
}

interface WalletActions {
  setAddress: (address: string) => void;
  setAmount: (amount: number) => void;
}

type WalletStore = WalletData & WalletActions;

export const useWalletStore = create<WalletStore>()(
  persist(
    (set) => ({

      address: "",
      amount: 0,

      setAddress: (address: string) =>
        set(() => {
          return {
            address: address,
          };
        }),

      setAmount: (amount: number) =>
        set(() => {
          return {
            amount: amount,
          };
        }),

    }),
    {
      name: 'wallet',
    }),
);
