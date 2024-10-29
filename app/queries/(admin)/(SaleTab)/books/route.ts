import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST: Add a new book
export async function POST(req: Request) {
  try {
    const body = await req.json();
    // console.log("data",body)
    const imagesData = Array.isArray(body.Images) ? body.Images : [];
    // console.log("imagedata", imagesData)
    const newBook = await prisma.book.create({
      data: {
        ISBN: body.ISBN,
        BookName: body.BookName,
        Author: body.Author,
        Description: body.Description,
        Quantity: parseInt(body.Quantity),
        Price: parseInt(body.Price),
        Images: {
          create: imagesData.map((url) => ({
            url,
          })),
        },
      },
    });

    // console.log(newBook)
    return NextResponse.json(newBook, { status: 201 });
  } catch (error) {
    console.error("Error adding book:", error);
    return NextResponse.json({ error: "Unable to add book" }, { status: 500 });
  }
}


// FETCH: FETCH THE BOOK
export async function GET(req: Request) {
    // console.log("fetching data")
    try {
        const { searchParams } = new URL(req.url);
        const ISBN = searchParams.get('isbn');
        // console.log("fetching data of isbn", ISBN)
    if (!ISBN) {
      return new Response(JSON.stringify({ error: 'ISBN is required' }), { status: 400 });
        }
        
        const book = await prisma.book.findUnique({
            where: {
                ISBN: ISBN,
          },
            include: {
                Images: true,
          },
        });
        
    if (!book) {
      return new Response(JSON.stringify({ error: 'Book not found' }), { status: 404 });
    }

      console.log(book)
    return new Response(JSON.stringify(book), { status: 200 });
    } catch (error) {
        console.log("Error fetching Books: ", error);
    }
}