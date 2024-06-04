"use client";
import Button from '@mui/joy/Button';
import Divider from '@mui/joy/Divider';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import ModalClose from '@mui/joy/ModalClose';
import WalletOutlinedIcon from '@mui/icons-material/WalletOutlined';
import { useOptimaLayout } from '~/common/layout/optima/useOptimaLayout';
import { Alert, IconButton, Tooltip, Typography } from '@mui/joy';
import { copyToClipboard } from '~/common/util/clipboardUtils';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { frontendSideFetch } from '~/common/util/clientFetchers';
import { useEffect, useState } from 'react';
import { Link } from '~/common/components/Link';

export const APIModal = () => {
    const {
        closeAPI,
        showAPI,
    } = useOptimaLayout();

    const handleCopyRawJson = () => {
        if (apiKey) {
            copyToClipboard(apiKey, "API Key");
        }
    };
    const [loading, setLoading] = useState(false)
    const [apiKey, setApiKey] = useState(null)

    useEffect(() => {
        const getAPIKey = async () => {
            const response = await frontendSideFetch('/api/key/get', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'address': localStorage.getItem('walletAddress') || '',
                    'signature': localStorage.getItem('walletSignature') || '',
                    'message': localStorage.getItem('signMessage') || '',
                },
            });

            const data = await response.json();
            setApiKey(data?.apiKey)
        }
        getAPIKey()
    }, [])

    const createAPIKey = async () => {
        setLoading(true)

        const response = await frontendSideFetch('/api/key/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'address': localStorage.getItem('walletAddress') || '',
                'signature': localStorage.getItem('walletSignature') || '',
                'message': localStorage.getItem('signMessage') || '',
            },
        });
        const data = await response.json();
        setApiKey(data?.apiKey)

        setLoading(false)
    }

    return (
        <Modal open={showAPI} onClose={closeAPI}>
            <ModalDialog variant="outlined" role="alertdialog">
                <ModalClose />
                <DialogTitle>
                    <WalletOutlinedIcon />
                    API Key
                </DialogTitle>
                <Divider />
                <DialogContent sx={{ gap: 2 }}>
                    <Alert variant='soft' color='success'>
                        <Typography>
                            {apiKey || "Click below button to generate your api key."}
                        </Typography>
                        <Tooltip title='Copy JSON to clipboard'>
                            <IconButton variant='outlined' onClick={handleCopyRawJson} sx={{ ml: 'auto' }}>
                                <ContentCopyIcon />
                            </IconButton>
                        </Tooltip>
                    </Alert>
                    <Typography>
                        Please look at the api documentation to learn how to use comchat api.<br />
                        <Link href='https://docs.comchat.io/docs/api' target='_blank'>https://docs.comchat.io/docs/api</Link>
                    </Typography>
                    <Button loading={loading} onClick={createAPIKey}>Generate API Key</Button>
                </DialogContent>
            </ModalDialog>
        </Modal>
    );
};
