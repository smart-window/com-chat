/**
 * Middleware to protect `com-chat` with HTTP Basic Authentication
 *
 * For more information on how to deploy with HTTP Basic Authentication, see:
 *  - [deploy-authentication.md](docs/deploy-authentication.md)
 */

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { cryptoWaitReady, signatureVerify } from '@polkadot/util-crypto';
import fetch from 'node-fetch';
import { env } from '~/server/env.mjs';

// noinspection JSUnusedGlobalSymbols
export async function middleware(req: NextRequest) {

  const address = req.headers.get('address');
  const signature = req.headers.get('signature');
  const message = req.headers.get('message');

  if (!address || !signature || !message) {
    return new NextResponse(`Signature is required. Please connect your wallet.`, {
      status: 401,
    });
  }

  try {
    await cryptoWaitReady();

    // Verify the signature
    const { isValid } = signatureVerify(message, signature, address);
    if (!isValid) {
      return new NextResponse(`Signature is not valid.`, {
        status: 401,
      });
    }
    
    // Check expired signature
    const timestamp = Number(message.split("TimeStamp: ")[1])
    const current = Date.now()
    if ((current - timestamp) > Number(env.NEXT_PUBLIC_SIGNATURE_TIMEOUT)) {
      return new NextResponse(`Signature has been expired! Please sign again.`, {
        status: 400,
      });
    }

    // Check staking amount
    const payload = {
      "id": 1,
      "jsonrpc": "2.0",
      "method": "subspace_getModuleInfo",
      "params": [env.NEXT_PUBLIC_COMCHAT_ADDRESS, 0]
    }

    const response = await fetch(env.HTTPS_PROVIDER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json' // This tells the API you're sending JSON
      },
      body: JSON.stringify(payload) // Converts your data object to JSON string
    });

    if (!response.ok) {
      return new NextResponse(`Unable to fetch staking info. Please relax a bit while.`, {
        status: 400,
      });
    }

    const responseData = await response.json();
    const stake_data = responseData["result"]["stats"]["stake_from"].find((item: any) => item[0] === address);
    const stake_amount = stake_data ? stake_data[1] : null;

    if (stake_amount < Number(env.MIN_STAKE) * 1000000000) {
      return new NextResponse(`Your staking amount is under 10000 COMAI. Please increase your staking amount.`, {
        status: 400,
      });
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Error:', error);
    return new NextResponse(`Failed to fetch stake data`, {
      status: 500,
    });
  }

}

// Response to send when authentication is required
const unauthResponse: ResponseInit = {
  status: 401,
  headers: {
    'WWW-Authenticate': 'Basic realm="Secure com-chat"',
  },
};

export const config = {
  matcher: [
    // Include root
    // '/',
    // Include pages
    // '/(call|index|news|personas|link)(.*)',
    // Include API routes
    // '/api(.*)',
    '/api/llms/stream',
    // Note: this excludes _next, /images etc..
  ],
};