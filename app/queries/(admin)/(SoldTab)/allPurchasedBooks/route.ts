import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
      const purchasedBooks = await prisma.purchasedBook.findMany({
          include: {
              user: {
                  select: {
                      memberID: true
                  }
              }
          }
      });
      console.log("here purchased books", purchasedBooks);
    return NextResponse.json(purchasedBooks);
  } catch (error) {
    console.error('Error fetching purchasedBooks:', error);
    return NextResponse.json({ error: 'Failed to fetch purchasedBooks' }, { status: 500 });
  }
}