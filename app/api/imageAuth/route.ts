import { NextResponse } from 'next/server';
import crypto from 'crypto';

// Ensure that privateKey is defined and is a string.
const privateKey: string = process.env.PRIVATE_KEY as string;

// Define the request type to avoid implicit 'any' type errors.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token') || crypto.randomUUID();
  const expire = searchParams.get('expire') || (Math.floor(Date.now() / 1000) + 2400).toString();

  // Check if privateKey is defined before using it to avoid undefined errors.
  if (!privateKey) {
    throw new Error('Private key is not defined');
  }

  const signature = crypto.createHmac('sha1', privateKey).update(token + expire).digest('hex');

  return NextResponse.json({
    token,
    expire,
    signature
  });
}
