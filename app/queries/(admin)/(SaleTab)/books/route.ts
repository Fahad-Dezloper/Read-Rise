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
        ISBN: parseInt(body.ISBN, 10),
        BookName: body.BookName,
        Author: body.Author,
        Description: body.Description,
        Quantity: parseInt(body.Quantity),
        Price: parseInt(body.Price),
        Images: {
          create: imagesData.map((url : string) => ({
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
        const isbnString = searchParams.get('isbn');
      // console.log("fetching data of isbn", ISBN)
      const ISBN = isbnString ? parseInt(isbnString, 10) : NaN;;
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

// UPDATE: UPDATE THE BOOK
export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const isbnString = searchParams.get('isbn');

    console.log("Updating data of ISBN", isbnString);
    
    const ISBN = isbnString ? parseInt(isbnString, 10) : NaN;
    if (!ISBN) {
      return new Response(JSON.stringify({ error: 'ISBN is required' }), { status: 400 });
    }

    const body = await req.json();
    console.log("data",body)
    const imagesData = Array.isArray(body.Images) ? body.Images : [];
    console.log("imagedata", imagesData)
    const updateBook = await prisma.book.update({
       where: {
        ISBN: ISBN,
      },
      data: {
        BookName: body.BookName,
        Author: body.Author,
        Description: body.Description,
        Quantity: parseInt(body.Quantity),
        Price: parseInt(body.Price),
        Images: {
          create: imagesData.map((url : string) => ({
            url,
          })),
        },
      },
    });

    console.log(updateBook)
    return NextResponse.json(updateBook, { status: 201 });
  } catch (error) {
    console.error("Error adding book:", error);
    return NextResponse.json({ error: "Unable to add book" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const isbnString = searchParams.get('isbn');

    if (!isbnString) {
      return new Response(JSON.stringify({ error: 'ISBN is required' }), { status: 400 });
    }

    const ISBN = parseInt(isbnString, 10);
    if (isNaN(ISBN)) {
      return new Response(JSON.stringify({ error: 'Invalid ISBN' }), { status: 400 });
    }

    const deletedBook = await prisma.book.delete({
      where: {
        ISBN: ISBN,
      },
    });

    return NextResponse.json(deletedBook, { status: 200 });
  } catch (error) {
    console.error("Error deleting book:", error);
    return NextResponse.json({ error: "Unable to delete book" }, { status: 500 });
  }
}