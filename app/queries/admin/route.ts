// app/api/users/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import email from 'next-auth/providers/email';

const prisma = new PrismaClient();

// GET ALL USERS
// GET ALL USERS
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: { subscription: true },
    });
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { name, email } = await request.json();
  const newUser = await prisma.user.create({
    data: { name, email },
  });
  return NextResponse.json(newUser, { status: 201 });
}
