import { NextRequest, NextResponse } from 'next/server';
import { prismaDb } from '~/server/prisma/prismaDb';
const { v4: uuidv4 } = require('uuid');

const generateAPIKey = async (req: NextRequest) => {
  const address = req.headers.get('address');

  if (!address) {
    return new NextResponse(`Address not found in your request.`, {
      status: 400,
    });
  }
  const apiKey = "comchat-" + uuidv4();
  const result = await prismaDb.api.upsert({
    where: {
      walletAddress: address
    },
    update: { apiKey },
    create: {
      walletAddress: address,
      apiKey
    },
  });

  // You can now use the data from the request body
  return NextResponse.json({ apiKey: result.apiKey });
}

export const runtime = 'edge';
export { generateAPIKey as POST };
