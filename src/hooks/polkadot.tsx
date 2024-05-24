"use client";

import { toast } from "react-toastify";
import { WalletConnectModal } from "~/apps/wallet-modal/WalletConnectModal";

import { calculate_amount, get_stake_out, get_balance } from "~/utils";

import React, { createContext, useContext, useEffect, useState } from "react";
import { ApiPromise, type SubmittableResult, WsProvider } from "@polkadot/api";

import {
  type Staking,
  type Transfer,
  type StakeData,
  type TransferStake,
  type PolkadotApiState,
  type PolkadotProviderProps,
} from "~/types";
import { type DispatchError } from "@polkadot/types/interfaces";
import { type InjectedAccountWithMeta } from "@polkadot/extension-inject/types";
import { env } from '~/server/env.mjs';

interface PolkadotContextType {
  api: ApiPromise | null;
  isConnected: boolean;
  isInitialized: boolean;

  balance: number;
  isBalanceLoading: boolean;

  accounts: InjectedAccountWithMeta[];
  selectedAccount: InjectedAccountWithMeta | undefined;

  blockNumber: number;
  stakeData: StakeData | null;

  handleConnect: () => void;

  transfer: (args: Transfer) => void;
  transferStake: (args: TransferStake) => void;

  addStake: (args: Staking) => void;
  removeStake: (args: Staking) => void;
}

const PolkadotContext = createContext<PolkadotContextType | undefined>(
  undefined,
);

