"use client";

import React, { useState } from "react";
import Button from '@mui/joy/Button';
import Divider from '@mui/joy/Divider';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import DialogActions from '@mui/joy/DialogActions';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import WalletOutlined from '@mui/icons-material/WalletOutlined';
import { toast } from "react-toastify";
import Box from '@mui/joy/Box';
import Radio from '@mui/joy/Radio';
import RadioGroup from '@mui/joy/RadioGroup';
import Sheet from '@mui/joy/Sheet';

import { type InjectedAccountWithMeta } from "@polkadot/extension-inject/types";
import Link from "next/link";
import { Typography } from "@mui/joy";

export const WalletConnectModal = ({
  open,
  wallets,
  setOpen,
  handleWalletSelections,
}: {
  open: boolean;
  setOpen: (args: boolean) => void;
  wallets: InjectedAccountWithMeta[];
  handleWalletSelections: (arg: InjectedAccountWithMeta) => void;
}) => {
  const [selectedAccount, setSelectedAccount] =
    useState<InjectedAccountWithMeta>();

  return (
    <React.Fragment>
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog variant="outlined" role="alertdialog">
          <DialogTitle>
            <WalletOutlined />
            Select Wallet
          </DialogTitle>
          <Divider />
          <DialogContent>
            <Box sx={{ mx: 1, my: 1 }}>
              <RadioGroup
                aria-labelledby="storage-label"
                defaultValue="512GB"
                size="lg"
                sx={{ gap: 1.5 }}
              >
                {wallets.map((item) => (
                  <Sheet
                    key={item.address}
                    sx={{
                      p: 2,
                      borderRadius: 'md',
                      boxShadow: 'sm',
                    }}
                  >
                    <Radio
                      onClick={() => setSelectedAccount(item)}
                      label={
                        <Box sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 1,
                        }}>
                          <Typography level="title-md">{item.meta.name}</Typography>
                          <Typography level="body-sm">{item.address}</Typography>
                        </Box>
                      }
                      overlay
                      disableIcon
                      value={item.address}
                      slotProps={{
                        label: ({ checked }) => ({
                          sx: {
                            fontWeight: 'lg',
                            fontSize: 'md',
                            color: checked ? 'text.primary' : 'text.secondary',
                          },
                        }),
                        action: ({ checked }) => ({
                          sx: (theme) => ({
                            ...(checked && {
                              '--variant-borderWidth': '2px',
                              '&&': {
                                // && to increase the specificity to win the base :hover styles
                                borderColor: theme.vars.palette.primary[500],
                              },
                            }),
                          }),
                        }),
                      }}
                    />
                  </Sheet>
                ))}
                {!wallets.length && (
                  <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                  }}>
                    <Typography level="title-lg" color="danger">
                      No wallet found.
                    </Typography>
                    <Typography level="body-md">
                      Please install a Wallet extension or check permission settings.
                    </Typography>
                    <Typography level="body-md">
                      If you don't have a wallet, we recommend one of these:
                    </Typography>
                    <Box sx={{
                      display: 'flex',
                      gap: 4,
                      alignItems: "center"
                    }}>
                      <Link
                        href="https://subwallet.app/"
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600"
                      >
                        SubWallet
                      </Link>
                      <Link
                        href="https://polkadot.js.org/extension/"
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600"
                      >
                        Polkadot JS
                      </Link>
                    </Box>
                  </Box>
                )}
              </RadioGroup>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button
              disabled={!selectedAccount}
              variant="solid"
              color="primary"
              onClick={() => {
                if (!selectedAccount) {
                  toast.error("No account selected");
                  return;
                }
                handleWalletSelections(selectedAccount);
              }}
            >
              Connect
            </Button>
          </DialogActions>
        </ModalDialog>
      </Modal>
    </React.Fragment>
  );
};
