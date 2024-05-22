"use client";

import React, { useState } from "react";
import Button from '@mui/joy/Button';
import Divider from '@mui/joy/Divider';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import WalletOutlinedIcon from '@mui/icons-material/WalletOutlined';
import { format_token } from "~/utils";
import { usePolkadot } from "~/hooks/polkadot";
import { type TransactionStatus } from "~/types";
import { useOptimaLayout } from '~/common/layout/optima/useOptimaLayout';
import { Box, Input, Typography } from "@mui/joy";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import FormLabel from '@mui/joy/FormLabel';
import Radio, { radioClasses } from '@mui/joy/Radio';
import RadioGroup from '@mui/joy/RadioGroup';
import Sheet from '@mui/joy/Sheet';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';

type MenuType =
    | "stake"
    | "unstake"

export const WalletModal = () => {
    const {
        stakeData,
        selectedAccount,
        balance,
        isBalanceLoading,
        handleConnect,
        addStake,
        removeStake,
    } = usePolkadot();

    const {
        closeWallet,
        openWallet,
        showWallet,
    } = useOptimaLayout();

    const [activeMenu, setActiveMenu] = useState<MenuType>("stake");
    const validator = process.env.NEXT_PUBLIC_COMCHAT_ADDRESS || "";
    const [amount, setAmount] = useState<string>("");
    const netUid = 0;

    const [transactionStatus, setTransactionStatus] = useState<TransactionStatus>(
        {
            status: null,
            message: null,
            finalized: false,
        },
    );

    const [inputError, setInputError] = useState<{
        validator: string | null;
        value: string | null;
    }>({
        validator: null,
        value: null,
    });

    const handleCallback = (callbackReturn: TransactionStatus) => {
        setTransactionStatus(callbackReturn);
    };

    if (!selectedAccount) return null;

    const handleMenuClick = (type: MenuType) => {
        setAmount("");
        setActiveMenu(type);
    };

    const handleCheckInput = () => {
        setInputError({ validator: null, value: null });
        if (!validator)
            setInputError((prev) => ({
                ...prev,
                validator: "Validator Address cannot be empty",
            }));
        if (!amount)
            setInputError((prev) => ({ ...prev, value: "Amount cannot be empty" }));
        return !!(amount && validator);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const isValidInput = handleCheckInput();

        if (!isValidInput) return;

        setTransactionStatus({
            status: "STARTING",
            finalized: false,
            message: "Starting transaction...",
        });

        if (activeMenu === "stake") {
            addStake({
                validator,
                amount,
                netUid,
                callback: handleCallback,
            });
        }
        if (activeMenu === "unstake") {
            removeStake({
                validator,
                amount,
                netUid,
                callback: handleCallback,
            });
        }
    };

    const buttons = [
        {
            text: "Stake",
            handleMenuClick: (menuType: MenuType) => handleMenuClick(menuType),
        },
        {
            text: "Unstake",
            handleMenuClick: (menuType: MenuType) => handleMenuClick(menuType),
        },
    ];

    let userStakeWeight: bigint | null = null;
    if (stakeData != null && selectedAccount != null) {
        const user_stake_entry = stakeData[selectedAccount.address]
        userStakeWeight = user_stake_entry ?? 0n;
    }

    return (
        <Modal open={showWallet} onClose={closeWallet}>
            <ModalDialog variant="outlined" role="alertdialog">
                <DialogTitle>
                    <WalletOutlinedIcon />
                    My Wallet
                </DialogTitle>
                <Divider />
                <DialogContent sx={{ gap: 2 }}>
                    <Button
                        onClick={handleConnect}
                        variant="solid"
                        color="neutral"
                        size="lg"
                    >
                        {selectedAccount.address}
                    </Button>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: "space-between"
                    }}>
                        <Typography>
                            Your Balance:
                        </Typography>
                        {!isBalanceLoading ? (
                            <Typography>{Math.round(balance)} COMAI</Typography>
                        ) : (
                            <Typography>
                                Loading Balance Info
                            </Typography>
                        )}
                    </Box>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: "space-between"
                    }}>
                        <Typography>
                            Total Staked:
                        </Typography>
                        {userStakeWeight !== null ? (
                            <Typography>{format_token(userStakeWeight)} COMAI</Typography>
                        ) : (
                            <Typography>
                                Loading Staking Info
                            </Typography>
                        )}
                    </Box>
                    <RadioGroup
                        aria-label="platform"
                        defaultValue="Stake"
                        overlay
                        name="platform"
                        sx={{
                            flexDirection: 'row',
                            gap: 2,
                            [`& .${radioClasses.checked}`]: {
                                [`& .${radioClasses.action}`]: {
                                    inset: -1,
                                    border: '3px solid',
                                    borderColor: 'primary.500',
                                },
                            },
                            [`& .${radioClasses.radio}`]: {
                                display: 'contents',
                                '& > svg': {
                                    zIndex: 2,
                                    position: 'absolute',
                                    top: '-8px',
                                    right: '-8px',
                                    bgcolor: 'background.surface',
                                    borderRadius: '50%',
                                },
                            },
                        }}
                    >
                        {buttons.map((button) => (
                            <Sheet
                                onClick={() =>
                                    button.handleMenuClick(button.text.toLowerCase() as MenuType)
                                }
                                key={button.text}
                                variant="outlined"
                                sx={{
                                    borderRadius: 'md',
                                    boxShadow: 'sm',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: 1.5,
                                    p: 2,
                                    minWidth: 120,
                                }}
                            >
                                <Radio id={button.text} value={button.text} checkedIcon={<CheckCircleRoundedIcon />} />
                                {button.text === "Stake" ? <LockOutlinedIcon /> : <LockOpenOutlinedIcon />}
                                <FormLabel htmlFor={button.text}>{button.text}</FormLabel>
                            </Sheet>
                        ))}
                    </RadioGroup>

                    <form
                        onSubmit={handleSubmit}
                    >
                        <Box sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2
                        }}>
                            <Box sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 1
                            }}>
                                <Typography>
                                    ComChat Validator Address
                                </Typography>
                                <Input
                                    type="text"
                                    value={validator}
                                    disabled
                                />
                            </Box>
                            <Box sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 1
                            }}>
                                <Typography>Amount</Typography>
                                <Input
                                    type="number"
                                    disabled={transactionStatus.status === "PENDING"}
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="The amount of COMAI to use in the transaction"
                                />
                            </Box>
                            {inputError.value && (
                                <p
                                    className={`-mt-2 mb-1 flex text-left text-base text-red-400`}
                                >
                                    {inputError.value}
                                </p>
                            )}
                            <Button
                                className="w-full"
                                loading={transactionStatus.status === "PENDING" || transactionStatus.status === "STARTING"}
                                type="submit"
                                variant="solid"
                                color="danger"
                                disabled={transactionStatus.status === "PENDING"}
                            >
                                Submit
                            </Button>
                        </Box>
                    </form>
                    {transactionStatus.status && (
                        <Typography
                            color={
                                transactionStatus.status === "PENDING" ? "warning" :
                                    transactionStatus.status === "ERROR" ? "danger" :
                                        transactionStatus.status === "SUCCESS" ? "success" :
                                            transactionStatus.status === "STARTING" ? "primary" : "primary"
                            }
                        >
                            {(transactionStatus.status === "PENDING" ||
                                transactionStatus.status === "STARTING") && <></>}
                            {transactionStatus.message}
                        </Typography>
                    )}

                </DialogContent>
            </ModalDialog>
        </Modal>
    );
};
