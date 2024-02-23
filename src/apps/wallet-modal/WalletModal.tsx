import { useEffect, useState } from 'react';

import { Alert, Box, Button, Divider, FormControl, FormLabel, Input, Typography } from '@mui/joy';
import { GoodModal } from '~/common/components/GoodModal';
import { useOptimaLayout } from '~/common/layout/optima/useOptimaLayout';

import { sendRequest } from 'config/action';
import { useFirebaseStore } from 'config/store-firebase';
import { useWalletStore } from 'config/store-wallet';
import { RenderCodeMemo } from '../chat/components/message/blocks/code/RenderCode';
import WalletIcon from '@mui/icons-material/Wallet';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { addSnackbar } from '~/common/components/useSnackbarsStore';

export function WalletModal() {

    // external state
    const {
        closeWallet,
        openWallet,
        showWallet,
    } = useOptimaLayout();

    const [withdrawAddress, setWithdrawAddress] = useState("")
    const [withdrawAmount, setWithdrawAmount] = useState<number>()
    const [pendingWithdraw, setPendingWithdraw] = useState(false)

    const { idToken } = useFirebaseStore()
    const { address, amount, setAmount, setAddress } = useWalletStore()

    useEffect(() => {
        const get_wallet = async () => {
            const response = await sendRequest({ method: "GET", url: "get-wallet", idToken })
            setAddress(response.address)
            setAmount(response.stake_amount)
        }

        get_wallet()
    }, [sendRequest])

    const withdraw = async () => {
        setPendingWithdraw(true)
        const response = await sendRequest({
            url: "withdraw",
            idToken,
            body: { address: withdrawAddress, amount: withdrawAmount }
        })
        setPendingWithdraw(false)
        
        if (response.status === "success") {
            // Show success notification
            addSnackbar({
                key: 'withdraw-success',
                type: 'success',
                message: 'Your withdraw has been approved.',
                overrides: {
                    autoHideDuration: 5000,
                },
            });
            setAmount(response.stake_amount) // Update balance
        } else {
            // Show error notification
            addSnackbar({
                key: 'withdraw-failed',
                type: 'issue',
                message: response.error,
                // overrides: {
                //     autoHideDuration: 5000,
                // },
            });
        }
    }

    return <>
        {showWallet &&
            <GoodModal
                startButton={
                    <Button
                        loading={pendingWithdraw}
                        variant='solid'
                        onClick={withdraw}
                    >
                        Withdraw
                    </Button>
                }
                title={<>My <b>Wallet</b></>}
                open onClose={closeWallet}
                sx={{
                    overflow: 'auto',
                }}
            >
                <Divider />
                <Box>
                    <Alert variant='soft' color='warning' sx={{ flexDirection: 'column', alignItems: 'start', mb: 2 }}>
                        <Typography level='title-md' color='warning' sx={{ flexGrow: 1 }}>
                            After you send your COM to below address, it will appear within 5 minutes
                            <p>Emission will be added every 15 minutes</p>
                            Our delegation fee is 0%
                        </Typography>
                    </Alert>

                    {address &&
                        <RenderCodeMemo
                            sx={{
                                backgroundColor: 'neutral.plainHoverBg',
                                boxShadow: 'md',
                                fontFamily: 'code',
                                borderRadius: 'var(--joy-radius-sm)',
                                mb: 2
                            }}
                            key='code-address'
                            codeBlock={{
                                blockCode: address,
                                blockTitle: "Address",
                                complete: true,
                                type: "code"
                            }} />
                    }

                    Your Balance: <b>{amount}</b> COM
                </Box>

                <Divider />

                <Box>
                    <FormControl sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                            <FormLabel>Withdraw Address</FormLabel>
                        </Box>
                        <Input
                            id="withdraw-address"
                            variant={'outlined'}
                            value={withdrawAddress}
                            onChange={e => { setWithdrawAddress(e.target.value) }}
                            placeholder="ss58 Address"
                            type='text'
                            startDecorator={<WalletIcon />}
                        />
                    </FormControl>

                    <FormControl>
                        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                            <FormLabel>Amount</FormLabel>
                        </Box>
                        <Input
                            id="withdraw-amount"
                            variant={'outlined'}
                            value={withdrawAmount}
                            onChange={e => { setWithdrawAmount(Number(e.target.value)) }}
                            placeholder="Amount"
                            type='number'
                            startDecorator={<AttachMoneyIcon />}
                        />
                    </FormControl>
                </Box>

            </GoodModal>}
    </>;
}