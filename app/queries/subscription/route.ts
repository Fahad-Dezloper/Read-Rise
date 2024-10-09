// app/api/subscription/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET Subscription
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
    where: { email: String(email) },
    include: { subscription: true },
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    console.log("subscription",user)
  return NextResponse.json(user);
  } catch (error) {
      console.error(error);
      return NextResponse.json({ message: 'Error fetching subscription details'}, {status: 500});
  }
}