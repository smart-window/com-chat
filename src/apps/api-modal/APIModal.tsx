import { useEffect, useState } from 'react';

import { Alert, Box, Divider, FormControl, FormLabel, Input, Link, Typography } from '@mui/joy';
import { GoodModal } from '~/common/components/GoodModal';
import { useOptimaLayout } from '~/common/layout/optima/useOptimaLayout';

import { sendRequest } from 'config/action';
import { useFirebaseStore } from 'config/store-firebase';
import { useAPIStore } from 'config/store-api';
import { RenderCodeMemo } from '../../modules/blocks/code/RenderCode';
import { useWalletStore } from 'config/store-wallet';

export function APIModal() {

    // external state
    const {
        closeAPI,
        openAPI,
        showAPI,
    } = useOptimaLayout();

    const { idToken } = useFirebaseStore()
    const { apiKey, setAPIKey } = useAPIStore()
    const { amount } = useWalletStore()

    useEffect(() => {
        const get_api_key = async () => {
            const response = await sendRequest({ method: "GET", url: "get-api-key", idToken })
            setAPIKey(response.api_key)
        }

        get_api_key()
    }, [sendRequest])

    return <>
        {showAPI &&
            <GoodModal
                title={<b>My API Key</b>}
                open onClose={closeAPI}
                sx={{
                    overflow: 'auto',
                }}
            >
                <Divider />
                <Box>
                    <Alert variant='soft' color='warning' sx={{ flexDirection: 'column', alignItems: 'start', mb: 2 }}>
                        <Typography level='title-md' color='warning' sx={{ flexGrow: 1 }}>
                            Your RPM = (Your Balance / 100) + 1<br />
                            <b>Your Balance:</b> {amount} COM<br />
                            <b>Rate limit per Minute(RPM):</b> {amount !== null ? Math.floor(amount / 100) + 1 : 1} {/* Default to 0 (or another appropriate value) if amount is null */}
                        </Typography>
                    </Alert>

                    {apiKey &&
                        <>
                            <RenderCodeMemo
                                sx={{
                                    backgroundColor: 'neutral.plainHoverBg',
                                    boxShadow: 'md',
                                    fontFamily: 'code',
                                    fontSize: 14,
                                    borderRadius: 'var(--joy-radius-sm)',
                                    mb: 2
                                }}
                                key='code-address'
                                codeBlock={{
                                    blockCode: apiKey,
                                    blockTitle: "Address",
                                    complete: true,
                                    type: "code"
                                }} />
                            <RenderCodeMemo
                                sx={{
                                    backgroundColor: 'neutral.plainHoverBg',
                                    boxShadow: 'md',
                                    fontFamily: 'code',
                                    fontSize: 12,
                                    borderRadius: 'var(--joy-radius-sm)',
                                    mb: 2,
                                    whiteSpace: "break-spaces",
                                }}
                                key='format'
                                codeBlock={{
                                    blockCode: `Endpoint:
    ${process.env.NEXT_PUBLIC_API_URL}/query
Headers: 
    "Content-Type": "application/json"
    "api-key": "${apiKey}"
Body:
    {
        "prompt": {YOUR_PROMPT_MESSAGE} // ex: "Hello, World!"
        "service": {YOUR_SERVICE} // openai | openrouter
        "model": {YOUR_MODEL} // ex: gpt-3.5-turbo | openrouter/auto
    }`,
                                    blockTitle: "Address",
                                    complete: true,
                                    type: "code"
                                }} />
                        </>
                    }
                    <Alert variant='soft' color='primary' sx={{ flexDirection: 'column', alignItems: 'start', mb: 2 }}>
                        <Typography level='title-md' color='primary' sx={{ flexGrow: 1 }}>
                            <b>Model Reference</b><br />
                            <b>OpenAI:</b> <Link target="_blank" href='https://platform.openai.com/docs/models/overview'>https://platform.openai.com/docs/models/overview</Link><br />
                            <b>OpenRouter:</b> <Link target="_blank" href='https://openrouter.ai/docs#models'>https://openrouter.ai/docs#models</Link>
                        </Typography>
                    </Alert>
                </Box>

                <Divider />

            </GoodModal>}
    </>;
}