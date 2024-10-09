// app/api/users/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


// GET USER
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json(user);
}


// UPDATE USER
export async function PUT(req: Request) {
  const { email, name, phoneNumber } = await req.json();

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 })
  }

  const updateUser = await prisma.user.update({
    where: { email },
    data: {
      name,
      phoneNumber,
    },
  });

  return NextResponse.json(updateUser)
}