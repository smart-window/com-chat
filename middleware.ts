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
import { prismaDb } from '~/server/prisma/prismaDb';

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
    const response = await fetch(`${process.env.STAKE_FETCH_URL}/staking.json`);
    const stake_data = await response.json();
    const stake_amount = (stake_data[address] || 0) / 1_000_000_000
    console.log(`Staking amount: ${stake_amount}`);

    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const history_count = await prismaDb.history.count({
      where: {
        walletAddress: address,
        createdAt: {
          gte: oneDayAgo,
        },
      },
    });

    const rate_limit = Math.floor(stake_amount / 50)
    if (address != env.WHITE_LISTED_WALLET) {
      if (rate_limit < history_count) {
        return new NextResponse(`You have exceeded the rate limit. Your rate limit: ${rate_limit} calls/day. Please increase your staking amount.`, {
          status: 400,
        });
      }
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