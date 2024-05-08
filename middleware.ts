/**
 * Middleware to protect `com-chat` with HTTP Basic Authentication
 *
 * For more information on how to deploy with HTTP Basic Authentication, see:
 *  - [deploy-authentication.md](docs/deploy-authentication.md)
 */

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';


// noinspection JSUnusedGlobalSymbols
export function middleware(request: NextRequest) {

  const authHeader = request.headers.get('Authorization');
  if (authHeader != `Bearer ${process.env.NEXT_PUBLIC_SECRET}`) {
    return new Response('Unauthorized', unauthResponse);
  }

  return NextResponse.next();
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
    '/api(.*)',
    // Note: this excludes _next, /images etc..
  ],
};