export const PolkadotProvider: React.FC<PolkadotProviderProps> = ({
  children,
  wsEndpoint,
}) => {
  const [openModal, setOpenModal] = useState(false);

  const [api, setApi] = useState<ApiPromise | null>(null);

  const [polkadotApi, setPolkadotApi] = useState<PolkadotApiState>({
    web3Enable: null,
    web3Accounts: null,
    web3FromAddress: null,
  });

  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState(false);
  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>([]);
  const [selectedAccount, setSelectedAccount] =
    useState<InjectedAccountWithMeta>();

  const [balance, setBalance] = useState(0);
  const [isBalanceLoading, setIsBalanceLoading] = useState(true);

  const [stakeData, setStakeData] = useState<StakeData | null>(null);
  const [blockNumber, setBlockNumber] = useState(0);

  async function loadPolkadotApi() {
    const { web3Accounts, web3Enable, web3FromAddress } = await import(
      "@polkadot/extension-dapp"
    );

    setPolkadotApi({
      web3Accounts,
      web3Enable,
      web3FromAddress,
    });

    const provider = new WsProvider(wsEndpoint);
    const api = await ApiPromise.create({ provider });

    setApi(api);
    setIsInitialized(true);
  }

  useEffect(() => {
    void loadPolkadotApi();
    return () => {
      void api?.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wsEndpoint]);

  // Add the signMessage function
  useEffect(() => {
    async function signMessage(message: string): Promise<string | null> {
      try {
        if (!selectedAccount || !polkadotApi.web3FromAddress)
          return null;
        const injector = await polkadotApi.web3FromAddress(selectedAccount.address);
        if (!injector.signer.signRaw) {
          toast.error("Signer does not support raw signing");
          return null;
        }

        const { signature } = await injector.signer.signRaw({
          address: selectedAccount.address,
          data: message,
          type: 'bytes',
        });

        localStorage.setItem('walletSignature', signature);
        localStorage.setItem('walletAddress', selectedAccount.address);
        localStorage.setItem('signMessage', message);

        return signature;
      } catch (error) {
        console.error("Error signing message:", error);
        toast.error("Error signing message");
        return null;
      }
    }

    const saved_message = localStorage.getItem('signMessage')
    if (saved_message) {
      const timestamp = Number(saved_message.split("TimeStamp: ")[1])
      const current = Date.now()

      // Check expired signature
      if ((current - timestamp) > Number(env.NEXT_PUBLIC_SIGNATURE_TIMEOUT)) {
        localStorage.removeItem('walletSignature');
        localStorage.removeItem('walletAddress');
        localStorage.removeItem('signMessage');
        console.log("User signed out.")
      }
    }

    // Request sign if wallet changed or signature expired
    if (selectedAccount && polkadotApi.web3FromAddress && stakeData) {
      const saved_address = localStorage.getItem('walletAddress')
      if (saved_address != selectedAccount.address) {
        signMessage(`Sign is required to use ComChat. TimeStamp: ${Date.now()}`)
      }
    }
  }, [selectedAccount, polkadotApi, stakeData]);

  async function getWallets() {
    if (!polkadotApi.web3Enable || !polkadotApi.web3Accounts) return;
    const extensions = await polkadotApi.web3Enable("Community Validator");
    if (!extensions) {
      toast.error("No account selected");
    }
    try {
      const response = await polkadotApi.web3Accounts();
      return response;
    } catch (error) {
      console.warn(error);
    }
  }

  async function handleConnect() {
    try {
      const allAccounts = await getWallets();
      if (allAccounts) {
        setAccounts(allAccounts);
        setOpenModal(true);
      }
    } catch (error) {
      console.warn(error);
    }
  }

  useEffect(() => {
    const favoriteWalletAddress = localStorage.getItem("favoriteWalletAddress");
    if (favoriteWalletAddress) {
      const fetchWallets = async () => {
        const walletList = await getWallets();
        const accountExist = walletList?.find(
          (wallet) => wallet.address === favoriteWalletAddress,
        );
        if (accountExist) {
          setSelectedAccount(accountExist);
          setIsConnected(true);
        }
      };
      fetchWallets().catch(console.error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitialized]);

  async function handleWalletSelections(wallet: InjectedAccountWithMeta) {
    localStorage.setItem("favoriteWalletAddress", wallet.address);
    setSelectedAccount(wallet);
    setIsConnected(true);
    setOpenModal(false);
  }

  async function addStake({ netUid, validator, amount, callback }: Staking) {
    if (
      !api ||
      !selectedAccount ||
      !polkadotApi.web3FromAddress ||
      !api.tx.subspaceModule?.addStake
    )
      return;

    const injector = await polkadotApi.web3FromAddress(selectedAccount.address);

    api.tx.subspaceModule
      .addStake(netUid, validator, calculate_amount(amount))
      .signAndSend(
        selectedAccount.address,
        { signer: injector.signer },
        (result: SubmittableResult) => {
          if (result.status.isInBlock) {
            callback?.({
              finalized: false,
              status: "PENDING",
              message: "Staking in progress",
            });
          }
          if (result.status.isFinalized) {
            result.events.forEach(({ event }) => {
              if (api.events.system?.ExtrinsicSuccess?.is(event)) {
                toast.success("Transaction successful");
                callback?.({
                  finalized: true,
                  status: "SUCCESS",
                  message: "Staked successfully",
                });
              } else if (api.events.system?.ExtrinsicFailed?.is(event)) {
                const [dispatchError] = event.data as unknown as [
                  DispatchError,
                ];

                let msg;
                if (dispatchError.isModule) {
                  const mod = dispatchError.asModule;
                  const error = api.registry.findMetaError(mod);

                  if (error.section && error.name && error.docs) {
                    const errorMessage = `${error.name}`;
                    msg = `Staking failed: ${errorMessage}`;
                  } else {
                    msg = `Staking failed: ${dispatchError.type}`;
                  }
                } else {
                  msg = `Staking failed: ${dispatchError.toString()}`;
                }
                toast.error(msg);
                callback?.({
                  finalized: true,
                  status: "ERROR",
                  message: msg,
                });
              }
            });
          }
        },
      )
      .catch((err) => {
        toast.error(err as string);
      });
  }

  async function removeStake({ netUid, validator, amount, callback }: Staking) {
    if (
      !api ||
      !selectedAccount ||
      !polkadotApi.web3FromAddress ||
      !api.tx.subspaceModule?.removeStake
    )
      return;

    const injector = await polkadotApi.web3FromAddress(selectedAccount.address);

    api.tx.subspaceModule
      .removeStake(netUid, validator, calculate_amount(amount))
      .signAndSend(
        selectedAccount.address,
        { signer: injector.signer },
        (result: SubmittableResult) => {
          if (result.status.isInBlock) {
            callback?.({
              finalized: false,
              status: "PENDING",
              message: "Unstaking in progress",
            });
          }
          if (result.status.isFinalized) {
            result.events.forEach(({ event }) => {
              if (api.events.system?.ExtrinsicSuccess?.is(event)) {
                toast.success("Unstaking successful");
                callback?.({
                  finalized: true,
                  status: "SUCCESS",
                  message: "Unstaked successfully",
                });
              } else if (api.events.system?.ExtrinsicFailed?.is(event)) {
                const [dispatchError] = event.data as unknown as [
                  DispatchError,
                ];

                let msg;
                if (dispatchError.isModule) {
                  const mod = dispatchError.asModule;
                  const error = api.registry.findMetaError(mod);

                  if (error.section && error.name && error.docs) {
                    const errorMessage = `${error.name}`;
                    msg = `Unstaking failed: ${errorMessage}`;
                  } else {
                    msg = `Unstaking failed: ${dispatchError.type}`;
                  }
                } else {
                  msg = `Unstaking failed: ${dispatchError.toString()}`;
                }
                toast.error(msg);
                callback?.({
                  finalized: true,
                  status: "ERROR",
                  message: msg,
                });
              }
            });
          }
        },
      )
      .catch((err) => {
        toast.error(err as string);
      });
  }

  async function transfer({ to, amount, callback }: Transfer) {
    if (
      !api ||
      !selectedAccount ||
      !polkadotApi.web3FromAddress ||
      !api.tx.balances?.transfer
    )
      return;

    const injector = await polkadotApi.web3FromAddress(selectedAccount.address);

    api.tx.balances
      .transfer(to, calculate_amount(amount))
      .signAndSend(
        selectedAccount.address,
        { signer: injector.signer },
        (result: SubmittableResult) => {
          if (result.status.isInBlock) {
            callback?.({
              finalized: false,
              status: "PENDING",
              message: "Transfer in progress",
            });
          }
          if (result.status.isFinalized) {
            result.events.forEach(({ event }) => {
              if (api.events.system?.ExtrinsicSuccess?.is(event)) {
                toast.success("Transfer successful");
                callback?.({
                  finalized: true,
                  status: "SUCCESS",
                  message: "Transfer successful",
                });
              } else if (api.events.system?.ExtrinsicFailed?.is(event)) {
                const [dispatchError] = event.data as unknown as [
                  DispatchError,
                ];

                let msg;
                if (dispatchError.isModule) {
                  const mod = dispatchError.asModule;
                  const error = api.registry.findMetaError(mod);

                  if (error.section && error.name && error.docs) {
                    const errorMessage = `${error.name}`;
                    msg = `Transfer failed: ${errorMessage}`;
                  } else {
                    msg = `Transfer failed: ${dispatchError.type}`;
                  }
                } else {
                  msg = `Transfer failed: ${dispatchError.toString()}`;
                }
                toast.error(msg);
                callback?.({
                  finalized: true,
                  status: "ERROR",
                  message: msg,
                });
              }
            });
          }
        },
      )
      .catch((err) => {
        toast.error(err as string);
      });
  }

  async function transferStake({
    fromValidator,
    toValidator,
    amount,
    netUid,
    callback,
  }: TransferStake) {
    if (
      !api ||
      !selectedAccount ||
      !polkadotApi.web3FromAddress ||
      !api.tx.subspaceModule?.transferStake
    )
      return;

    const injector = await polkadotApi.web3FromAddress(selectedAccount.address);

    api.tx.subspaceModule
      .transferStake(
        netUid,
        fromValidator,
        toValidator,
        calculate_amount(amount),
      )
      .signAndSend(
        selectedAccount.address,
        { signer: injector.signer },
        (result: SubmittableResult) => {
          if (result.status.isInBlock) {
            callback?.({
              finalized: false,
              status: "PENDING",
              message: "Transfer in progress",
            });
          }
          if (result.status.isFinalized) {
            result.events.forEach(({ event }) => {
              if (api.events.system?.ExtrinsicSuccess?.is(event)) {
                toast.success("Transfer successful");
                callback?.({
                  finalized: true,
                  status: "SUCCESS",
                  message: "Transfer successful",
                });
              } else if (api.events.system?.ExtrinsicFailed?.is(event)) {
                const [dispatchError] = event.data as unknown as [
                  DispatchError,
                ];

                let msg;
                if (dispatchError.isModule) {
                  const mod = dispatchError.asModule;
                  const error = api.registry.findMetaError(mod);

                  if (error.section && error.name && error.docs) {
                    const errorMessage = `${error.name}`;
                    msg = `Transfer failed: ${errorMessage}`;
                  } else {
                    msg = `Transfer failed: ${dispatchError.type}`;
                  }
                } else {
                  msg = `Transfer failed: ${dispatchError.toString()}`;
                }
                toast.error(msg);
                callback?.({
                  finalized: true,
                  status: "ERROR",
                  message: msg,
                });
              }
            });
          }
        },
      )
      .catch((err) => {
        toast.error(err as string);
      });
  }

  useEffect(() => {
    if (api) {
      void api.rpc.chain.subscribeNewHeads((header) => {
        setBlockNumber(header.number.toNumber());
      });

      get_stake_out(api)
        .then((stake_data_result: StakeData | undefined) => {
          setStakeData(stake_data_result || null);
        })
        .catch((e) => {
          toast.error(`Error fetching stake out map", ${e}`);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api]);

  useEffect(() => {
    const fetchBalance = async () => {
      if (!api || !selectedAccount?.address) {
        console.error("API or user address is not defined");
        setIsBalanceLoading(false);
        return;
      }

      const fetchedBalance = await get_balance({
        api,
        address: selectedAccount.address,
      });
      setBalance(fetchedBalance);
      setIsBalanceLoading(false);
    };

    void fetchBalance();
  }, [api, selectedAccount?.address]);

  return (
    <PolkadotContext.Provider
      value={{
        api,
        isConnected,
        isInitialized,

        balance,
        isBalanceLoading,

        accounts,
        selectedAccount,

        blockNumber,
        stakeData,

        handleConnect,

        transfer,
        transferStake,

        addStake,
        removeStake,
      }}
    >
      <WalletConnectModal
        open={openModal}
        wallets={accounts}
        setOpen={setOpenModal}
        handleWalletSelections={handleWalletSelections}
      />
      {children}
    </PolkadotContext.Provider>
  );
};

export const usePolkadot = (): PolkadotContextType => {
  const context = useContext(PolkadotContext);
  if (context === undefined) {
    throw new Error("usePolkadot must be used within a PolkadotProvider");
  }
  return context;
};
