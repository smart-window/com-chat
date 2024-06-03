import { NextRequest, NextResponse } from 'next/server';
import { prismaDb } from '~/server/prisma/prismaDb';

const getAPIKey = async (req: NextRequest) => {
  const address = req.headers.get('address');

  if (!address) {
    return new NextResponse(`Address not found in your request.`, {
      status: 400,
    });
  }

  const result = await prismaDb.api.findFirst({
    where: {
      walletAddress: address,
    },
  });

  // You can now use the data from the request body
  return NextResponse.json({ apiKey: result ? result.apiKey : null });
}

export const runtime = 'edge';
export { getAPIKey as GET };
